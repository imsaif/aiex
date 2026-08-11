'use client';

import Link from 'next/link';
import { BookmarkIcon } from '@heroicons/react/24/solid';
import { useSavedCount } from '@/hooks/useSavedCount';
import { trackAuditEvent } from '@/lib/audit/analytics';

/**
 * Sticky "here is what you have collected" bar for pattern browsing.
 *
 * The pattern library works like a cookbook: you browse, you save patterns as
 * Claude skills, and you download them together at checkout. This bar is the
 * running total, and the way back to checkout from anywhere in the library.
 *
 * Mounted only on the pattern routes (the grid, category pages, and detail
 * pages), because that is where saving happens. The navbar badge suppresses its
 * own number on those same routes so only one live count is ever on screen.
 *
 * The label is deliberately item-neutral. The count sums saved patterns AND
 * saved audits to match the navbar badge, so a reader holding one audit and no
 * patterns must not be told they have "1 skill".
 */
export default function SavedItemsBar() {
  const { count, isLoading } = useSavedCount();

  // Hidden until the count settles, otherwise the bar flashes "0 saved" during
  // hydration and then pops in.
  if (isLoading || count === 0) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-sticky border-t border-primary bg-surface-primary/95 backdrop-blur animate-slide-up"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="flex items-center gap-2 text-base font-medium text-text-primary">
          <BookmarkIcon className="h-5 w-5 text-accent-primary" aria-hidden="true" />
          {count} saved
        </p>
        <Link
          href="/dashboard"
          onClick={() => trackAuditEvent('saved_items_bar_clicked', { count })}
          className="inline-flex items-center gap-2 rounded-pill bg-accent-primary px-5 py-2.5 text-base font-medium text-white hover:bg-accent-hover transition-colors"
        >
          Review and download
        </Link>
      </div>
    </div>
  );
}
