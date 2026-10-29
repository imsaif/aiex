import { XCircleIcon, CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { WORKED_EXAMPLE as W } from '@/data/eval-afternoon';

/**
 * Real material from one audit in the study, for the "How we did it" section.
 * Nothing here is illustrative: the screenshot, the verdicts, Imran's note and
 * the before/after all come from the study files.
 */

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <figure className="rounded-card border border-border-primary bg-surface-primary p-default shadow-card">
      <figcaption className="type-eyebrow text-text-secondary">{label}</figcaption>
      <div className="mt-snug">{children}</div>
    </figure>
  );
}

function Verdict({ pass }: { pass: boolean }) {
  return pass ? (
    <span className="inline-flex items-center gap-1 rounded-pill bg-status-success/15 px-tight py-0.5 type-caption font-semibold text-text-primary">
      <CheckCircleIcon className="h-4 w-4 text-status-success" aria-hidden /> Pass
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-pill bg-status-error/15 px-tight py-0.5 type-caption font-semibold text-text-primary">
      <XCircleIcon className="h-4 w-4 text-status-error" aria-hidden /> Fail
    </span>
  );
}

export function MarkArtifact() {
  return (
    <Card label="One of the 41 · a Claude chat, before the fixes">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={W.image}
        alt={W.imageAlt}
        width={1000}
        height={779}
        loading="lazy"
        className="w-full rounded-input border border-border-primary"
      />
      <div className="mt-snug flex flex-wrap items-center gap-tight">
        <Verdict pass={false} />
        <span className="text-sm text-text-secondary">
          Top gap: {W.topGapBefore.pattern} · {W.topGapBefore.status}
        </span>
      </div>
      <blockquote className="mt-snug border-l-2 border-status-error/50 pl-snug text-text-primary">
        &ldquo;{W.note}&rdquo;
      </blockquote>
      <p className="mt-tight type-caption text-text-secondary">Imran&apos;s note on this audit</p>
    </Card>
  );
}

export function RecheckArtifact() {
  return (
    <Card label="The same screenshot, after the fixes">
      <div className="grid gap-snug sm:grid-cols-2">
        <div className="rounded-input bg-background-secondary p-snug">
          <div className="flex items-center justify-between">
            <span className="type-caption font-semibold text-text-secondary">Before</span>
            <Verdict pass={false} />
          </div>
          <p className="mt-tight text-sm text-text-primary">
            Top gap: {W.topGapBefore.pattern} · {W.topGapBefore.status}
          </p>
        </div>
        <div className="rounded-input bg-background-secondary p-snug">
          <div className="flex items-center justify-between">
            <span className="type-caption font-semibold text-text-secondary">After</span>
            <Verdict pass />
          </div>
          <p className="mt-tight text-sm text-text-primary">Top gap: {W.after.topGap}</p>
        </div>
      </div>
      <p className="mt-default type-caption font-semibold text-text-secondary">Guesses now go to a separate Worth checking list</p>
      <ul className="mt-tight space-y-tight">
        {W.after.worthChecking.map((q) => (
          <li key={q} className="flex gap-tight text-sm text-text-primary">
            <QuestionMarkCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" aria-hidden />
            {q}
          </li>
        ))}
      </ul>
      <p className="mt-default border-t border-border-primary pt-snug text-sm text-text-secondary">
        Across all screens, advice that guessed fell from{' '}
        <span className="font-semibold text-text-primary">{W.totals.tunedBefore}% to {W.totals.tunedAfter}%</span>, and on
        fresh screens the fix had never seen, from{' '}
        <span className="font-semibold text-text-primary">{W.totals.freshBefore}% to {W.totals.freshAfter}%</span>.
      </p>
    </Card>
  );
}
