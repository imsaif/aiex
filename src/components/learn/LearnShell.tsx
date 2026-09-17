'use client';

import { useEffect, useState, type ReactNode } from 'react';

/**
 * The console shell: page ground, rail column, content column.
 *
 * Every page in the learning area uses this, so the rail sits in the same place
 * and the surfaces read the same everywhere. It replaced five copies of the
 * same grid class string, which had already started to drift.
 *
 * Three surface levels, which is what gives the layout its hierarchy. A single
 * flat white page makes the rail and the content read as one undifferentiated
 * sheet:
 *
 *   background-tertiary   the ground the console sits on
 *   background-rail       the rail column, a real step off white
 *   background-primary    the content column, the only white surface
 *
 * The console is a bounded slab centred on that ground, with an explicit edge
 * on both sides. Without the edge the rail and the ground read as one: the
 * left margin vanished into the rail while the right stayed visible, so the
 * layout looked pushed to one side. The token steps are only 5 units apart, so
 * the border is doing the work, not the tint.
 *
 * Wider than the site's usual max-w-7xl (1280px). The rail costs 260px before
 * any content, so at 1280 the reading column was narrower than on a page with
 * no rail at all.
 *
 * ## Why this is a client component
 *
 * The rail collapses. Lesson screenshots are the widest thing on these pages
 * and the rail spends 260px on navigation the reader has already used, so on a
 * laptop the picture is the thing being squeezed. Collapsing is a per-reader
 * preference, which means state, which means a client component. Children are
 * still rendered on the server and passed in as props, so nothing below this
 * becomes client-side.
 */

const STORAGE_KEY = 'aiux:learn-rail-collapsed';

export default function LearnShell({
  sidebar,
  aside,
  children,
}: {
  sidebar: ReactNode;
  /** Optional third column: the "On this page" rail on course and lesson pages. */
  aside?: ReactNode;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  // Read the stored preference after mount rather than during render, so the
  // server and the first client render agree. Reading localStorage during
  // render is a hydration mismatch waiting to happen, which this codebase has
  // already been bitten by once (see the date-conditional entry in the
  // performance rules).
  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      // Private browsing, or storage disabled. The rail simply starts open.
    }
  }, []);

  function toggle() {
    setCollapsed((previous) => {
      const next = !previous;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      } catch {
        // Not worth failing the interaction over.
      }
      return next;
    });
  }

  // Collapsed, the rail keeps a narrow strip rather than disappearing: a
  // control that vanishes entirely leaves the reader hunting for the way back.
  const railWidth = collapsed ? '48px' : '260px';

  // The third column only appears at xl, where there is room for it without
  // squeezing the reading column.
  const template = aside
    ? { lg: `${railWidth} minmax(0,1fr)`, xl: `${railWidth} minmax(0,1fr) 240px` }
    : { lg: `${railWidth} minmax(0,1fr)`, xl: `${railWidth} minmax(0,1fr)` };

  return (
    <div className="learn-console-ground bg-background-console">
      <div
        className="learn-console-grid mx-auto max-w-[1600px] lg:grid lg:border-r lg:border-border-primary"
        style={
          {
            '--learn-rail': railWidth,
            '--learn-cols-lg': template.lg,
            '--learn-cols-xl': template.xl,
          } as React.CSSProperties
        }
      >
        <div className="relative bg-background-rail lg:border-r lg:border-border-primary">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand course navigation' : 'Collapse course navigation'}
            title={collapsed ? 'Expand course navigation' : 'Collapse course navigation'}
            className="absolute right-2 top-4 z-sticky hidden h-7 w-7 cursor-pointer items-center justify-center rounded-button text-text-secondary transition-colors hover:bg-background-secondary hover:text-text-primary lg:flex"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="9" y1="4" x2="9" y2="20" />
            </svg>
          </button>

          {/* Hidden rather than unmounted, so the rail's scroll position and
              any open course group survive a collapse and expand. */}
          <div className={collapsed ? 'lg:hidden' : undefined}>{sidebar}</div>
        </div>

        <div className="min-w-0 bg-background-primary px-6 lg:px-10">{children}</div>

        {aside && (
          <div className="hidden bg-background-primary pr-6 xl:block">{aside}</div>
        )}
      </div>
    </div>
  );
}
