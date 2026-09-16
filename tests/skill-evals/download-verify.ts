#!/usr/bin/env ts-node
/**
 * Sanity-check the zero.
 *
 * The funnel query reports 424 gate views and 0 submissions. A literal zero across a
 * 424-view funnel is either a real conversion failure or a broken event, and those call
 * for opposite responses — so it is worth one query to tell them apart before anyone acts.
 *
 * Three independent checks:
 *   1. Is the gate-view event recent, or is 424 a historical total for a gate that has
 *      since been replaced? A dead event name looks identical to a dead funnel.
 *   2. Do subscribers exist whose source points at the skills gate? Those rows are written
 *      by a different code path (the API), so they corroborate or contradict the UiEvent.
 *   3. What other events DO fire? If sibling events on the same page record fine, the
 *      tracking pipe is healthy and the zero is real.
 */
import './env';
import { PrismaClient } from '../../src/generated/prisma';

const prisma = new PrismaClient();
const REAL_USER = { OR: [{ role: null }, { role: { notIn: ['admin', 'test'] } }] };

async function main() {
  console.log('=== 1. Is the gate event current? ===');
  const shownRange = await prisma.uiEvent.aggregate({
    where: { name: 'skills_gate_shown', ...REAL_USER },
    _min: { createdAt: true },
    _max: { createdAt: true },
  });
  console.log(`  first seen ${shownRange._min.createdAt?.toISOString().slice(0, 10)}`);
  console.log(`  last seen  ${shownRange._max.createdAt?.toISOString().slice(0, 10)}`);

  const last7 = await prisma.uiEvent.count({
    where: {
      name: 'skills_gate_shown',
      createdAt: { gte: new Date(Date.now() - 7 * 864e5) },
      ...REAL_USER,
    },
  });
  console.log(`  last 7 days ${last7}`);

  console.log('\n=== 2. Subscribers attributed to the skills gate ===');
  const subs = await prisma.subscriber.findMany({
    select: { source: true, subscribedAt: true },
    orderBy: { subscribedAt: 'desc' },
    take: 500,
  });
  const bySource: Record<string, number> = {};
  subs.forEach((s) => {
    const k = s.source || '(none)';
    bySource[k] = (bySource[k] || 0) + 1;
  });
  Object.entries(bySource)
    .sort((a, b) => b[1] - a[1])
    .forEach(([s, n]) => console.log(`  ${s.padEnd(28)} ${n}`));

  console.log('\n=== 3. Top events overall (is the pipe healthy?) ===');
  const grouped = await prisma.uiEvent.groupBy({
    by: ['name'],
    _count: { name: true },
    orderBy: { _count: { name: 'desc' } },
    take: 15,
  });
  grouped.forEach((g) => console.log(`  ${g.name.padEnd(34)} ${g._count.name}`));
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
