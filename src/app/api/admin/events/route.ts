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

  // Role tagging alone is NOT enough to exclude our own activity: `role` comes
  // from a per-origin localStorage flag, so the same machine shows up tagged on
  // one origin and untagged on another (confirmed: one admin ipHash has produced
  // both `admin` and `null` rows). ipHash exclusion is the durable filter, so it
  // must apply here too — this route feeds the admin event table.
  //
  // Structured as AND rather than spread: both clauses need a top-level `OR`,
  // and spreading them into one object would silently drop the first.
  // Commas OR whitespace — Vercel's value box is a textarea and one-hash-per-line
  // is a natural way to paste it. See the matching note in audit-funnel/route.ts.
  const adminHashes = (process.env.ADMIN_AUDIT_IP_HASHES || '')
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const where = includeTest
    ? { createdAt: { gte: since } }
    : {
        AND: [
          { createdAt: { gte: since } },
          { OR: [{ role: null }, { role: { notIn: ['test', 'admin', 'monitor'] } }] },
          adminHashes.length > 0 ? { OR: [{ ipHash: null }, { ipHash: { notIn: adminHashes } }] } : {},
        ],
      };

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
