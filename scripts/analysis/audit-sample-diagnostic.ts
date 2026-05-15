/**
 * Ad-hoc AuditSample diagnostic for the May 2026 value-rate investigation.
 *
 * Mirrors the production `/api/admin/audit-samples?days=14` aggregation but
 * runs locally against DATABASE_URL so we don't need to round-trip through
 * the admin UI to answer "is the 16.7% value rate working-as-designed
 * (empty_gaps) or a regression (parse_error/api_error)?"
 *
 * Run: npx tsx scripts/analysis/audit-sample-diagnostic.ts [days]
 * Default window: 14 days.
 */
import 'dotenv/config';
import { PrismaClient } from '../../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const days = parseInt(process.argv[2] || '14', 10);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [byOutcome, successAgg, samples] = await Promise.all([
    prisma.auditSample.groupBy({
      by: ['outcome'],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      _avg: { applicablePatternCount: true, gapCount: true, imageCount: true, latencyMs: true },
    }),
    prisma.auditSample.aggregate({
      where: { createdAt: { gte: since }, outcome: 'success' },
      _avg: { score: true, maxScore: true, gapCount: true },
    }),
    prisma.auditSample.findMany({
      where: { createdAt: { gte: since }, outcome: { in: ['parse_error', 'api_error'] } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        createdAt: true,
        outcome: true,
        productType: true,
        errorReason: true,
        errorDetail: true,
        latencyMs: true,
      },
    }),
  ]);

  const total = byOutcome.reduce((s, r) => s + r._count._all, 0);

  console.log(`\n=== AuditSample diagnostic — last ${days} days (since ${since.toISOString()}) ===\n`);
  console.log(`Total samples: ${total}\n`);

  console.log('Outcome distribution:');
  console.log('  outcome'.padEnd(20), 'n'.padEnd(6), 'pct'.padEnd(8), 'avg_patterns', 'avg_gaps', 'avg_imgs', 'avg_latency_ms');
  for (const row of byOutcome.sort((a, b) => b._count._all - a._count._all)) {
    const pct = total ? ((row._count._all / total) * 100).toFixed(1) + '%' : '-';
    console.log(
      '  ' + row.outcome.padEnd(18),
      String(row._count._all).padEnd(6),
      pct.padEnd(8),
      (row._avg.applicablePatternCount ?? 0).toFixed(1).padStart(12),
      (row._avg.gapCount ?? 0).toFixed(1).padStart(8),
      (row._avg.imageCount ?? 0).toFixed(1).padStart(8),
      Math.round(row._avg.latencyMs ?? 0).toString().padStart(14)
    );
  }

  console.log('\nSuccess-row aggregates:');
  console.log(`  avg score: ${successAgg._avg.score?.toFixed(1) ?? 'n/a'} / ${successAgg._avg.maxScore?.toFixed(1) ?? 'n/a'}`);
  console.log(`  avg gapCount: ${successAgg._avg.gapCount?.toFixed(1) ?? 'n/a'}`);

  if (samples.length > 0) {
    console.log('\nLast 10 error rows (parse_error | api_error):');
    for (const s of samples) {
      console.log(`  ${s.createdAt.toISOString()} | ${s.outcome.padEnd(11)} | ${(s.productType ?? '-').padEnd(20)} | ${s.errorReason ?? '-'}`);
      if (s.errorDetail) console.log(`    detail: ${s.errorDetail.slice(0, 200)}`);
    }
  } else {
    console.log('\nNo parse_error / api_error rows in window.');
  }

  console.log('\nInterpretation guide:');
  console.log('  - empty_gaps dominant  → value rate is working-as-designed; users uploading non-AI surfaces. UX fix (product-type guidance).');
  console.log('  - parse_error/api_error spike → real regression. Bisect against Apr 28 prompt restructure (commit 5277360).');
  console.log('  - success rows with low avg_gaps → prompt too conservative post-restructure. Tune cap/evidence rules.');
}

main()
  .catch((err) => {
    console.error('Diagnostic failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
