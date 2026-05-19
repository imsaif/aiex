'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface MatchRow {
  id: string;
  patternSlug: string;
  confidence: number;
  rationale: string;
  createdAt: string;
  newsletter: { title: string; slug: string; publishDate: string } | null;
}

interface ExampleRow {
  id: string;
  patternSlug: string;
  sourceType: string;
  sourceUrl: string;
  sourceTitle: string | null;
  title: string;
  description: string;
  rationale: string;
  createdAt: string;
}

interface CandidateRow {
  id: string;
  proposedSlug: string;
  proposedTitle: string;
  proposedCategory: string;
  problem: string;
  solution: string;
  rationale: string;
  clusterSize: number;
  supportingSources: unknown;
  createdAt: string;
}

type Tab = 'matches' | 'examples' | 'candidates';

interface Props {
  initialAuth: boolean;
  matches: MatchRow[];
  examples: ExampleRow[];
  candidates: CandidateRow[];
}

export default function ReviewClient({ initialAuth, matches, examples, candidates }: Props) {
  const [tab, setTab] = useState<Tab>('matches');
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const router = useRouter();

  if (!initialAuth) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 border border-border-primary rounded-lg">
        <p className="text-text-primary">Admin authentication required.</p>
        <Link href="/admin/login" className="text-accent-primary underline">
          Log in
        </Link>
      </div>
    );
  }

  const visibleMatches = matches.filter((m) => !hidden.has(m.id));
  const visibleExamples = examples.filter((e) => !hidden.has(e.id));
  const visibleCandidates = candidates.filter((c) => !hidden.has(c.id));

  async function act(id: string, kind: 'match' | 'example' | 'candidate', action: 'approve' | 'reject') {
    setPending((p) => ({ ...p, [id]: true }));
    try {
      const res = await fetch(`/api/admin/patterns/review/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, action }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setHidden((h) => new Set(h).add(id));
    } catch (err) {
      console.error(err);
      alert('Action failed; see console.');
    } finally {
      setPending((p) => {
        const { [id]: _, ...rest } = p;
        return rest;
      });
    }
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'matches', label: 'Pattern matches', count: visibleMatches.length },
    { key: 'examples', label: 'Example candidates', count: visibleExamples.length },
    { key: 'candidates', label: 'New patterns', count: visibleCandidates.length },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Pattern Review Queue</h1>
        <p className="text-text-secondary text-sm mt-1">
          AI-suggested matches, examples, and new pattern candidates from the news pipeline.
          Approve to publish; reject to hide.
        </p>
      </div>

      <div className="flex gap-2 border-b border-border-primary mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key
                ? 'border-accent-primary text-accent-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {t.label} <span className="ml-1 text-xs opacity-70">({t.count})</span>
          </button>
        ))}
        <button
          onClick={() => router.refresh()}
          className="ml-auto px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary"
        >
          Refresh
        </button>
      </div>

      {tab === 'matches' && (
        <div className="space-y-3">
          {visibleMatches.length === 0 && <Empty label="No pending pattern matches." />}
          {visibleMatches.map((m) => (
            <Card key={m.id} pending={pending[m.id]} onApprove={() => act(m.id, 'match', 'approve')} onReject={() => act(m.id, 'match', 'reject')}>
              <div className="flex items-baseline gap-2 mb-1">
                <Link href={`/patterns/${m.patternSlug}`} className="font-semibold text-text-primary hover:text-accent-primary">
                  {m.patternSlug}
                </Link>
                <span className="text-xs text-text-tertiary">confidence {m.confidence.toFixed(2)}</span>
              </div>
              <p className="text-sm text-text-primary mb-2">{m.rationale}</p>
              {m.newsletter && (
                <Link href={`/news/${m.newsletter.slug}`} className="text-xs text-text-secondary hover:text-accent-primary">
                  ← {m.newsletter.title}
                </Link>
              )}
            </Card>
          ))}
        </div>
      )}

      {tab === 'examples' && (
        <div className="space-y-3">
          {visibleExamples.length === 0 && <Empty label="No pending example candidates." />}
          {visibleExamples.map((e) => (
            <Card key={e.id} pending={pending[e.id]} onApprove={() => act(e.id, 'example', 'approve')} onReject={() => act(e.id, 'example', 'reject')}>
              <div className="flex items-baseline gap-2 mb-1">
                <Link href={`/patterns/${e.patternSlug}`} className="font-semibold text-text-primary hover:text-accent-primary">
                  {e.patternSlug}
                </Link>
                <span className="text-xs text-text-tertiary">{e.sourceType}</span>
              </div>
              <p className="font-medium text-text-primary mb-1">{e.title}</p>
              <p className="text-sm text-text-primary mb-2">{e.description}</p>
              <p className="text-xs text-text-secondary italic mb-2">Why: {e.rationale}</p>
              <a href={e.sourceUrl} className="text-xs text-accent-primary hover:underline" target="_blank" rel="noreferrer">
                Source ↗
              </a>
            </Card>
          ))}
        </div>
      )}

      {tab === 'candidates' && (
        <div className="space-y-3">
          {visibleCandidates.length === 0 && <Empty label="No new pattern proposals yet (runs weekly)." />}
          {visibleCandidates.map((c) => (
            <Card key={c.id} pending={pending[c.id]} onApprove={() => act(c.id, 'candidate', 'approve')} onReject={() => act(c.id, 'candidate', 'reject')}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-semibold text-text-primary">{c.proposedTitle}</span>
                <span className="text-xs text-text-tertiary">{c.proposedCategory} · cluster {c.clusterSize}</span>
              </div>
              <p className="text-xs text-text-tertiary mb-2">slug: {c.proposedSlug}</p>
              <div className="text-sm text-text-primary space-y-1 mb-2">
                <p><span className="font-medium">Problem:</span> {c.problem}</p>
                <p><span className="font-medium">Solution:</span> {c.solution}</p>
              </div>
              <p className="text-xs text-text-secondary italic">Rationale: {c.rationale}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Card({
  children,
  pending,
  onApprove,
  onReject,
}: {
  children: React.ReactNode;
  pending?: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="border border-border-primary rounded-lg p-4 bg-surface-primary">
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">{children}</div>
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={onApprove}
            disabled={pending}
            className="px-3 py-1.5 text-sm rounded-md bg-accent-primary text-white hover:opacity-90 disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            disabled={pending}
            className="px-3 py-1.5 text-sm rounded-md border border-border-primary text-text-secondary hover:text-text-primary disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="text-center py-12 text-text-secondary text-sm">{label}</div>;
}
