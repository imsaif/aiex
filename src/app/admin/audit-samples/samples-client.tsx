'use client';

import { useCallback, useEffect, useState } from 'react';

interface Sample {
  id: string;
  createdAt: string;
  outcome: string;
  isContextFirst: boolean;
  productType: string | null;
  deviceType: string | null;
  imageCount: number;
  score: number | null;
  maxScore: number | null;
  applicablePatternCount: number;
  gapCount: number;
  criticalMissingCount: number;
  errorReason: string | null;
  errorDetail: string | null;
  surfaceDescription: string | null;
  latencyMs: number | null;
  ipHash: string | null;
  role: string | null;
}

interface Stats {
  windowDays: number;
  total: number;
  byOutcome: Record<string, number>;
  successRate: number;
  emptyGapsRate: number;
  errorRate: number;
  avgScore: number | null;
  avgMaxScore: number | null;
  avgGapCount: number | null;
  avgLatencyMs: number | null;
  excludedCount: number;
  includeTest: boolean;
}

interface Funnel {
  windowDays: number;
  spine: {
    reached: number;
    started: number;
    completedWithValue: number;
    engaged: number;
    revenue: number;
    raw: {
      reachedOpens: number;
      auditsRun: number;
      auditsWithValue: number;
      chatMessages: number;
      serviceCtaClicked: number;
    };
  };
  reachDetail: {
    startRealClicked: number;
    productTypeSelected: number;
    emptyStateShown: number;
  };
  guards: { counts: Record<string, number>; breached: string[] };
  outcomes: { success: number; empty_gaps: number; no_ai_surface: number; errors: number };
  postResult: {
    joinableSuccess: number;
    successWithAnyAction: number;
    actionRate: number | null;
    byAction: Record<string, number>;
  };
}

const OUTCOMES = ['all', 'success', 'empty_gaps', 'parse_error', 'api_error', 'rate_limited', 'bad_request'];

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

// Step-to-step conversion. Null when the denominator is 0 so the UI renders a
// dash rather than a misleading 0.0% or NaN.
function rate(value: number, previous: number): number | null {
  return previous > 0 ? value / previous : null;
}

// The five spine steps, in funnel order. Kept as data (not JSX) so the
// conversion between consecutive steps can be computed generically.
//
// Labels describe what a PERSON did, not which event fired. `meaning` is the
// plain-English definition and `measure` says how much to trust the number —
// both render on the card, so nobody has to read this file to use the page.
function spineSteps(f: Funnel) {
  const { raw } = f.spine;
  return [
    {
      key: 'reached',
      label: 'Opened the audit',
      value: f.spine.reached,
      meaning: 'Landed on the audit page.',
      measure: `Counted in the browser, so treat it as a minimum. ${raw.reachedOpens} opens in total.`,
    },
    {
      key: 'started',
      label: 'Uploaded a screenshot',
      value: f.spine.started,
      meaning: 'Actually ran an audit, not just looked at the page.',
      measure: `Counted in our database, so it's exact. ${raw.auditsRun} audits run.`,
      solid: true,
    },
    {
      key: 'value',
      label: 'Got a real result',
      value: f.spine.completedWithValue,
      meaning: 'The audit came back with patterns and gaps, not an error or a blank.',
      measure: `Counted in our database, so it's exact. ${raw.auditsWithValue} audits.`,
      solid: true,
    },
    {
      key: 'engaged',
      label: 'Asked a follow-up',
      value: f.spine.engaged,
      meaning:
        'Typed a question into the chat about their results. The clearest sign someone actually cares about their gaps rather than glancing and leaving.',
      measure: `Counted in the browser, so treat it as a minimum. ${raw.chatMessages} messages sent.`,
      // Branches off "got a real result", not off the card to its left.
      basis: 2,
    },
    {
      key: 'revenue',
      label: 'Asked for a quote',
      value: f.spine.revenue,
      meaning: 'Submitted the service intake form. This is the money step.',
      measure: `Counted in the browser, so treat it as a minimum. ${raw.serviceCtaClicked} ${raw.serviceCtaClicked === 1 ? 'person' : 'people'} clicked through to the service page first.`,
      basis: 2,
    },
  ];
}

function outcomeStyle(outcome: string): string {
  switch (outcome) {
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'empty_gaps':
      return 'bg-yellow-100 text-yellow-800';
    case 'parse_error':
    case 'api_error':
      return 'bg-red-100 text-red-800';
    case 'rate_limited':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function AuditSamplesClient({ initialAuth = false }: { initialAuth?: boolean }) {
  const [isAuthenticated] = useState(initialAuth);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [events, setEvents] = useState<{ name: string; count: number }[]>([]);
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  // 30d default. At current volume (~1 audit/day) a 24h or 7d window puts most
  // spine cards at 0-1, where ordinary variance reads as a trend. 30d is the
  // shortest window where the five numbers mean anything; use the shorter ones
  // to answer "did something just break", not "is this working".
  const [days, setDays] = useState(30);
  const [outcome, setOutcome] = useState('all');
  const [includeTest, setIncludeTest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ days: String(days) });
      if (outcome !== 'all') params.set('outcome', outcome);
      if (includeTest) params.set('includeTest', '1');
      const res = await fetch(`/api/admin/audit-samples?${params}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to load');
        return;
      }
      setSamples(data.samples);
      setStats(data.stats);

      // Event-counts (post-audit CTA + funnel usage) from the UiEvent log.
      const evParams = new URLSearchParams({ days: String(days) });
      if (includeTest) evParams.set('includeTest', '1');
      const evRes = await fetch(`/api/admin/events?${evParams}`);
      if (evRes.ok) {
        const evData = await evRes.json();
        setEvents(evData.events ?? []);
      }

      // Funnel — spine from AuditSample (server truth) + post-result actions joined by sessionId.
      const fRes = await fetch(`/api/admin/audit-funnel?${evParams}`);
      if (fRes.ok) {
        setFunnel(await fRes.json());
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setIsLoading(false);
    }
  }, [days, outcome, includeTest]);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, fetchData]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <p className="text-text-secondary">Sign in via <a className="underline" href="/admin/newsletter">/admin/newsletter</a> first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Audit Samples</h1>
        <div className="flex gap-2 items-center">
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10))}
            className="border border-border-primary rounded px-3 py-1.5 text-sm bg-background-primary"
          >
            <option value={1}>Last 24h</option>
            <option value={7}>Last 7d</option>
            <option value={14}>Last 14d</option>
            <option value={30}>Last 30d</option>
            <option value={90}>Last 90d</option>
          </select>
          <select
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            className="border border-border-primary rounded px-3 py-1.5 text-sm bg-background-primary"
          >
            {OUTCOMES.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <label className="flex items-center gap-1.5 text-sm text-text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeTest}
              onChange={(e) => setIncludeTest(e.target.checked)}
              className="h-3.5 w-3.5"
            />
            Include test
          </label>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="px-3 py-1.5 rounded text-sm bg-accent-primary text-white disabled:opacity-50"
          >
            {isLoading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </div>

      {stats && stats.excludedCount > 0 && !includeTest && (
        <div className="text-xs text-text-secondary mb-3">
          {stats.excludedCount} test row{stats.excludedCount === 1 ? '' : 's'} hidden (role=test/admin/monitor or admin ipHash).
        </div>
      )}

      {error && (
        <div className="bg-status-error/10 border border-status-error/20 text-status-error rounded p-3 mb-4 text-sm">{error}</div>
      )}

      {/* ── SPINE ────────────────────────────────────────────────────────────
          The only five numbers worth a weekly look: reach → started → value →
          revenue interest → revenue. Everything else on this page is diagnostic
          and lives behind the disclosure below, so a quiet guard event can never
          again sit next to the headline number looking equally important. */}
      {funnel && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-text-primary mb-1">
            The five numbers <span className="font-normal text-text-secondary">(last {days}d, real visitors)</span>
          </h2>
          <p className="text-xs text-text-secondary mb-3 max-w-3xl">
            One person&apos;s journey from landing on the audit to paying for one. Every figure is a count of{' '}
            <strong className="text-text-primary">people</strong>, not clicks, so the percentages between steps
            are comparable. If none of these moved this week, nothing happened.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {spineSteps(funnel).map((s, i, arr) => {
              // Most steps rate against the one before them. The last two both
              // branch off "got a real result" instead — you don't have to ask a
              // follow-up before requesting a quote, so chaining them would
              // invent a funnel step that doesn't exist.
              const basisIdx = s.basis ?? i - 1;
              const basis = i === 0 ? null : arr[basisIdx];
              return (
                <SpineStep
                  key={s.key}
                  label={s.label}
                  value={s.value}
                  meaning={s.meaning}
                  measure={s.measure}
                  solid={s.solid}
                  conversion={basis ? rate(s.value, basis.value) : null}
                  fromLabel={basis ? basis.label : null}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ── GUARDS ───────────────────────────────────────────────────────────
          Expected to read zero. One all-clear row when they do, so "quiet" is
          visibly different from "unused" — the distinction the flat volume-sorted
          list destroys. */}
      {funnel && (
        <div className="mb-6">
          {funnel.guards.breached.length === 0 ? (
            <div className="border border-status-success/30 bg-status-success/10 rounded p-3 text-xs text-text-secondary">
              <span className="font-semibold text-text-primary">Nothing broke.</span> All{' '}
              {Object.keys(funnel.guards.counts).length} failure check
              {Object.keys(funnel.guards.counts).length === 1 ? '' : 's'} sat at zero, which is what you want.
              These only ever count things going wrong, so zero is good news.
            </div>
          ) : (
            <div className="border border-status-error/30 bg-status-error/10 rounded p-3">
              <div className="text-xs font-semibold text-text-primary mb-1.5">
                Something broke. These count failures, so anything above zero needs a look.
              </div>
              <div className="flex flex-wrap gap-2">
                {funnel.guards.breached.map((g) => (
                  <span key={g} className="text-xs px-2 py-1 rounded bg-surface-primary text-text-primary font-mono">
                    {g}: {funnel.guards.counts[g]}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── DIAGNOSTICS ──────────────────────────────────────────────────────
          Consult only when a spine number moves and you need to know why.
          Collapsed by default: this is reference material, not a dashboard. */}
      <details className="mb-6 border border-border-primary rounded">
        <summary className="px-3 py-2 text-sm font-semibold text-text-primary cursor-pointer select-none">
          Detail{' '}
          <span className="font-normal text-text-secondary">
            — open this only when one of the five numbers moves and you need to know why
          </span>
        </summary>

        <div className="p-3 border-t border-border-primary">
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <StatCard label="Total" value={stats.total.toString()} />
              <StatCard label="Success rate" value={pct(stats.successRate)} />
              <StatCard label="Empty-gaps rate" value={pct(stats.emptyGapsRate)} tone={stats.emptyGapsRate > 0.2 ? 'warn' : undefined} />
              <StatCard label="Error rate" value={pct(stats.errorRate)} tone={stats.errorRate > 0.05 ? 'bad' : undefined} />
              <StatCard label="Avg score" value={stats.avgScore != null ? `${stats.avgScore.toFixed(1)} / ${(stats.avgMaxScore ?? 0).toFixed(0)}` : '—'} />
              <StatCard label="Avg gaps" value={stats.avgGapCount != null ? stats.avgGapCount.toFixed(1) : '—'} />
              <StatCard label="Avg latency" value={stats.avgLatencyMs != null ? `${(stats.avgLatencyMs / 1000).toFixed(1)}s` : '—'} />
              <StatCard label="Window" value={`${stats.windowDays}d`} />
            </div>
          )}

          {stats && (
            <div className="mb-6 flex flex-wrap gap-2">
              {Object.entries(stats.byOutcome).map(([k, v]) => (
                <span key={k} className={`text-xs px-2 py-1 rounded ${outcomeStyle(k)}`}>
                  {k}: {v}
                </span>
              ))}
            </div>
          )}

          {/* Reach→started detail. Pulled out of the spine but kept first here,
              because that step is historically where most people are lost. */}
          {funnel && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-text-primary mb-2">Reach → started detail</h3>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded bg-background-secondary text-text-secondary font-mono">
                  start_real_clicked: {funnel.reachDetail.startRealClicked}
                </span>
                <span className="text-xs px-2 py-1 rounded bg-background-secondary text-text-secondary font-mono">
                  product_type_selected: {funnel.reachDetail.productTypeSelected}
                </span>
                <span className="text-xs px-2 py-1 rounded bg-background-secondary text-text-secondary font-mono">
                  empty_state_shown: {funnel.reachDetail.emptyStateShown}
                </span>
              </div>
            </div>
          )}

          {/* Post-result action rate. Denominator is server-side (joinable success rows). */}
          {funnel && (
            <div className="border border-border-primary rounded p-3 mb-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[10px] uppercase tracking-wide text-text-secondary">Post-result action rate</span>
                <span className="text-lg font-bold">
                  {funnel.postResult.actionRate != null ? pct(funnel.postResult.actionRate) : '—'}
                </span>
                <span className="text-xs text-text-secondary">
                  {funnel.postResult.successWithAnyAction} of {funnel.postResult.joinableSuccess} completed audits took a next step
                </span>
              </div>
              {funnel.postResult.joinableSuccess === 0 ? (
                <p className="text-xs text-text-secondary mt-2">
                  No joinable completed audits yet. The <code>sessionId</code> join key was added 2026-07-13, so this
                  rate populates as new audits run (older success rows have no join key).
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(funnel.postResult.byAction).map(([name, count]) => (
                    <span key={name} className="text-xs px-2 py-1 rounded bg-background-secondary text-text-secondary font-mono">
                      {name.replace(/^audit_/, '')}: {count}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <h3 className="text-xs font-semibold text-text-primary mb-2">
            All event counts <span className="font-normal text-text-secondary">(last {days}d, real users)</span>
          </h3>
          {/* Absence here is NOT zero. Some events fire straight to Clarity and
              never beacon to UiEvent, so they can't appear in this table at all.
              Stated on the page rather than in a code comment, because reading a
              structural blind spot as a real zero is exactly how the pattern-page
              CTA looked untracked-and-therefore-unused. */}
          <p className="text-xs text-text-secondary mb-2">
            Sourced from <code>UiEvent</code>. Clarity-only events never reach this table, so their absence
            means <em>not recorded here</em>, not zero. Known: <code>install_prompt_copied</code> (fires via{' '}
            <code>window.clarity</code> directly, bypassing <code>trackAuditEvent</code>) — read it in Clarity.
            The pattern-page audit CTA fires nothing at all and is invisible to both.
          </p>
          {events.length === 0 ? (
            <p className="text-xs text-text-secondary">
              No events in range. (The UiEvent table populates once this build is deployed and the client beacons start firing.)
            </p>
          ) : (
            <div className="overflow-x-auto border border-border-primary rounded">
              <table className="w-full text-xs">
                <thead className="bg-background-secondary text-left">
                  <tr>
                    <th className="px-3 py-2">Event</th>
                    <th className="px-3 py-2 text-right">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => (
                    <tr key={e.name} className="border-t border-border-primary">
                      <td className="px-3 py-1.5 font-mono">{e.name}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{e.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </details>

      <div className="overflow-x-auto border border-border-primary rounded">
        <table className="w-full text-xs">
          <thead className="bg-background-secondary text-left">
            <tr>
              <th className="px-3 py-2">When</th>
              <th className="px-3 py-2">Outcome</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Device</th>
              <th className="px-3 py-2">Surface</th>
              <th className="px-3 py-2 text-right">Patterns</th>
              <th className="px-3 py-2 text-right">Gaps</th>
              <th className="px-3 py-2 text-right">Score</th>
              <th className="px-3 py-2 text-right">Latency</th>
              <th className="px-3 py-2">Error</th>
            </tr>
          </thead>
          <tbody>
            {samples.map((s) => (
              <tr key={s.id} className="border-t border-border-primary">
                <td className="px-3 py-2 whitespace-nowrap">{new Date(s.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${outcomeStyle(s.outcome)}`}>{s.outcome}</span>
                </td>
                <td className="px-3 py-2">{s.productType ?? '—'}</td>
                <td className="px-3 py-2">{s.deviceType ?? '—'}</td>
                <td className="px-3 py-2 max-w-xs truncate" title={s.surfaceDescription ?? ''}>
                  {s.surfaceDescription ?? '—'}
                </td>
                <td className="px-3 py-2 text-right">{s.applicablePatternCount}</td>
                <td className="px-3 py-2 text-right">{s.gapCount}</td>
                <td className="px-3 py-2 text-right">{s.score != null ? `${s.score}/${s.maxScore ?? '?'}` : '—'}</td>
                <td className="px-3 py-2 text-right">{s.latencyMs != null ? `${(s.latencyMs / 1000).toFixed(1)}s` : '—'}</td>
                <td className="px-3 py-2 max-w-md truncate" title={s.errorDetail ?? ''}>
                  {s.errorReason ?? ''}
                </td>
              </tr>
            ))}
            {samples.length === 0 && !isLoading && (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-text-secondary">No samples in window.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SpineStep({
  label,
  value,
  meaning,
  measure,
  solid,
  conversion,
  fromLabel,
}: {
  label: string;
  value: number;
  meaning: string;
  measure: string;
  solid?: boolean;
  conversion: number | null;
  fromLabel: string | null;
}) {
  return (
    <div
      className={`border rounded p-3 flex flex-col ${
        solid ? 'border-status-success/40 bg-status-success/10' : 'border-border-primary border-dashed'
      }`}
    >
      <div className="text-xs font-semibold text-text-primary">{label}</div>
      <div className="text-2xl font-bold mt-1 tabular-nums text-text-primary">{value}</div>
      {fromLabel ? (
        <div className="text-xs text-text-secondary mt-0.5 tabular-nums">
          {conversion != null ? pct(conversion) : '—'} of those who {fromLabel.toLowerCase()}
        </div>
      ) : (
        <div className="text-xs text-text-secondary mt-0.5">starting point</div>
      )}
      <p className="text-xs text-text-secondary mt-2 flex-1">{meaning}</p>
      <p className="text-xs text-text-secondary mt-2 pt-2 border-t border-border-primary/60">{measure}</p>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone?: 'warn' | 'bad' }) {
  const toneClass = tone === 'bad' ? 'border-red-300 bg-red-50' : tone === 'warn' ? 'border-yellow-300 bg-yellow-50' : 'border-border-primary';
  return (
    <div className={`border rounded p-3 ${toneClass}`}>
      <div className="text-[10px] uppercase tracking-wide text-text-secondary">{label}</div>
      <div className="text-lg font-bold mt-0.5">{value}</div>
    </div>
  );
}
