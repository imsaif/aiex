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

const OUTCOMES = ['all', 'success', 'empty_gaps', 'parse_error', 'api_error', 'rate_limited', 'bad_request'];

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
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
  const [days, setDays] = useState(14);
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

function StatCard({ label, value, tone }: { label: string; value: string; tone?: 'warn' | 'bad' }) {
  const toneClass = tone === 'bad' ? 'border-red-300 bg-red-50' : tone === 'warn' ? 'border-yellow-300 bg-yellow-50' : 'border-border-primary';
  return (
    <div className={`border rounded p-3 ${toneClass}`}>
      <div className="text-[10px] uppercase tracking-wide text-text-secondary">{label}</div>
      <div className="text-lg font-bold mt-0.5">{value}</div>
    </div>
  );
}
