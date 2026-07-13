import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// P3 — the trustworthy audit funnel.
//
// Design principle (see docs/specs/audit-funnel-instrumentation-fix.md):
// the funnel SPINE (audit ran → completed with value) is read from `AuditSample`
// — server truth, not the lossy client beacon. The client `UiEvent`s are used only
// for the branches that have no server call: the demo impression (lower-bound) and
// the post-result actions, which we join to their audit by `sessionId` so the rate
// stays trustworthy even when client events are lost (the denominator is server-side).

// "Took a meaningful next step with their results."
const POST_RESULT_ACTIONS = [
  'audit_handoff_copied',
  'audit_resource_clicked',
  'service_cta_clicked',
  'audit_email_report_sent',
  'audit_saved',
];

function getAdminHashes(): string[] {
  return (process.env.ADMIN_AUDIT_IP_HASHES || '').split(',').map((s) => s.trim()).filter(Boolean);
}

export const GET = withAdminAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const days = Math.min(parseInt(searchParams.get('days') || '30', 10) || 30, 90);
  const includeTest = searchParams.get('includeTest') === '1';
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const adminHashes = getAdminHashes();

  // Real-user filter — note: `not`/`notIn` exclude NULL roles, and real users have
  // role=null, so we must OR-in null explicitly (this is the bug that hid every real
  // user in the ad-hoc scripts; see the spec).
  const realRole = { OR: [{ role: null }, { role: { notIn: ['test', 'admin', 'monitor'] } }] };
  const sampleWhere = includeTest
    ? { createdAt: { gte: since } }
    : {
        AND: [
          { createdAt: { gte: since } },
          realRole,
          adminHashes.length > 0 ? { OR: [{ ipHash: null }, { ipHash: { notIn: adminHashes } }] } : {},
        ],
      };
  const eventWhere = includeTest
    ? { createdAt: { gte: since } }
    : { createdAt: { gte: since }, ...realRole };

  const [byOutcome, eventCounts, successSessions] = await Promise.all([
    prisma.auditSample.groupBy({ by: ['outcome'], where: sampleWhere, _count: { _all: true } }),
    prisma.uiEvent.groupBy({ by: ['name'], where: eventWhere, _count: { _all: true } }),
    // Success rows that carry a join key (sessionId populated 2026-07-13 onward).
    prisma.auditSample.findMany({
      where: { AND: [sampleWhere, { outcome: 'success' }, { sessionId: { not: null } }] },
      select: { sessionId: true },
    }),
  ]);

  const outcomeCount = (o: string) => byOutcome.find((r) => r.outcome === o)?._count._all ?? 0;
  const started = byOutcome.reduce((s, r) => s + r._count._all, 0);
  const completedWithValue = outcomeCount('success');

  const evCount = (n: string) => eventCounts.find((e) => e.name === n)?._count._all ?? 0;

  // Post-result join: of the success audits we can join (have a sessionId), how many
  // have at least one post-result-action event tied to that session?
  const sessionIds = successSessions.map((s) => s.sessionId).filter((x): x is string => !!x);
  let successWithAnyAction = 0;
  const byAction: Record<string, number> = Object.fromEntries(POST_RESULT_ACTIONS.map((a) => [a, 0]));
  if (sessionIds.length > 0) {
    const actionEvents = await prisma.uiEvent.findMany({
      where: { sessionId: { in: sessionIds }, name: { in: POST_RESULT_ACTIONS } },
      select: { sessionId: true, name: true },
    });
    const sessionsWithAction = new Set<string>();
    for (const e of actionEvents) {
      if (e.sessionId) sessionsWithAction.add(e.sessionId);
      if (e.name in byAction) byAction[e.name] += 1;
    }
    successWithAnyAction = sessionsWithAction.size;
  }

  return NextResponse.json({
    windowDays: days,
    includeTest,
    spine: {
      demoViewed: evCount('audit_demo_viewed'), // impression, lower-bound
      startRealClicked: evCount('audit_demo_start_real_clicked'), // intent, lower-bound
      started, // server truth
      completedWithValue, // server truth
    },
    outcomes: {
      success: completedWithValue,
      empty_gaps: outcomeCount('empty_gaps'),
      no_ai_surface: outcomeCount('no_ai_surface'),
      errors: outcomeCount('parse_error') + outcomeCount('api_error') + outcomeCount('rate_limited'),
    },
    postResult: {
      // Denominator is success audits that are JOINABLE (have a sessionId). Historical
      // success rows (pre-2026-07-13) have null sessionId and are excluded from the rate.
      joinableSuccess: sessionIds.length,
      successWithAnyAction,
      actionRate: sessionIds.length ? successWithAnyAction / sessionIds.length : null,
      byAction,
    },
  });
});
