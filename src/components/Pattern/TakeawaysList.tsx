import React from 'react';
import type { Takeaway } from '../../types';

interface Props {
  items: Takeaway[];
}

/**
 * Headless single-block list of takeaway points. One bordered card, all four
 * points inside, separated by hairlines. Caller provides the surrounding
 * <section> and H2 so the parent can compose this side-by-side with another
 * card (e.g. InstallPatternCTA) under a shared section heading.
 */
export default function TakeawaysList({ items }: Props) {
  return (
    <ol className="bg-surface-primary border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden divide-y divide-gray-200 dark:divide-gray-700">
      {items.map((t, i) => (
        <li key={i} className="p-6 md:p-7 flex gap-5">
          <span className="flex-shrink-0 h-9 w-9 rounded-full bg-accent-primary text-white flex items-center justify-center text-base font-semibold">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-text-primary mb-2">{t.heading}</h3>
            <p className="text-text-secondary leading-relaxed">{t.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
