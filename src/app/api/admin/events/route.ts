import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Event-counts for the admin funnel view. Groups UiEvent (the server-side mirror
// of the Clarity custom events) by name over a window, so "how many used CTA X"
// is a query against our own DB instead of a manual Clarity export. Excludes our
// own test/admin/monitor sessions by default, mirroring the audit-samples route.
export const GET = withAdminAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const days = Math.min(parseInt(searchParams.get('days') || '30', 10) || 30, 90);
  const includeTest = searchParams.get('includeTest') === '1';
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const excludeTestClause = includeTest
    ? {}
    : { OR: [{ role: null }, { role: { notIn: ['test', 'admin', 'monitor'] } }] };

  const where = { createdAt: { gte: since }, ...excludeTestClause };

  const grouped = await prisma.uiEvent.groupBy({
    by: ['name'],
    where,
    _count: { _all: true },
  });

  const events = grouped
    .map((g) => ({ name: g.name, count: g._count._all }))
    .sort((a, b) => b.count - a.count);

  const total = events.reduce((sum, e) => sum + e.count, 0);

  return NextResponse.json({ windowDays: days, total, events, includeTest });
});
