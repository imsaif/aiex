/**
 * Backfill `publishDate` for newsletter drafts that the old publish route re-stamped.
 *
 * Until b434f87 (2026-08-14), POST /api/newsletter/publish and the GET quick-approve
 * path both hardcoded `publishDate: new Date()`, so publishing a backlog draft moved
 * the issue to the day the button was pressed. /news uses `publishDate` for BOTH
 * orderBy and the displayed date, so a re-stamped row hides its real date and can
 * stack two issues onto one day (2026-08-03, again 2026-08-13).
 *
 * `publishDate` is the ISSUE date — what the news is about, encoded in the slug —
 * NOT a "when was the button pressed" timestamp. So the slug is the source of truth
 * here, not createdAt: per .claude/rules/newsletter-and-infra.md, do NOT blanket-set
 * publishDate = createdAt, that clobbers rows corrected by hand in an earlier session.
 *
 * A row is only rewritten when the slug date and the createdAt date AGREE and both
 * disagree with publishDate. Anything ambiguous is reported and skipped.
 *
 * Usage (from repo root):
 *   node --env-file=.env.local scripts/newsletter/backfill-publish-date.mjs          # dry run
 *   node --env-file=.env.local scripts/newsletter/backfill-publish-date.mjs --apply  # write
 */
import { PrismaClient } from '../../src/generated/prisma/index.js';

const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const APPLY = process.argv.includes('--apply');
const prisma = new PrismaClient();

const dayOf = (d) => d.toISOString().slice(0, 10);

/**
 * Pull the issue date out of a slug like `ai-ux-daily-aug-12-...` or
 * `this-week-in-aiux-aug-10-...`. The slug carries no year, so it is taken from
 * createdAt — and the Dec→Jan rollover is handled explicitly: a December slug on a
 * January row belongs to the previous year.
 */
function slugDate(slug, createdAt) {
  const m = slug.match(/-(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-(\d{1,2})(?:-|$)/);
  if (!m) return null;
  const month = MONTHS[m[1]];
  const day = Number(m[2]);
  let year = createdAt.getUTCFullYear();
  if (month === 11 && createdAt.getUTCMonth() === 0) year -= 1;
  if (month === 0 && createdAt.getUTCMonth() === 11) year += 1;
  return new Date(Date.UTC(year, month, day));
}

const drafts = await prisma.newsletterDraft.findMany({
  select: { id: true, slug: true, status: true, publishDate: true, createdAt: true },
  orderBy: { createdAt: 'desc' },
});

const fix = [];
const skip = [];

for (const d of drafts) {
  const target = slugDate(d.slug, d.createdAt);
  if (!target) continue;                              // no date in slug (quiet-day, -held, etc.)
  if (dayOf(target) === dayOf(d.publishDate)) continue; // already correct

  if (dayOf(target) !== dayOf(d.createdAt)) {
    // Slug and createdAt disagree — could be a hand-corrected row. Never guess.
    skip.push({ ...d, target });
    continue;
  }
  // Rewrite to createdAt, not to midnight: it IS the generation instant, and it
  // preserves the cron's publishDate ≈ createdAt convention the fixed route relies on.
  fix.push({ ...d, target: d.createdAt });
}

console.log(`Scanned ${drafts.length} drafts\n`);

if (skip.length) {
  console.log(`⚠️  ${skip.length} ambiguous (slug date ≠ createdAt date) — SKIPPED, review by hand:`);
  for (const s of skip) {
    console.log(`   ${s.slug.slice(0, 55)}\n     pub=${dayOf(s.publishDate)} created=${dayOf(s.createdAt)} slug=${dayOf(s.target)}`);
  }
  console.log('');
}

if (!fix.length) {
  console.log('✅ No rows need backfilling.');
} else {
  console.log(`${APPLY ? 'Rewriting' : 'Would rewrite'} ${fix.length} row(s):`);
  for (const f of fix) {
    console.log(`   ${dayOf(f.publishDate)} → ${dayOf(f.target)}  [${f.status}]  ${f.slug.slice(0, 55)}`);
  }
  if (APPLY) {
    for (const f of fix) {
      await prisma.newsletterDraft.update({
        where: { id: f.id },
        data: { publishDate: f.target },
      });
    }
    console.log(`\n✅ Updated ${fix.length} row(s).`);

    // A direct Prisma write triggers no revalidation, and /news is ISR with
    // revalidate = 3600 — so the stale prerender (wrong dates) can serve for up to
    // an hour. The GET quick-approve path is a status no-op on an already-published
    // draft but still calls revalidatePath('/news'), which is safe to re-hit now
    // that it no longer re-stamps publishDate. Flush it immediately:
    console.log(
      `\nFlush the /news ISR cache (otherwise it self-corrects within the hour):\n` +
        `  curl -sL -o /dev/null -w '%{http_code}\\n' \\\n` +
        `    "https://www.aiuxdesign.guide/api/newsletter/publish?id=${fix[0].id}&secret=$ADMIN_APPROVE_SECRET&confirm=true"`
    );
  } else {
    console.log('\nDry run — re-run with --apply to write.');
  }
}

await prisma.$disconnect();
