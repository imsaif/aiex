#!/usr/bin/env ts-node
/**
 * Why does a 424-impression gate capture no emails?
 *
 * The first thing to establish is whether 424 is even a count of people seeing it.
 * `skills_gate_shown` fires from a mount effect, not from an intersection observer, so it
 * counts every page load that RENDERED the component — including loads where it sits far
 * below the fold and nobody ever scrolls to it. If most of the 424 are pattern-page loads,
 * the "0% conversion" is not a conversion rate at all and the fix is to the measurement
 * before anything else.
 *
 * Splits the impressions by path and by source so the two surfaces (the section on pattern
 * pages, the interstitial in the audit flow) can be told apart.
 */
import './env';
import { PrismaClient } from '../../src/generated/prisma';

const prisma = new PrismaClient();
const REAL_USER = { OR: [{ role: null }, { role: { notIn: ['admin', 'test'] } }] };

async function main() {
  const shown = await prisma.uiEvent.findMany({
    where: { name: 'skills_gate_shown', ...REAL_USER },
    select: { path: true, properties: true, createdAt: true, sessionId: true, ipHash: true },
  });

  console.log(`=== ${shown.length} gate impressions ===\n`);

  const byPath: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  shown.forEach((e) => {
    const p = e.path || '(none)';
    byPath[p] = (byPath[p] || 0) + 1;
    const s = (e.properties as { source?: string } | null)?.source || '(none)';
    bySource[s] = (bySource[s] || 0) + 1;
  });

  console.log('By source (which surface rendered it):');
  Object.entries(bySource)
    .sort((a, b) => b[1] - a[1])
    .forEach(([s, n]) => console.log(`  ${s.padEnd(26)} ${n}`));

  console.log('\nBy path (top 12):');
  Object.entries(byPath)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .forEach(([p, n]) => console.log(`  ${p.padEnd(46)} ${n}`));

  // How many DISTINCT people, not page loads. A handful of visitors reloading pattern pages
  // can manufacture hundreds of "impressions" that represent almost no audience.
  const ips = new Set(shown.map((e) => e.ipHash).filter(Boolean));
  console.log(`\nDistinct visitors (by ipHash): ${ips.size}`);
  console.log(`Impressions per visitor:        ${(shown.length / Math.max(ips.size, 1)).toFixed(1)}`);

  // Compare against a control: an element known to be genuinely looked at.
  const uploads = await prisma.uiEvent.count({ where: { name: 'audit_upload_viewed', ...REAL_USER } });
  const demo = await prisma.uiEvent.count({ where: { name: 'audit_demo_viewed', ...REAL_USER } });
  console.log(`\nFor scale: audit_upload_viewed ${uploads}, audit_demo_viewed ${demo}`);
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
