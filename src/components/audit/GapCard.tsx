import { ExclamationTriangleIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import type { TopGap } from '@/types/audit';

interface GapCardProps {
  gap: TopGap;
  index?: number;
}

const severityConfig = {
  missing: {
    label: 'Critical',
    icon: XCircleIcon,
    badge: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
    border: 'border-red-200/50 dark:border-red-900/30',
  },
  'needs-improvement': {
    label: 'Warning',
    icon: ExclamationTriangleIcon,
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    border: 'border-amber-200/50 dark:border-amber-900/30',
  },
  good: {
    label: 'Good',
    icon: CheckCircleIcon,
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    border: 'border-emerald-200/50 dark:border-emerald-900/30',
  },
};

export function GapCard({ gap, index }: GapCardProps) {
  const config = severityConfig[gap.status] || severityConfig.missing;
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border ${config.border} bg-background-primary p-5`}>
      <div className="flex items-start gap-3">
        {index !== undefined && (
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-background-secondary flex items-center justify-center text-sm font-semibold text-text-secondary">
            {index}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
              <Icon className="w-3.5 h-3.5" />
              {config.label}
            </span>
            <h3 className="font-semibold text-text-primary">{gap.pattern}</h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-2">{gap.finding}</p>
          {gap.recommendation && (
            <p className="text-sm text-text-secondary leading-relaxed">
              <span className="font-medium text-text-primary">Fix: </span>
              {gap.recommendation}
            </p>
          )}
          {gap.resource && (
            <a
              href={gap.resource}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-accent-primary hover:underline"
            >
              Learn more about this pattern &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
