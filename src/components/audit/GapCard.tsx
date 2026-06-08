import Link from 'next/link';
import { ExclamationTriangleIcon, XCircleIcon, CheckCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import type { TopGap } from '@/types/audit';
import { resolvePatternSlug } from '@/lib/audit/pattern-link';

interface GapCardProps {
  gap: TopGap;
  index?: number;
  isHighlighted?: boolean;
  /** Larger treatment for the lead "top priority" gap. */
  prominent?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
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

export function GapCard({ gap, index, isHighlighted, prominent, onMouseEnter, onMouseLeave }: GapCardProps) {
  const config = severityConfig[gap.status] || severityConfig.missing;
  const Icon = config.icon;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`rounded-xl border ${config.border} bg-background-primary transition-all ${
        prominent ? 'p-6 sm:p-7 shadow-card' : 'p-5'
      } ${
        isHighlighted ? 'ring-2 ring-accent-primary border-accent-primary shadow-md' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {index !== undefined && (
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-background-secondary flex items-center justify-center text-sm font-semibold text-text-secondary">
            {index}
          </span>
        )}
        <div className="flex-1 min-w-0">
          {/* Header — pattern name leads, severity is a quieter tag beside it */}
          <div className="flex items-center gap-2 flex-wrap mb-2.5">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
              <Icon className="w-3.5 h-3.5" />
              {config.label}
            </span>
            <h3 className={`font-semibold text-text-primary leading-tight ${prominent ? 'text-xl' : 'text-lg'}`}>{gap.pattern}</h3>
          </div>

          {/* Finding — the problem */}
          <p className="text-base text-text-secondary leading-relaxed">{gap.finding}</p>

          {/* Fix — the action, in its own block so the card reads as
              problem → fix instead of one undifferentiated wall of text. */}
          {gap.recommendation && (
            <div className="mt-3.5 rounded-lg border border-border-primary bg-accent-subtle p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <LightBulbIcon className="w-4 h-4 text-accent-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-accent-primary">Recommended fix</span>
              </div>
              <p className="text-base text-text-primary leading-relaxed">{gap.recommendation}</p>
            </div>
          )}

          {(() => {
            // Prefer internal /patterns/<slug> link so the audit funnels link
            // equity into pattern pages. Fall back to the external resource only
            // when no pattern matches. New tab preserves the user's audit state.
            const slug = resolvePatternSlug(gap.pattern, gap.resource);
            if (slug) {
              return (
                <Link
                  href={`/patterns/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-xs text-text-tertiary hover:text-accent-primary hover:underline"
                >
                  See how {gap.pattern} solves this &rarr;
                </Link>
              );
            }
            if (gap.resource) {
              return (
                <a
                  href={gap.resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-xs text-text-tertiary hover:text-accent-primary hover:underline"
                >
                  Learn more about this pattern &rarr;
                </a>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </div>
  );
}
