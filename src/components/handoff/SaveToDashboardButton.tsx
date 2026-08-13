'use client';

import React from 'react';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useHandoffKit } from '@/hooks/useHandoffKit';

interface SaveToDashboardButtonProps {
  /** Pattern slug — the unit we save to the handoff kit. */
  slug: string;
  /**
   * `icon` = compact circular button for card overlays;
   * `full` = labelled pill for detail pages;
   * `block` = full-width primary button for the skill card in the sidebar.
   */
  variant?: 'icon' | 'full' | 'block';
  /**
   * Override the visible text. The `block` variant on a pattern page sits on the
   * same screen as the `full` pill saving the same slug, so it says something
   * different ("Saved. Download it at checkout.") to read as confirmation of the
   * pill rather than a second, separate ask.
   */
  labels?: { idle: string; saved: string };
  className?: string;
}

/**
 * Saves a pattern to the user's dashboard, where saved patterns become
 * downloadable Claude Code skills. localStorage-backed, no auth. Separate from
 * the audit flow's save.
 *
 * Every save affordance on the site routes through this one component, so the
 * aria semantics (`aria-pressed`, label wording) cannot drift between surfaces.
 * Multiple instances for the same slug stay in sync automatically: `useHandoffKit`
 * broadcasts a DOM event on every write and each instance re-reads the store.
 */
export default function SaveToDashboardButton({
  slug,
  variant = 'icon',
  labels,
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

  if (variant === 'block') {
    const text = saved ? (labels?.saved ?? 'Saved') : (labels?.idle ?? 'Save');
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={saved}
        aria-label={label}
        className={`w-full inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition-colors cursor-pointer ${
          saved
            ? 'border-accent-primary bg-accent-subtle text-accent-primary'
            : 'border-accent-primary bg-accent-primary text-white hover:bg-accent-hover'
        } ${className}`}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
        {isLoading ? (labels?.idle ?? 'Save') : text}
      </button>
    );
  }

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
        {isLoading
          ? (labels?.idle ?? 'Save')
          : saved
            ? (labels?.saved ?? 'Saved')
            : (labels?.idle ?? 'Save')}
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
