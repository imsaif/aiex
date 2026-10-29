import {
  InboxStackIcon,
  CheckCircleIcon,
  XCircleIcon,
  RectangleStackIcon,
  PencilSquareIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

/**
 * Small schematic diagrams, one per step of /ai-evals-checklist. They show the
 * shape of the work, not data: the only numbers drawn are the study's real ones
 * (step 5). Decorative, so each is aria-hidden and the step text carries the
 * meaning.
 */

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
export const STEP_ICONS: Record<number, Icon> = {
  1: InboxStackIcon,
  2: CheckCircleIcon,
  3: RectangleStackIcon,
  4: PencilSquareIcon,
  5: ArrowPathIcon,
};

function Frame({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-card bg-background-secondary p-default" aria-hidden>
      <div className="flex flex-1 items-center justify-center">{children}</div>
      <p className="mt-snug text-center type-caption text-text-secondary">{caption}</p>
    </div>
  );
}

function Collect() {
  // 20 answers, a few of them the awkward kind.
  const awkward = new Set([3, 8, 14, 17]);
  return (
    <Frame caption="20 answers, awkward ones included">
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: 20 }, (_, i) => (
          <span
            key={i}
            className={`h-6 w-6 rounded-input ${
              awkward.has(i)
                ? 'border-2 border-dashed border-accent-primary bg-background-primary'
                : 'border border-border-primary bg-background-primary'
            }`}
          />
        ))}
      </div>
    </Frame>
  );
}

function Mark() {
  const rows = [
    { pass: true, w: 'w-24' },
    { pass: false, w: 'w-20', note: true },
    { pass: true, w: 'w-28' },
    { pass: false, w: 'w-16', note: true },
  ];
  return (
    <Frame caption="Pass or fail, plus one line when it fails">
      <div className="w-full max-w-[15rem] space-y-tight">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-tight rounded-input bg-background-primary px-tight py-1.5">
            {r.pass ? (
              <CheckCircleIcon className="h-5 w-5 shrink-0 text-status-success" />
            ) : (
              <XCircleIcon className="h-5 w-5 shrink-0 text-status-error" />
            )}
            <span className={`h-2 rounded-pill bg-border-secondary ${r.w}`} />
            {r.note && <span className="ml-auto h-2 w-10 rounded-pill bg-status-error/30" />}
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Group() {
  const piles = [5, 3, 2];
  return (
    <Frame caption="Piles of notes; the tallest is your first problem">
      <div className="flex items-end gap-default">
        {piles.map((n, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            {i === 0 && <span className="mb-1 rounded-pill bg-accent-primary px-tight type-caption text-text-on-accent">first</span>}
            {Array.from({ length: n }, (_, j) => (
              <span
                key={j}
                className={`h-4 w-12 rounded-input ${i === 0 ? 'bg-accent-subtle border border-accent-primary/40' : 'bg-background-primary border border-border-primary'}`}
              />
            ))}
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Rule() {
  return (
    <Frame caption="One yes or no question anyone can apply">
      <div className="w-full max-w-[15rem] rounded-card border border-border-primary bg-background-primary p-snug">
        <p className="text-sm font-semibold text-text-primary">Does it point at something on the screen?</p>
        <div className="mt-snug flex gap-tight">
          <span className="flex-1 rounded-pill bg-status-success/15 py-1 text-center type-caption font-semibold text-text-primary">
            Yes · seen
          </span>
          <span className="flex-1 rounded-pill bg-status-error/15 py-1 text-center type-caption font-semibold text-text-primary">
            No · assumed
          </span>
        </div>
      </div>
    </Frame>
  );
}

function Recheck() {
  // The study's real numbers: share of advice that guessed.
  const rows = [
    { label: 'Tuned set', before: 80, after: 68 },
    { label: 'New answers', before: 92, after: 88 },
  ];
  return (
    <Frame caption="Same rule, before and after; new answers keep you honest">
      <div className="w-full max-w-[16rem] space-y-snug">
        {rows.map((r) => (
          <div key={r.label}>
            <p className="type-caption font-semibold text-text-primary">{r.label}</p>
            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-tight">
                <span className="h-2.5 rounded-pill bg-border-secondary" style={{ width: `${r.before}%` }} />
                <span className="type-caption tabular-nums text-text-secondary">{r.before}%</span>
              </div>
              <div className="flex items-center gap-tight">
                <span className="h-2.5 rounded-pill bg-accent-primary" style={{ width: `${r.after}%` }} />
                <span className="type-caption tabular-nums text-text-primary">{r.after}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

export const STEP_VISUALS: Record<number, () => React.ReactElement> = {
  1: Collect,
  2: Mark,
  3: Group,
  4: Rule,
  5: Recheck,
};
