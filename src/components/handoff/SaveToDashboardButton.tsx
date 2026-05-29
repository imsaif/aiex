'use client';

import React from 'react';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useHandoffKit } from '@/hooks/useHandoffKit';

interface SaveToDashboardButtonProps {
  /** Pattern slug — the unit we save to the handoff kit. */
  slug: string;
  /** `icon` = compact circular button for card overlays; `full` = labelled pill for detail pages. */
  variant?: 'icon' | 'full';
  className?: string;
}

/**
 * Saves a pattern to the user's dashboard ("handoff kit"). From the dashboard
 * the user can generate a Claude Code / IDE handoff file. localStorage-backed,
 * no auth. Separate from the audit flow's handoff.
 */
export default function SaveToDashboardButton({
  slug,
  variant = 'icon',
  className = '',
}: SaveToDashboardButtonProps) {
  const { isSaved, toggle, isLoading } = useHandoffKit();
  const saved = isSaved(slug);

  const handleClick = (e: React.MouseEvent) => {
    // Cards wrap the button in a <Link>; don't navigate when saving.
    e.preventDefault();
    e.stopPropagation();
    toggle(slug);
  };

  const label = saved ? 'Saved to dashboard' : 'Save to dashboard';
  const Icon = saved ? BookmarkSolid : BookmarkOutline;

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={saved}
        aria-label={label}
        title={label}
        className={`inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-base font-medium transition-colors ${
          saved
            ? 'border-accent-primary bg-accent-subtle text-accent-primary'
            : 'border-border-primary bg-surface-primary text-text-secondary hover:text-text-primary hover:border-accent-primary'
        } ${className}`}
      >
        <Icon className="w-5 h-5" aria-hidden="true" />
        {isLoading ? 'Save' : saved ? 'Saved' : 'Save'}
      </button>
    );
  }

  // icon variant — overlay button for cards
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-full p-2 transition-colors ${
        saved
          ? 'bg-accent-subtle text-accent-primary'
          : 'bg-surface-primary/90 text-text-tertiary hover:text-accent-primary border border-border-primary'
      } ${className}`}
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}
