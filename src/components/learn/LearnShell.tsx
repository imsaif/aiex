import type { ReactNode } from 'react';

/**
 * The console shell: page ground, rail column, content column.
 *
 * Every page in the learning area uses this, so the rail sits in the same place
 * and the surfaces read the same everywhere. It replaced five copies of the
 * same grid class string, which had already started to drift.
 *
 * Three surface levels, which is what gives the layout its hierarchy — a single
 * flat white page makes the rail and the content read as one undifferentiated
 * sheet:
 *
 *   background-tertiary   the ground the console sits on
 *   background-rail       the rail column, a real step off white
 *   background-primary    the content column, the only white surface
 *
 * The console is a bounded slab centred on that ground, with an explicit edge
 * on both sides. Without the edge the rail and the ground read as one — the
 * left margin vanished into the rail while the right stayed visible, so the
 * layout looked pushed to one side. The token steps are only 5 units apart, so
 * the border is doing the work, not the tint.
 *
 * Wider than the site's usual max-w-7xl (1280px). The rail costs 260px before
 * any content, so at 1280 the reading column was narrower than on a page with
 * no rail at all.
 */
export default function LearnShell({
  sidebar,
  aside,
  children,
}: {
  sidebar: ReactNode;
  /** Optional third column — the "On this page" rail on course and lesson pages. */
  aside?: ReactNode;
  children: ReactNode;
}) {
  // The third column only appears at xl, where there is room for it without
  // squeezing the reading column.
  const columns = aside
    ? 'lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_240px]'
    : 'lg:grid-cols-[260px_minmax(0,1fr)]';

  return (
    <div className="learn-console-ground bg-background-console">
      <div
        className={`mx-auto max-w-[1600px] lg:grid lg:border-r lg:border-border-primary ${columns}`}
      >
        <div className="bg-background-rail lg:border-r lg:border-border-primary">
          {sidebar}
        </div>

        <div className="min-w-0 bg-background-primary px-6 lg:px-10">
          {children}
        </div>

        {aside && (
          <div className="hidden bg-background-primary pr-6 xl:block">
            {aside}
          </div>
        )}
      </div>
    </div>
  );
}
