import type { PackStep } from '@/lib/skills/packSteps';
import { SayLine } from './SayLine';

/** Numbered steps. `full` adds the extra help the walkthrough pages carry. */
export function PackSteps({ steps, full = false }: { steps: PackStep[]; full?: boolean }) {
  return (
    <ol className={full ? 'space-y-10' : 'space-y-5'}>
      {steps.map((step, i) => (
        <li key={step.text} className="flex gap-snug text-left">
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-primary text-sm font-semibold text-text-on-accent"
          >
            {i + 1}
          </span>
          <div className="min-w-0 flex-1 space-y-tight">
            <p className={full ? 'type-body font-medium text-text-primary' : 'text-sm text-text-primary'}>
              {step.text}
            </p>
            {step.say && <SayLine text={step.say} />}
            {step.then && <p className="text-sm text-text-secondary">{step.then}</p>}
            {full && step.more && <p className="text-sm text-text-secondary">{step.more}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default PackSteps;
