import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function getAdminHashes(): string[] {
  const raw = process.env.ADMIN_AUDIT_IP_HASHES || '';
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

export const GET = withAdminAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const days = Math.min(parseInt(searchParams.get('days') || '14', 10) || 14, 90);
  const outcome = searchParams.get('outcome');
  const productType = searchParams.get('productType');
  const limit = Math.min(parseInt(searchParams.get('limit') || '200', 10) || 200, 1000);
  const includeTest = searchParams.get('includeTest') === '1';

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const adminHashes = getAdminHashes();

  const excludeTestClause = includeTest
    ? {}
    : {
        AND: [
          { OR: [{ role: null }, { role: { notIn: ['test', 'admin'] } }] },
          adminHashes.length > 0
            ? { OR: [{ ipHash: null }, { ipHash: { notIn: adminHashes } }] }
            : {},
        ],
      };

  const where: Record<string, unknown> = {
    createdAt: { gte: since },
    ...excludeTestClause,
  };
  if (outcome && outcome !== 'all') where.outcome = outcome;
  if (productType && productType !== 'all') where.productType = productType;

  const statsWhere: Record<string, unknown> = {
    createdAt: { gte: since },
    ...excludeTestClause,
  };

  const [samples, totals] = await Promise.all([
    prisma.auditSample.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
    prisma.auditSample.groupBy({
      by: ['outcome'],
      where: statsWhere,
      _count: { _all: true },
    }),
  ]);

  const byOutcome: Record<string, number> = {};
  let total = 0;
  for (const row of totals) {
    byOutcome[row.outcome] = row._count._all;
    total += row._count._all;
  }

  const successCount = byOutcome['success'] ?? 0;
  const emptyGapsCount = byOutcome['empty_gaps'] ?? 0;
  const parseErrorCount = byOutcome['parse_error'] ?? 0;
  const apiErrorCount = byOutcome['api_error'] ?? 0;

  const aggregates = await prisma.auditSample.aggregate({
    where: { ...statsWhere, outcome: 'success' },
    _avg: { score: true, maxScore: true, gapCount: true, latencyMs: true },
  });

  // Separately count what we excluded, so the UI can show "N test rows hidden"
  const excludedCount = includeTest
    ? 0
    : await prisma.auditSample.count({
        where: {
          createdAt: { gte: since },
          OR: [
            { role: { in: ['test', 'admin'] } },
            ...(adminHashes.length > 0 ? [{ ipHash: { in: adminHashes } }] : []),
          ],
        },
      });

  return NextResponse.json({
    samples,
    stats: {
      windowDays: days,
      total,
      byOutcome,
      successRate: total ? successCount / total : 0,
      emptyGapsRate: total ? emptyGapsCount / total : 0,
      errorRate: total ? (parseErrorCount + apiErrorCount) / total : 0,
      avgScore: aggregates._avg.score,
      avgMaxScore: aggregates._avg.maxScore,
      avgGapCount: aggregates._avg.gapCount,
      avgLatencyMs: aggregates._avg.latencyMs,
      excludedCount,
      includeTest,
    },
  });
});
