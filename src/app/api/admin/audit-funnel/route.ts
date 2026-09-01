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

// Guards: events that SHOULD always read zero. A non-zero count is a defect
// signal, not a usage signal, so they never belong in the volume-sorted event
// table where a quiet guard looks identical to an unused feature. Surfaced as
// a single all-clear/breached row instead.
const GUARD_EVENTS = [
  'audit_intent_suggestions_failed',
  'audit_final_cap_shown',
  'audit_empty_state_retry_clicked',
];

function getAdminHashes(): string[] {
  // Split on commas OR whitespace. Vercel's value box is a textarea, so it's
  // easy to paste one hash per line; a comma-only split would collapse that into
  // a single bogus entry matching nothing, leaving the filter looking configured
  // while excluding no one. Silent no-op filters are the failure mode this whole
  // module exists to avoid, so accept both shapes.
  return (process.env.ADMIN_AUDIT_IP_HASHES || '')
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
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
  // Events need the SAME admin-ipHash exclusion as samples. Role tagging alone
  // is unreliable: `role` comes from a per-origin localStorage flag, and a known
  // admin hash has produced `role=null` event rows (2026-07-14, audit_demo_viewed
  // on `/`) while its AuditSample rows the same month were correctly tagged
  // admin. Three of the five spine steps are event-derived, so without this they
  // stay polluted no matter what the env var says.
  //
  // AND rather than spread: both clauses use a top-level `OR`, and merging them
  // into one object literal would silently drop the first.
  const eventWhere = includeTest
    ? { createdAt: { gte: since } }
    : {
        AND: [
          { createdAt: { gte: since } },
          realRole,
          adminHashes.length > 0 ? { OR: [{ ipHash: null }, { ipHash: { notIn: adminHashes } }] } : {},
        ],
      };

  // Spine steps are counted in PEOPLE (distinct ipHash), not raw events, so the
  // step-to-step percentages compare like with like. Counting raw events here
  // understated the first conversion badly: one person opening the audit three
  // times inflated the denominator threefold while the numerator (audits run)
  // stayed per-person.
  const SPINE_EVENT_NAMES = [
    'audit_demo_viewed',
    'audit_chat_message_sent',
    'service_cta_clicked',
    'service_intake_submitted',
  ];

  const [byOutcome, eventCounts, successSessions, spineEventRows, sampleIdentityRows] = await Promise.all([
    prisma.auditSample.groupBy({ by: ['outcome'], where: sampleWhere, _count: { _all: true } }),
    prisma.uiEvent.groupBy({ by: ['name'], where: eventWhere, _count: { _all: true } }),
    // Success rows that carry a join key (sessionId populated 2026-07-13 onward).
    prisma.auditSample.findMany({
      where: { AND: [sampleWhere, { outcome: 'success' }, { sessionId: { not: null } }] },
      select: { sessionId: true },
    }),
    prisma.uiEvent.findMany({
      where: { ...eventWhere, name: { in: SPINE_EVENT_NAMES } },
      select: { name: true, ipHash: true },
    }),
    prisma.auditSample.findMany({ where: sampleWhere, select: { outcome: true, ipHash: true } }),
  ]);

  // Distinct people in a set of rows. A row with no ipHash can't be deduped, so
  // it counts as its own person — that makes this a slight OVER-count when
  // hashing fails, never an under-count that would flatter a conversion rate.
  // /api/events hashes every request, so in practice nulls are rare.
  function distinctPeople(rows: { ipHash: string | null }[]): number {
    const known = new Set(rows.map((r) => r.ipHash).filter((h): h is string => !!h));
    const unhashed = rows.filter((r) => !r.ipHash).length;
    return known.size + unhashed;
  }

  const peopleForEvent = (name: string) =>
    distinctPeople(spineEventRows.filter((r) => r.name === name));

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
    // The five-number spine: reach → started → value → revenue interest → revenue.
    // This is the whole business in one row. If none of these moved, nothing
    // happened. Everything else on the page is diagnostics you consult only when
    // one of these five moves and you need to know why.
    //
    // `started` and `completedWithValue` are server truth (AuditSample). The
    // bookends are client events and therefore lower bounds — beacons get lost,
    // so a real drop is never SMALLER than what these show.
    // Every step is DISTINCT PEOPLE so the percentages between them are honest.
    // `raw` carries the underlying event/row count for the two browser-measured
    // steps, because "599 opens by 187 people" is itself worth seeing.
    // Every step is DISTINCT PEOPLE so the percentages between them are honest.
    //
    // Steps 1-3 are a true chain (you must open before you upload, upload before
    // you get a result). `engaged` and `revenue` are NOT sequential with each
    // other — both branch off step 3 — so the client rates them against
    // "got a real result", not against the step printed to their left.
    //
    // `engaged` is the real success signal: asking a follow-up means someone is
    // having a conversation about their gaps. Clicking the paid-service CTA is
    // the LAST thing on the page and most people never scroll to it, which made
    // it a measure of scroll depth more than of interest. It's in `postResult`.
    spine: {
      reached: peopleForEvent('audit_demo_viewed'),
      started: distinctPeople(sampleIdentityRows),
      completedWithValue: distinctPeople(sampleIdentityRows.filter((r) => r.outcome === 'success')),
      engaged: peopleForEvent('audit_chat_message_sent'),
      revenue: peopleForEvent('service_intake_submitted'),
      raw: {
        reachedOpens: evCount('audit_demo_viewed'),
        auditsRun: started,
        auditsWithValue: completedWithValue,
        chatMessages: evCount('audit_chat_message_sent'),
        serviceCtaClicked: peopleForEvent('service_cta_clicked'),
      },
    },
    // Diagnostic detail for the reach→started gap, which is historically the
    // biggest leak in the funnel. Kept OUT of the spine so the headline stays
    // five numbers, but it's the first thing to look at when reach→started sags.
    reachDetail: {
      // The homepage's one CTA. Summed across both names: the event was renamed
      // `audit_demo_start_real_clicked` -> `audit_get_skills_clicked` on
      // 2026-08-31, and reading only the new name would silently zero the 74
      // rows of history behind it. Drop the old term once it falls out of range.
      startRealClicked:
        evCount('audit_get_skills_clicked') + evCount('audit_demo_start_real_clicked'), // client · lower-bound
      productTypeSelected: evCount('audit_product_type_selected'), // picker button only
      // Product type resolved by any route. The `auto` source only fires after
      // an image is in hand, so this is the closest proxy the log has for
      // "someone actually uploaded a screenshot".
      productTypeDetected: evCount('audit_product_type_detected'),
      emptyStateShown: evCount('audit_empty_state_shown'),
    },
    guards: {
      // Every guard is expected to be 0. `breached` lets the client render one
      // all-clear row instead of N rows of zeroes.
      counts: Object.fromEntries(GUARD_EVENTS.map((g) => [g, evCount(g)])),
      breached: GUARD_EVENTS.filter((g) => evCount(g) > 0),
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
