'use client';

import { SparklesIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { PREMIUM_BENEFITS } from '@/lib/mentor-tier';

interface UpgradePromptProps {
  context: 'scan_limit' | 'annotation_limit' | 'fixprompt_limit' | 'general';
  currentUsage?: {
    used: number;
    limit: number;
  };
  onUpgrade?: () => void;
  compact?: boolean;
}

const CONTEXT_CONTENT = {
  scan_limit: {
    icon: LockClosedIcon,
    title: 'Scan Limit Reached',
    description: "You've used all your free scans for this month.",
    action: 'Upgrade for unlimited scans',
  },
  annotation_limit: {
    icon: SparklesIcon,
    title: 'More Issues Detected',
    description: "We found more issues, but free tier shows only 3 annotations.",
    action: 'See all visual annotations',
  },
  fixprompt_limit: {
    icon: SparklesIcon,
    title: 'More Fix Prompts Available',
    description: 'Free tier includes 1 fix prompt. Upgrade for all patterns.',
    action: 'Get unlimited fix prompts',
  },
  general: {
    icon: SparklesIcon,
    title: 'Upgrade to Premium',
    description: 'Unlock the full power of AI Design Mentor.',
    action: 'Upgrade now',
  },
};

export function UpgradePrompt({
  context,
  currentUsage,
  onUpgrade,
  compact = false,
}: UpgradePromptProps) {
  const content = CONTEXT_CONTENT[context];
  const Icon = content.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-accent-subtle to-transparent border border-accent-primary/20 rounded-xl">
        <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">
            {content.title}
          </p>
          <p className="text-xs text-text-secondary truncate">
            {content.description}
          </p>
        </div>
        <button
          type="button"
          onClick={onUpgrade}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-accent-primary rounded-full hover:bg-accent-hover transition-colors flex-shrink-0"
        >
          Upgrade
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-accent-subtle via-background-primary to-background-secondary border border-accent-primary/20 rounded-2xl p-6 shadow-card">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-accent-primary flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            {content.title}
          </h3>
          <p className="text-sm text-text-secondary">
            {content.description}
          </p>
        </div>
      </div>

      {/* Usage indicator (if provided) */}
      {currentUsage && (
        <div className="mb-6 p-4 bg-background-secondary rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
              Usage
            </span>
            <span className="text-sm font-semibold text-text-primary">
              {currentUsage.used} / {currentUsage.limit}
            </span>
          </div>
          <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-primary rounded-full transition-all"
              style={{ width: `${Math.min((currentUsage.used / currentUsage.limit) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Benefits */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
          Premium Benefits
        </h4>
        <ul className="space-y-2">
          {PREMIUM_BENEFITS.slice(0, 4).map((benefit, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircleIcon className="w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-text-primary">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onUpgrade}
        className="w-full py-3 px-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-hover transition-all hover:scale-[1.02] shadow-md"
      >
        {content.action}
      </button>

      {/* Fine print */}
      <p className="text-xs text-text-tertiary text-center mt-3">
        Cancel anytime. 14-day money-back guarantee.
      </p>
    </div>
  );
}

export default UpgradePrompt;
