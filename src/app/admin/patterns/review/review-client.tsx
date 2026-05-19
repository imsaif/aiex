'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

interface Props {
  initialAuth: boolean;
  candidates: CandidateRow[];
}

export default function ReviewClient({ initialAuth, candidates }: Props) {
  const [pending, setPending] = useState<Record<string, 'approve' | 'reject'>>({});
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const router = useRouter();

  if (!initialAuth) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <p className="text-text-secondary">Sign in via <a className="underline" href="/admin/newsletter">/admin/newsletter</a> first.</p>
      </div>
    );
  }

  const visible = candidates.filter((c) => !hidden.has(c.id));

  async function act(id: string, action: 'approve' | 'reject') {
    setPending((p) => ({ ...p, [id]: action }));
    try {
      const res = await fetch(`/api/admin/patterns/review/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'candidate', action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      if (action === 'approve' && data.slug) {
        alert(`Pattern scaffolded! ${data.filesCommitted} files committed to GitHub. Vercel will deploy in ~2 minutes.\n\n/patterns/${data.slug}`);
      }
      setHidden((h) => new Set(h).add(id));
    } catch (err) {
      console.error(err);
      alert(`Action failed: ${err instanceof Error ? err.message : err}`);
    } finally {
      setPending((p) => {
        const { [id]: _, ...rest } = p;
        return rest;
      });
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">New Pattern Candidates</h1>
          <p className="text-text-secondary text-sm mt-1">
            Proposed patterns detected from news clusters. Runs every Monday.
          </p>
        </div>
        <button
          onClick={() => router.refresh()}
          className="text-xs text-text-secondary hover:text-text-primary"
        >
          Refresh
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">
          <p className="text-lg mb-2">No candidates yet</p>
          <p className="text-sm">The discoverer runs on Mondays after the newsletter cron.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((c) => {
            const sources = Array.isArray(c.supportingSources) ? c.supportingSources as { title: string; url: string }[] : [];
            return (
              <div key={c.id} className="border border-border-primary rounded-lg p-5 bg-surface-primary">
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="font-semibold text-text-primary text-lg">{c.proposedTitle}</span>
                      <span className="text-xs text-text-tertiary">{c.proposedCategory} · {c.clusterSize} articles</span>
                    </div>
                    <p className="text-xs text-text-tertiary mb-3">slug: {c.proposedSlug}</p>
                    <div className="space-y-2 mb-3">
                      <p className="text-sm text-text-primary"><span className="font-medium">Problem:</span> {c.problem}</p>
                      <p className="text-sm text-text-primary"><span className="font-medium">Solution:</span> {c.solution}</p>
                    </div>
                    <p className="text-xs text-text-secondary italic mb-3">{c.rationale}</p>
                    {sources.length > 0 && (
                      <div className="text-xs text-text-tertiary space-y-0.5">
                        <p className="font-medium mb-1">Supporting articles:</p>
                        {sources.map((s, i) => (
                          <a key={i} href={s.url} target="_blank" rel="noreferrer" className="block hover:text-accent-primary truncate">
                            ↗ {s.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => act(c.id, 'approve')}
                      disabled={!!pending[c.id]}
                      className="px-3 py-1.5 text-sm rounded-md bg-accent-primary text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {pending[c.id] === 'approve' ? 'Scaffolding…' : 'Add to library'}
                    </button>
                    <button
                      onClick={() => act(c.id, 'reject')}
                      disabled={!!pending[c.id]}
                      className="px-3 py-1.5 text-sm rounded-md border border-border-primary text-text-secondary hover:text-text-primary disabled:opacity-50"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
