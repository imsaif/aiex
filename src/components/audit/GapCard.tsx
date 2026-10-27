'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ExclamationTriangleIcon, XCircleIcon, CheckCircleIcon, ArrowTopRightOnSquareIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
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

// Severity is a tinted pill with an icon and a word, so it never relies on
// colour alone. The status colours fail contrast as text, so the word itself
// stays text-primary and only the tint and icon carry the hue.
const severityConfig = {
  missing: { label: 'Critical', icon: XCircleIcon, pill: 'bg-status-error/15', icon_: 'text-status-error' },
  'needs-improvement': { label: 'Warning', icon: ExclamationTriangleIcon, pill: 'bg-status-warning/20', icon_: 'text-status-warning' },
  good: { label: 'Good', icon: CheckCircleIcon, pill: 'bg-status-success/15', icon_: 'text-status-success' },
};

/**
 * One gap, ranked by reading order: the headline (the problem, 12 words or
 * fewer) leads, then the fix, then the evidence and consequence folded behind
 * Details. Imran's review found the old card (a 60-80 word finding, "Why it
 * matters" and the fix at similar weight) gave no sense of where to look first.
 * Older audits have no headline, so they fall back to the full finding.
 */
export function GapCard({ gap, index, isHighlighted, prominent, isTopPriority, onMouseEnter, onMouseLeave }: GapCardProps) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const config = severityConfig[gap.status] || severityConfig.missing;
  const Icon = config.icon;
  // Resolves the pattern page this finding links to. Null when the model named
  // a pattern the catalogue does not carry, in which case the name is plain text.
  const slug = resolvePatternSlug(gap.pattern, gap.resource);
  // The gap list is rendered best-first, so the #1 card is the "fix this first" gap.
  const isTop = isTopPriority ?? index === 1;
  const useProminent = prominent || isTop;
  const headline = gap.headline?.trim();
  const hasDetails = Boolean(headline ? gap.finding || gap.impact : gap.impact);

  const patternName = (() => {
    const linkClass =
      'group/link inline-flex items-baseline gap-1 underline decoration-accent-primary/30 underline-offset-4 hover:text-accent-primary hover:decoration-accent-primary transition-colors';
    const icon = (
      <>
        <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 self-center flex-shrink-0 text-text-tertiary group-hover/link:text-accent-primary transition-colors" aria-hidden />
        <span className="sr-only">(opens in a new tab)</span>
      </>
    );
    if (slug) {
      return (
        <Link
          href={`/patterns/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackAuditEvent('audit_resource_clicked', { pattern: gap.pattern, slug })}
          className={linkClass}
        >
          {gap.pattern}
          {icon}
        </Link>
      );
    }
    if (gap.resource) {
      return (
        <a
          href={gap.resource}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackAuditEvent('audit_resource_clicked', { pattern: gap.pattern, external: true })}
          className={linkClass}
        >
          {gap.pattern}
          {icon}
        </a>
      );
    }
    return <span>{gap.pattern}</span>;
  })();

  return (
    <article
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`rounded-card border border-border-primary bg-background-primary transition-shadow ${
        useProminent ? 'p-loose shadow-card' : 'p-default sm:p-loose'
      } ${isHighlighted ? 'ring-2 ring-accent-primary border-accent-primary shadow-card-hover' : ''}`}
    >
      {/* Meta row: what kind of gap, how bad, how hard. Small on purpose; the
          headline below is what the reader should land on. */}
      <div className="flex items-center gap-tight flex-wrap">
        {index !== undefined && (
          <span className="flex-shrink-0 w-6 h-6 rounded-pill bg-background-secondary flex items-center justify-center text-sm font-semibold text-text-secondary tabular-nums">
            {index}
          </span>
        )}
        <span className="text-sm font-semibold text-text-secondary">{patternName}</span>
        <span className="ml-auto inline-flex items-center gap-tight flex-wrap">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-sm font-medium text-text-primary ${config.pill}`}>
            <Icon className={`w-3.5 h-3.5 ${config.icon_}`} aria-hidden />
            {config.label}
          </span>
          {gap.effort && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-pill text-sm font-medium bg-background-secondary text-text-secondary">
              {effortConfig[gap.effort]}
            </span>
          )}
          {isTop && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-pill text-sm font-bold uppercase tracking-wider bg-accent-subtle text-accent-primary">
              Start here
            </span>
          )}
        </span>
      </div>

      {/* Primary: the problem. */}
      <h3
        className={`mt-snug font-semibold text-text-primary leading-snug text-balance ${
          headline ? (useProminent ? 'text-xl' : 'text-lg') : 'text-base font-normal text-text-secondary leading-relaxed'
        }`}
      >
        {headline || gap.finding}
      </h3>

      {/* The action. */}
      {gap.recommendation && (
        <div className="mt-default">
          <p className="type-eyebrow text-text-secondary mb-tight">Fix</p>
          <p className="rounded-input bg-accent-subtle px-default py-snug text-base text-text-primary leading-relaxed">
            {gap.recommendation}
          </p>
        </div>
      )}

      {/* Secondary: evidence and consequence, folded. Grid-rows transition so
          the reveal eases open instead of snapping. */}
      {hasDetails && (
        <div className="mt-snug">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors rounded-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          >
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform duration-150 ease-out motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
              aria-hidden
            />
            {open ? 'Hide details' : 'Details'}
          </button>
          <div
            id={detailsId}
            className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
              open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
            aria-hidden={!open}
          >
            <div className="overflow-hidden">
              <dl className="pt-snug grid gap-snug text-sm leading-relaxed">
                {headline && gap.finding && (
                  <div>
                    <dt className="font-semibold text-text-primary">What we saw</dt>
                    <dd className="text-text-secondary">{gap.finding}</dd>
                  </div>
                )}
                {gap.impact && (
                  <div>
                    <dt className="font-semibold text-text-primary">Why it matters</dt>
                    <dd className="text-text-secondary">{gap.impact}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
