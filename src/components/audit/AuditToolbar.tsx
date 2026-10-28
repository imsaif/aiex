'use client';

import type { ReactNode } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

export type AuditPhase = 'upload' | 'analyse' | 'results';

const PHASES: Array<{ key: AuditPhase; label: string }> = [
  { key: 'upload', label: 'Upload' },
  { key: 'analyse', label: 'Analyse' },
  { key: 'results', label: 'Results' },
];

/**
 * The tool bar at the top of the audit workspace (console layout only).
 * Names the tool, shows which of the three steps the reader is on, and holds
 * that step's main action, so actions live in one predictable place instead of
 * being scattered between the page and the side rail.
 */
export function AuditToolbar({ phase, actions }: { phase: AuditPhase; actions?: ReactNode }) {
  const currentIndex = PHASES.findIndex((p) => p.key === phase);
  return (
    <div className="flex flex-wrap items-center justify-between gap-snug border-b border-border-primary pb-default mb-loose">
      <div className="flex flex-wrap items-center gap-x-loose gap-y-tight min-w-0">
        {/* Not a heading: each step's own h1 ("Audit your design", "Your audit
            results") stays the page's single top heading. */}
        <p className="text-lg font-semibold text-text-primary">AI UX Audit</p>
        <ol className="flex items-center gap-tight" aria-label="Audit steps">
          {PHASES.map((p, i) => {
            const done = i < currentIndex;
            const current = i === currentIndex;
            return (
              <li key={p.key} className="flex items-center gap-tight">
                {i > 0 && <span aria-hidden className="w-5 h-px bg-border-primary" />}
                <span
                  aria-current={current ? 'step' : undefined}
                  className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-150 ease-out motion-reduce:transition-none ${
                    current ? 'text-text-primary' : 'text-text-secondary'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`w-5 h-5 rounded-pill flex items-center justify-center text-sm tabular-nums transition-colors duration-150 ease-out motion-reduce:transition-none ${
                      current
                        ? 'bg-accent-primary text-text-on-accent'
                        : done
                          ? 'bg-background-tertiary text-text-secondary'
                          : 'border border-border-primary text-text-secondary'
                    }`}
                  >
                    {done ? <CheckIcon className="w-3 h-3" /> : i + 1}
                  </span>
                  {p.label}
                  {done && <span className="sr-only">(done)</span>}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      {actions && <div className="flex items-center gap-tight">{actions}</div>}
    </div>
  );
}
