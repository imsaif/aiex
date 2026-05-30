'use client';

import { useState } from 'react';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useSavedAudits, type SavedAudit } from '@/hooks/useSavedAudits';

interface SaveAuditButtonProps {
  /** Fully-assembled audit snapshot to persist (text only — no screenshot). */
  audit: SavedAudit;
  className?: string;
}

/**
 * Saves the current audit to the user's dashboard. localStorage-backed, no
 * auth. Separate from the saved-patterns flow (`SaveToDashboardButton`). If the
 * write is rejected (e.g. storage full) the button surfaces an error instead of
 * a false "Saved" — see `useSavedAudits.save`.
 */
export default function SaveAuditButton({ audit, className = '' }: SaveAuditButtonProps) {
  const { isSaved, save, remove, isLoading } = useSavedAudits();
  const [errored, setErrored] = useState(false);
  const saved = isSaved(audit.id);

  const handleClick = () => {
    setErrored(false);
    if (saved) {
      remove(audit.id);
      return;
    }
    const ok = save(audit);
    if (!ok) {
      setErrored(true);
      setTimeout(() => setErrored(false), 4000);
    }
  };

  const Icon = saved ? BookmarkSolid : BookmarkOutline;
  const label = errored
    ? "Couldn't save"
    : isLoading
      ? 'Save audit'
      : saved
        ? 'Saved'
        : 'Save audit';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? 'Remove this audit from your dashboard' : 'Save this audit to your dashboard'}
      title={errored ? 'Storage is full — try removing an older saved audit' : undefined}
      className={`inline-flex items-center justify-center gap-2 transition-colors ${
        errored ? 'text-status-error' : saved ? 'text-accent-primary' : ''
      } ${className}`}
    >
      <Icon className="w-4 h-4" aria-hidden="true" />
      {label}
    </button>
  );
}
