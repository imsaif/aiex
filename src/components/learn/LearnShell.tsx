'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useScrollLock } from '@/hooks/useScrollLock';

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
 *
 * ## On phones the rail is a drawer
 *
 * Below lg there is no room for a rail column, and for a while the rail was
 * simply hidden there, which left a phone reader with no lesson list, no way
 * to another course, and no route to Patterns or Skills. The same rail now
 * slides in from the left behind a Menu button.
 *
 * It is the same element, restyled, not a second copy. A copy would render
 * every course's `<details name="learn-rail-course">` twice, and the browser
 * lets only one member of a named group be open, so the current course would
 * close itself in one of them. It would also run the rail's database query
 * twice and give the page two "Learn" landmarks.
 *
 * Closed, the drawer is `invisible` as well as off-screen, so its hundred-odd
 * links are out of the tab order and the accessibility tree rather than merely
 * out of sight. From lg up every drawer class is scoped away and the rail is
 * exactly what it was.
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(drawerRef, drawerOpen);
  useScrollLock(drawerOpen);

  useEffect(() => {
    if (!drawerOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setDrawerOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);

    // Open on the reader's place, not at the top of a nine-course list. The
    // rail's own reveal only runs on page load, while the drawer is closed.
    const drawer = drawerRef.current;
    const current = drawer?.querySelector<HTMLElement>('[aria-current="page"]');
    if (drawer && current) {
      const delta =
        current.getBoundingClientRect().top -
        drawer.getBoundingClientRect().top -
        drawer.clientHeight / 2;
      drawer.scrollTop = Math.max(0, drawer.scrollTop + delta);
    }

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  // Moving between lessons keeps this shell mounted, so the drawer would stay
  // open over the page the reader just asked for. Closing on any link tap
  // covers every route change the rail can start, without the shell needing to
  // know the rail's structure.
  function closeOnLinkTap(event: React.MouseEvent) {
    if (drawerOpen && (event.target as HTMLElement).closest('a')) {
      setDrawerOpen(false);
    }
  }

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
            // The reading measure widens with the rail.
            //
            // Typographic orthodoxy says hold a fixed measure and let the slack
            // fall where it may. On this layout that put a 400px empty gutter
            // between the text and the On this page rail, and collapsing the
            // rail appeared to do nothing on a text-only screen. Collapsing is
            // an explicit request for more room, so the content takes it.
            '--lesson-measure': collapsed ? '1080px' : '820px',
          } as React.CSSProperties
        }
      >
        {/* Scrim behind the drawer. Phones only; tapping it closes. */}
        <div
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
          className={`fixed inset-0 z-overlay bg-text-primary/40 transition-opacity duration-base ease-out-expo motion-reduce:transition-none lg:hidden ${
            drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        />

        <div
          id="learn-drawer"
          ref={drawerRef}
          onClick={closeOnLinkTap}
          role={drawerOpen ? 'dialog' : undefined}
          aria-modal={drawerOpen ? true : undefined}
          aria-label={drawerOpen ? 'Course navigation' : undefined}
          className={`group relative bg-background-rail lg:border-r lg:border-border-primary max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-modal max-lg:w-[85vw] max-lg:max-w-80 max-lg:overflow-y-auto max-lg:overscroll-contain max-lg:shadow-modal max-lg:duration-base max-lg:ease-out-expo max-lg:motion-reduce:transition-none ${
            // Visibility is only animated on the way out, so the drawer stays
            // visible while it slides away. On the way in it must flip at
            // once: an element still invisible on the first frame cannot take
            // focus, and the focus trap would miss the close button.
            drawerOpen
              ? 'max-lg:translate-x-0 max-lg:transition-[translate]'
              : 'max-lg:invisible max-lg:-translate-x-full max-lg:transition-[translate,visibility]'
          }`}
        >
          {/* First in the drawer so the focus trap lands on it. */}
          <div className="sticky top-0 z-sticky flex items-center justify-between bg-background-rail px-default pt-snug pb-tight lg:hidden">
            <span className="type-eyebrow font-semibold text-text-secondary">Menu</span>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-button text-text-secondary transition-colors hover:bg-background-secondary hover:text-text-primary"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Sticky, not absolute. Pinned to the top of a tall column the
              control scrolled away with the rail, so by the time a reader
              wanted more room for a screenshot the way to get it was several
              screens back up. Zero height keeps it out of the flow, so the
              navigation below does not shift down to make space for it. */}
          <div className="sticky top-20 z-sticky flex h-0 justify-end overflow-visible pr-2">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand course navigation' : 'Collapse course navigation'}
            title={collapsed ? 'Expand course navigation' : 'Collapse course navigation'}
            className={`rail-toggle mt-4 hidden h-7 w-7 cursor-pointer items-center justify-center rounded-button bg-background-rail text-text-secondary transition-[color,background-color,opacity] hover:bg-background-secondary hover:text-text-primary lg:flex ${
              collapsed ? 'rail-toggle-pinned' : ''
            }`}
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
          </div>

          {/* Hidden rather than unmounted, so the rail's scroll position and
              any open course group survive a collapse and expand.
              The right gutter keeps two-line lesson titles from running under
              the sticky toggle, which sits over this column. */}
          <div className={collapsed ? 'lg:hidden' : 'lg:pr-8'}>{sidebar}</div>
        </div>

        <div className="min-w-0 bg-background-primary px-6 lg:px-10">
          {/* The way into the drawer on phones. Placed where the rail would
              be, at the start of the content, rather than in the site header,
              which every page shares. */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-controls="learn-drawer"
            className="-mx-tight mt-default flex cursor-pointer items-center gap-tight rounded-button px-tight py-tight type-caption font-semibold text-text-primary transition-colors hover:bg-background-secondary lg:hidden"
          >
            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
            Menu
          </button>
          {children}
        </div>

        {aside && (
          <div className="hidden bg-background-primary pr-6 xl:block">{aside}</div>
        )}
      </div>
    </div>
  );
}
