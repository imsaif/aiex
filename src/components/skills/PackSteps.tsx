import type { PackStep } from '@/lib/skills/packSteps';
import { SayLine } from './SayLine';

/** Numbered steps, short: the dialog and the pattern pages after a download. */
export function PackSteps({ steps }: { steps: PackStep[] }) {
  return (
    <ol className="space-y-5">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-snug text-left">
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-primary text-sm font-semibold text-text-on-accent"
          >
            {i + 1}
          </span>
          <div className="min-w-0 flex-1 space-y-tight">
            <p className="text-sm text-text-primary">{step.text}</p>
            {step.say && <SayLine text={step.say} />}
            {(step.expect || step.then) && (
              <p className="text-sm text-text-secondary">{[step.expect, step.then].filter(Boolean).join(' ')}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default PackSteps;
