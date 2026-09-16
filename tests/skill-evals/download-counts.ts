#!/usr/bin/env ts-node
/**
 * Read-only: how many people actually took the skill pack, and how many could be told
 * about an update.
 *
 * Two gotchas this query exists to avoid, both already paid for once on this project:
 *
 * 1. Role filtering. `role: { not: 'admin' }` silently drops every row whose role is NULL,
 *    and real visitors are exactly the rows with a null role. The filter has to be an
 *    explicit "null OR not admin/test" or the numbers come out near zero and look like a
 *    traffic problem.
 *
 * 2. Downloads are not subscribers. The browser download fires before the email is sent,
 *    and the email is best-effort. So "downloaded" and "reachable by email" are different
 *    populations, and only the second can be followed up. Reporting one as the other would
 *    overstate the reach of any update mail.
 */
import './env';
import { PrismaClient } from '../../src/generated/prisma';

const prisma = new PrismaClient();

/** Real visitors: role is null, or set to something other than admin/test. */
const REAL_USER = {
  OR: [{ role: null }, { role: { notIn: ['admin', 'test'] } }],
};

async function main() {
  const names = [
    'skills_gate_shown',
    'skills_gate_expanded',
    'skills_gate_submitted',
    'skills_gate_pack_downloaded',
    'skills_gate_skipped',
    'skills_gate_dismissed',
  ];

  console.log('=== Skill pack funnel (real users only) ===\n');
  const counts: Record<string, number> = {};
  for (const name of names) {
    counts[name] = await prisma.uiEvent.count({ where: { name, ...REAL_USER } });
  }
  const all = await prisma.uiEvent.count({ where: REAL_USER });
  const shown = counts.skills_gate_shown || 0;

  for (const name of names) {
    const n = counts[name];
    const pct = shown > 0 ? ` (${((n / shown) * 100).toFixed(1)}% of shown)` : '';
    console.log(`  ${name.padEnd(30)} ${String(n).padStart(6)}${pct}`);
  }
  console.log(`  ${'ALL ui events'.padEnd(30)} ${String(all).padStart(6)}`);

  // Which package did people pick? Decides which install instructions an update mail needs.
  console.log('\n=== Downloads by target ===');
  const downloads = await prisma.uiEvent.findMany({
    where: { name: 'skills_gate_pack_downloaded', ...REAL_USER },
    select: { properties: true, createdAt: true },
  });
  const byTarget: Record<string, number> = {};
  downloads.forEach((d) => {
    const t = (d.properties as { target?: string } | null)?.target || 'unknown';
    byTarget[t] = (byTarget[t] || 0) + 1;
  });
  Object.entries(byTarget)
    .sort((a, b) => b[1] - a[1])
    .forEach(([t, n]) => console.log(`  ${t.padEnd(12)} ${n}`));

  if (downloads.length) {
    const dates = downloads.map((d) => d.createdAt).sort((a, b) => +a - +b);
    console.log(`  first: ${dates[0].toISOString().slice(0, 10)}`);
    console.log(`  last:  ${dates[dates.length - 1].toISOString().slice(0, 10)}`);
  }

  // Reachability. A download is anonymous; only an address can be followed up.
  console.log('\n=== Who could actually be told about an update ===');
  const subs = await prisma.subscriber.count();
  const active = await prisma.subscriber.count({ where: { active: true } }).catch(() => -1);
  console.log(`  subscribers total   ${subs}`);
  if (active >= 0) console.log(`  subscribers active  ${active}`);
  console.log(
    `\n  Note: downloads are anonymous events. The overlap with subscribers is not stored,\n` +
      `  so an update mail reaches the subscriber list, not "people who downloaded".`
  );
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
