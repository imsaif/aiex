import type { PackStep } from '@/lib/skills/packSteps';
import { SayLine, type SayTrack } from './SayLine';

/**
 * Numbered steps, short: the dialog and the pattern pages after a download.
 * Only what they should see is kept; the after-notes live on the walkthrough page.
 */
export function PackSteps({ steps, track }: { steps: PackStep[]; track?: Omit<SayTrack, 'step'> }) {
  return (
    <ol className="divide-y divide-border-primary">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-snug py-default text-left first:pt-0 last:pb-0">
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-secondary text-sm font-semibold text-text-primary"
          >
            {i + 1}
          </span>
          <div className="min-w-0 flex-1 space-y-tight">
            <p className="text-sm text-text-primary">{step.text}</p>
            {step.say && <SayLine text={step.say} track={track && { ...track, step: i + 1 }} />}
            {step.expect && <p className="text-sm text-text-secondary">{step.expect}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default PackSteps;
