'use client';

import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

/**
 * "Worth checking in your product": things one screenshot can't show (hover
 * states, what a click does, other screens, below the scroll). The audit puts
 * them here instead of stating them as gaps, so a guess never reads as a
 * finding. Not scored. The ticks are a reading aid for this visit only.
 *
 * Added after an eval of 41 audits found most gaps claimed something was
 * missing that a single screenshot cannot show.
 */
export function WorthChecking({ questions }: { questions: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  if (!questions || questions.length === 0) return null;

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section className="mt-8" aria-labelledby="worth-checking-heading">
      <div className="flex items-baseline justify-between gap-snug mb-tight">
        <h2 id="worth-checking-heading" className="type-eyebrow text-text-secondary">
          Worth checking in your product
        </h2>
        <span className="text-sm font-semibold text-text-secondary tabular-nums">{questions.length}</span>
      </div>
      <p className="text-sm text-text-secondary mb-snug">
        Things one screenshot can&apos;t show. Tick them off as you check.
      </p>
      <ul className="rounded-card border border-border-primary bg-background-primary divide-y divide-border-primary">
        {questions.map((q, i) => {
          const done = checked.has(i);
          return (
            <li key={i}>
              <label className="flex items-start gap-snug px-default py-snug cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={done}
                  onChange={() => toggle(i)}
                />
                <span
                  aria-hidden
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-input border flex items-center justify-center transition-colors duration-150 ease-out motion-reduce:transition-none peer-focus-visible:ring-2 peer-focus-visible:ring-accent-primary ${
                    done ? 'bg-accent-primary border-accent-primary' : 'border-border-primary bg-background-primary'
                  }`}
                >
                  <CheckIcon className={`w-3.5 h-3.5 text-text-on-accent transition-opacity duration-150 ease-out motion-reduce:transition-none ${done ? 'opacity-100' : 'opacity-0'}`} />
                </span>
                <span
                  className={`text-base leading-relaxed transition-colors duration-150 ease-out motion-reduce:transition-none ${
                    done ? 'text-text-secondary line-through' : 'text-text-primary'
                  }`}
                >
                  {q}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
