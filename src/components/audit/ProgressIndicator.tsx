'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

interface ProgressIndicatorProps {
  hasResults: boolean;
  onNewAudit: () => void;
}

interface Step {
  id: string;
  label: string;
  alwaysComplete?: boolean;
  completedWhen?: 'hasResults';
  action?: 'newAudit';
}

const STEPS: Step[] = [
  { id: 'upload', label: 'Upload screenshot', alwaysComplete: true },
  { id: 'review', label: 'Review your results', completedWhen: 'hasResults' },
  { id: 'fix', label: 'Fix top issues' },
  { id: 'reaudit', label: 'Re-audit to verify', action: 'newAudit' },
];

export function ProgressIndicator({ hasResults, onNewAudit }: ProgressIndicatorProps) {
  // Calculate which steps are complete
  const getStepStatus = (step: Step): 'complete' | 'action' | 'pending' => {
    if (step.alwaysComplete) return 'complete';
    if (step.completedWhen === 'hasResults' && hasResults) return 'complete';
    if (step.action) return 'action';
    return 'pending';
  };

  return (
    <div className="p-4 rounded-xl bg-background-secondary border border-border-primary mb-4">
      <h3 className="text-sm font-semibold text-text-primary mb-3">Your Progress</h3>
      <div className="space-y-2">
        {STEPS.map((step, index) => {
          const status = getStepStatus(step);
          const isComplete = status === 'complete';
          const isAction = status === 'action';

          return (
            <div key={step.id} className="flex items-center gap-3">
              {/* Step indicator */}
              <div className="flex-shrink-0">
                {isComplete ? (
                  <CheckCircleSolid className="w-5 h-5 text-status-success" />
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                    isAction
                      ? 'border-accent-primary text-accent-primary'
                      : 'border-border-primary text-text-tertiary'
                  }`}>
                    {index + 1}
                  </div>
                )}
              </div>

              {/* Step label */}
              <span className={`text-sm ${
                isComplete
                  ? 'text-text-secondary line-through'
                  : isAction
                  ? 'text-accent-primary font-medium'
                  : 'text-text-secondary'
              }`}>
                {step.label}
              </span>

              {/* Action button for re-audit */}
              {isAction && step.action === 'newAudit' && (
                <button
                  type="button"
                  onClick={onNewAudit}
                  className="ml-auto text-xs text-accent-primary hover:underline flex items-center gap-1"
                >
                  <ArrowPathIcon className="w-3 h-3" />
                  Start
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
