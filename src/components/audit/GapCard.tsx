import Link from 'next/link';
import { ExclamationTriangleIcon, XCircleIcon, CheckCircleIcon, LightBulbIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import type { TopGap } from '@/types/audit';
import { resolvePatternSlug } from '@/lib/audit/pattern-link';
import { trackAuditEvent } from '@/lib/audit/analytics';

interface GapCardProps {
  gap: TopGap;
  index?: number;
  isHighlighted?: boolean;
  /** Larger treatment for the lead "top priority" gap. */
  prominent?: boolean;
  /** Marks the single highest-priority gap — shows a "Start here" badge. */
  isTopPriority?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const effortConfig: Record<NonNullable<TopGap['effort']>, string> = {
  quick: 'Quick win',
  medium: 'Medium effort',
  involved: 'Involved',
};

const severityConfig = {
  missing: {
    label: 'Critical',
    icon: XCircleIcon,
    badge: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  },
  'needs-improvement': {
    label: 'Warning',
    icon: ExclamationTriangleIcon,
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  },
  good: {
    label: 'Good',
    icon: CheckCircleIcon,
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  },
};

export function GapCard({ gap, index, isHighlighted, prominent, isTopPriority, onMouseEnter, onMouseLeave }: GapCardProps) {
  const config = severityConfig[gap.status] || severityConfig.missing;
  const Icon = config.icon;
  // Resolves the pattern page this finding links to. Null when the model named
  // a pattern the catalogue does not carry, in which case the name is plain text.
  const slug = resolvePatternSlug(gap.pattern, gap.resource);
  // The gap list is rendered best-first, so the #1 card is the "fix this first"
  // gap. Callers can override with isTopPriority; otherwise index 1 leads.
  const isTop = isTopPriority ?? index === 1;
  const useProminent = prominent || isTop;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      // Neutral border on every card. Severity was doing double duty as a
      // tinted card edge, which tinted the whole column red and amber and made
      // the page feel alarmed. The badge still carries it, with an icon and a
      // word, so nothing is conveyed by colour alone.
      className={`rounded-xl border border-border-primary bg-background-primary transition-all ${
        useProminent ? 'p-6 sm:p-7 shadow-card' : 'p-5'
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
          {/* Severity leads on every card, so the badges and the pattern names
              line up down the column. "Start here" used to sit first and only
              on the top card, which pushed that one card's badge and title out
              of alignment with the rest. It now rides on the right with the
              effort tag, where an occasional extra label costs nothing. */}
          <div className="flex items-center gap-2 flex-wrap mb-2.5">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
              <Icon className="w-3.5 h-3.5" />
              {config.label}
            </span>
            {/* The pattern name is the link, and it has to look like one.
                It was styled underline-on-hover only, so at rest it read as
                plain heading text and nobody knew it went anywhere. Persistent
                underline plus the new-tab glyph, which also warns that the
                click will not lose the audit behind it.

                The pattern name is the link. There used to be a separate
                "See how <pattern> solves this" line under the card, which was
                the least visible thing on it and repeated the name a third
                time. Linking the heading keeps the route to the pattern page
                (and the internal link equity) without a competing CTA. */}
            {(() => {
              const heading = `font-semibold text-text-primary leading-tight ${useProminent ? 'text-xl' : 'text-lg'}`;
              if (slug) {
                return (
                  <h3 className={heading}>
                    <Link
                      href={`/patterns/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackAuditEvent('audit_resource_clicked', { pattern: gap.pattern, slug })}
                      className="group/link inline-flex items-baseline gap-1.5 underline decoration-2 decoration-accent-primary/30 underline-offset-4 hover:text-accent-primary hover:decoration-accent-primary transition-colors"
                    >
                      {gap.pattern}
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 self-center flex-shrink-0 text-text-tertiary group-hover/link:text-accent-primary transition-colors" aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </Link>
                  </h3>
                );
              }
              if (gap.resource) {
                return (
                  <h3 className={heading}>
                    <a
                      href={gap.resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackAuditEvent('audit_resource_clicked', { pattern: gap.pattern, external: true })}
                      className="group/link inline-flex items-baseline gap-1.5 underline decoration-2 decoration-accent-primary/30 underline-offset-4 hover:text-accent-primary hover:decoration-accent-primary transition-colors"
                    >
                      {gap.pattern}
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 self-center flex-shrink-0 text-text-tertiary group-hover/link:text-accent-primary transition-colors" aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </h3>
                );
              }
              return <h3 className={heading}>{gap.pattern}</h3>;
            })()}
            {/* Right-hand tags. `ml-auto` on the group rather than on the first
                tag, so they stay together when only one of them is present. */}
            {(isTop || gap.effort) && (
              <span className="ml-auto inline-flex items-center gap-2">
                {gap.effort && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-background-secondary text-text-secondary">
                    {effortConfig[gap.effort]}
                  </span>
                )}
                {isTop && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-subtle text-accent-primary">
                    Start here
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Finding — the problem */}
          <p className="text-base text-text-secondary leading-relaxed">{gap.finding}</p>

          {/* Impact — why the gap matters, so the finding reads as a diagnosis
              (with consequences) rather than a bare observation. */}
          {gap.impact && (
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              <span className="font-semibold text-text-primary">Why it matters: </span>
              {gap.impact}
            </p>
          )}

          {/* Fix — the action, in its own block so the card reads as
              problem → fix instead of one undifferentiated wall of text.

              The bulb carries the meaning on its own, so the "Recommended fix"
              label came off: it cost a whole line per card and said what the
              icon and the tinted panel already say. */}
          {gap.recommendation && (
            <div className="mt-3.5 flex items-start gap-2.5 rounded-lg border border-border-primary bg-accent-subtle p-4">
              <LightBulbIcon className="w-4 h-4 mt-1 flex-shrink-0 text-accent-primary" aria-hidden />
              <p className="text-base text-text-primary leading-relaxed">
                <span className="sr-only">Recommended fix: </span>
                {gap.recommendation}
              </p>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
