'use client';

import { useState } from 'react';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import type { SavedAudit } from '@/hooks/useSavedAudits';
import { SelectCheckbox } from '@/components/ui/SelectCheckbox';

/** "a chat interface" -> "Chat interface" for card titles. */
function displayLabel(productLabel: string): string {
  const stripped = productLabel.replace(/^an?\s+/i, '');
  return stripped.charAt(0).toUpperCase() + stripped.slice(1);
}

function formatDate(ms: number): string {
  try {
    return new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

interface AuditCardProps {
  audit: SavedAudit;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

function AuditCard({ audit, selected, onToggleSelect, onRemove }: AuditCardProps) {
  const [expanded, setExpanded] = useState(false);
  const title = displayLabel(audit.productLabel);

  const meta = [
    `${audit.gaps.length} gap${audit.gaps.length === 1 ? '' : 's'}`,
    audit.score !== null && audit.maxScore !== null ? `${audit.score}/${audit.maxScore}` : null,
    formatDate(audit.savedAt),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <li className="py-4 sm:py-5">
      <div className="flex items-start gap-3">
        <SelectCheckbox
          checked={selected}
          onChange={() => onToggleSelect(audit.id)}
          label={`Include the ${title} audit in the handoff`}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <p className="mt-0.5 text-sm text-text-secondary">{meta}</p>
          {audit.surfaceDescription && (
            <p className="mt-1 text-sm text-text-secondary line-clamp-2">{audit.surfaceDescription}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onRemove(audit.id)}
          aria-label="Remove this audit from dashboard"
          title="Remove"
          className="shrink-0 rounded-full p-2 text-text-tertiary hover:text-status-error hover:bg-surface-secondary transition-colors"
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 pl-8">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ChevronDownIcon className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
          {expanded ? 'Hide details' : 'View'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pl-8 border-t border-border-primary pt-4 space-y-4">
          {audit.gaps.length > 0 && (
            <ol className="space-y-3">
              {audit.gaps.map((gap, i) => (
                <li key={i} className="text-sm">
                  <p className="font-semibold text-text-primary">
                    {i + 1}. {gap.pattern}
                  </p>
                  <p className="mt-0.5 text-text-secondary">{gap.finding}</p>
                  {gap.recommendation && (
                    <p className="mt-0.5 text-text-secondary">
                      <span className="text-text-secondary font-medium">Fix: </span>
                      {gap.recommendation}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          )}
          {audit.quickWins.length > 0 && (
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-text-secondary mb-1.5">Quick wins</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-text-secondary">
                {audit.quickWins.map((win, i) => (
                  <li key={i}>{win}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

interface SavedAuditsSectionProps {
  audits: SavedAudit[];
  isSelected: (id: string) => boolean;
  onToggleSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

/**
 * "Fix now" section — audits are gaps found in the user's own product. Controlled
 * by the dashboard (selection + storage live there); this renders the list and
 * feeds the single Generate-handoff CTA via checkboxes.
 */
export default function SavedAuditsSection({ audits, isSelected, onToggleSelect, onRemove }: SavedAuditsSectionProps) {
  if (audits.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="mb-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
          {audits.length} saved audit{audits.length === 1 ? '' : 's'}
        </p>
        <p className="mt-1 text-sm text-text-secondary">Gaps found in your product. Act on these now.</p>
      </div>
      <ul className="divide-y divide-border-primary border-t border-border-primary">
        {audits.map((audit) => (
          <AuditCard
            key={audit.id}
            audit={audit}
            selected={isSelected(audit.id)}
            onToggleSelect={onToggleSelect}
            onRemove={onRemove}
          />
        ))}
      </ul>
    </div>
  );
}
