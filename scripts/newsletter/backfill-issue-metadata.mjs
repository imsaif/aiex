/**
 * Backfill `products` and `readMinutes` on existing newsletter drafts.
 *
 * Both columns are derived at write time by the generator, so only rows created
 * before that shipped need this. Re-run it after editing PRODUCT_KEYWORDS in
 * src/lib/newsletter/products.ts — the stored values are denormalised and will
 * otherwise keep the old tagging (a new chip would match nothing until you do).
 *
 * Safe to re-run: it recomputes from source and writes only rows whose stored
 * value actually differs.
 *
 * Usage (from repo root):
 *   node --env-file=.env.local scripts/newsletter/backfill-issue-metadata.mjs          # dry run
 *   node --env-file=.env.local scripts/newsletter/backfill-issue-metadata.mjs --apply  # write
 */
import { PrismaClient } from '../../src/generated/prisma/index.js';
import { productsForIssue, computeReadMinutes } from '../../src/lib/newsletter/products.ts';

const APPLY = process.argv.includes('--apply');
const prisma = new PrismaClient();

const drafts = await prisma.newsletterDraft.findMany({
  select: { id: true, slug: true, title: true, summary: true, content: true, structuredData: true, products: true, readMinutes: true },
  orderBy: { publishDate: 'desc' },
});

const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const changes = [];

for (const d of drafts) {
  const products = productsForIssue(d.title, d.summary, d.structuredData);
  const readMinutes = computeReadMinutes(d.content);
  if (!same(products, d.products ?? []) || readMinutes !== d.readMinutes) {
    changes.push({ id: d.id, slug: d.slug, products, readMinutes, wasProducts: d.products ?? [], wasRead: d.readMinutes });
  }
}

console.log(`Scanned ${drafts.length} drafts — ${changes.length} need updating\n`);

if (!changes.length) {
  console.log('✅ Nothing to do; stored values already match.');
} else {
  for (const c of changes.slice(0, 12)) {
    console.log(`  ${c.slug.slice(0, 46)}`);
    console.log(`     products: [${c.wasProducts.join(', ')}] -> [${c.products.join(', ')}]`);
    console.log(`     readMins: ${c.wasRead ?? 'null'} -> ${c.readMinutes}`);
  }
  if (changes.length > 12) console.log(`  … and ${changes.length - 12} more`);

  // Distribution, so a bad keyword map is obvious BEFORE writing.
  const counts = new Map();
  for (const c of changes) for (const p of c.products) counts.set(p, (counts.get(p) || 0) + 1);
  console.log('\n  Product tag distribution across changed rows:');
  for (const [p, n] of [...counts].sort((a, b) => b[1] - a[1])) console.log(`     ${p.padEnd(12)} ${n}`);
  const untagged = changes.filter((c) => c.products.length === 0).length;
  console.log(`     (untagged rows: ${untagged}/${changes.length})`);

  if (APPLY) {
    for (const c of changes) {
      await prisma.newsletterDraft.update({
        where: { id: c.id },
        data: { products: c.products, readMinutes: c.readMinutes },
      });
    }
    console.log(`\n✅ Updated ${changes.length} row(s).`);
    console.log(
      `\nFlush the /news ISR cache (a direct write revalidates nothing; TTL is 1h):\n` +
        `  curl -sL -o /dev/null -w '%{http_code}\\n' \\\n` +
        `    "https://www.aiuxdesign.guide/api/newsletter/publish?id=<any-published-id>&secret=$ADMIN_APPROVE_SECRET&confirm=true"`
    );
  } else {
    console.log('\nDry run — re-run with --apply to write.');
  }
}

await prisma.$disconnect();
