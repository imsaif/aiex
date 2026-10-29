import { XCircleIcon, CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { WORKED_EXAMPLE as W } from '@/data/eval-afternoon';

/**
 * The real material from one audit in the study, one piece per step. Nothing
 * here is illustrative: the screenshot, the verdicts, Imran's note, the group
 * counts and the before/after all come from the study files.
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

export function CollectArtifact() {
  return (
    <Card label="Answer 1 of 41 · a Claude chat">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={W.image}
        alt={W.imageAlt}
        width={1000}
        height={779}
        loading="lazy"
        className="w-full rounded-input border border-border-primary"
      />
      <p className="mt-snug text-sm text-text-secondary">
        The audit&apos;s top gap for it:{' '}
        <span className="font-semibold text-text-primary">
          {W.topGapBefore.pattern} · {W.topGapBefore.status}
        </span>
      </p>
    </Card>
  );
}

export function MarkArtifact() {
  return (
    <Card label="The verdict and the note">
      <Verdict pass={false} />
      <blockquote className="mt-snug border-l-2 border-status-error/50 pl-snug text-text-primary">
        &ldquo;{W.note}&rdquo;
      </blockquote>
      <p className="mt-tight type-caption text-text-secondary">Imran&apos;s note on this audit</p>
    </Card>
  );
}

export function GroupArtifact() {
  const max = Math.max(...W.groups.map((g) => g.fails));
  return (
    <Card label="All 41 notes, grouped · failed audits per group">
      <ul className="space-y-tight">
        {W.groups.map((g) => (
          <li key={g.name}>
            <div className="flex items-baseline justify-between gap-tight text-sm">
              <span className={g.thisAudit ? 'font-semibold text-text-primary' : 'text-text-secondary'}>
                {g.name}
                {g.thisAudit && <span className="ml-tight type-caption text-text-secondary">· this audit</span>}
              </span>
              <span className="tabular-nums text-text-secondary">{g.fails}</span>
            </div>
            <span className="mt-1 block h-2 overflow-hidden rounded-pill bg-background-secondary" aria-hidden>
              <span
                className={`block h-full rounded-pill ${g.thisAudit ? 'bg-accent-primary' : 'bg-border-secondary'}`}
                style={{ width: `${(g.fails / max) * 100}%` }}
              />
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-snug type-caption text-text-secondary">One audit can sit in more than one group.</p>
    </Card>
  );
}

export function RuleArtifact() {
  return (
    <Card label="The two rules written from the biggest groups">
      <ol className="space-y-tight">
        {W.rules.map((r, i) => (
          <li key={r} className="flex gap-snug rounded-input bg-background-secondary p-snug text-sm text-text-primary">
            <span className="type-eyebrow font-mono text-text-secondary">{i + 1}</span>
            <span>{r}</span>
          </li>
        ))}
      </ol>
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

export const ARTIFACTS: Record<number, () => React.ReactElement> = {
  1: CollectArtifact,
  2: MarkArtifact,
  3: GroupArtifact,
  4: RuleArtifact,
  5: RecheckArtifact,
};
