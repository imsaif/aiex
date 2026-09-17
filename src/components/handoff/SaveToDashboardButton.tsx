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
   * `icon` only: show the button's own label on hover and focus, instead of
   * leaving it to the browser's native tooltip.
   *
   * The label is already computed here and is state-aware ("Save to dashboard"
   * / "Saved to dashboard"), so surfacing it is a rendering choice rather than
   * new copy — which is the point. A tooltip written at the call site would be
   * a second source of wording that could drift from the aria-label a screen
   * reader hears.
   */
  showLabelOnHover?: boolean;
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
  showLabelOnHover = false,
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
  const button = (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={label}
      // The native tooltip is dropped when we draw our own, so the same words
      // do not appear twice, a second late, in a different style.
      title={showLabelOnHover ? undefined : label}
      className={`inline-flex items-center justify-center rounded-full p-2 transition-colors ${
        saved
          ? 'bg-accent-subtle text-accent-primary'
          : 'bg-surface-primary/90 text-text-tertiary hover:text-accent-primary border border-border-primary'
      } ${showLabelOnHover ? '' : className}`}
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
    </button>
  );

  if (!showLabelOnHover) return button;

  return (
    <span className={`group/save relative inline-flex ${className}`}>
      {button}
      {/* aria-hidden because the button already carries this text as its
          accessible name; announcing it twice is noise, not help. */}
      <span
        aria-hidden="true"
        className="type-footnote pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-card bg-text-primary px-2 py-1 text-background-primary opacity-0 transition-opacity group-focus-within/save:opacity-100 group-hover/save:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}
