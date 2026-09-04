'use client';

import { useLayoutEffect, useEffect } from 'react';

// useLayoutEffect runs before paint, so the rail is already in the right place
// on first frame. With useEffect the rail painted at scrollTop 0 and then
// jumped, which is exactly the flicker this is meant to prevent. Falls back to
// useEffect on the server, where useLayoutEffect warns and does nothing.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Scrolls the rail so the current item is visible.
 *
 * The rail is pinned with its own scroll, and on a long course it is several
 * times taller than the viewport — so on a deep lesson the highlighted row
 * would start below the fold and you would have to hunt for your place.
 *
 * Deliberately data-free: it reads the DOM for `[aria-current="page"]` and
 * imports nothing. The rail's server components pull in the guide and pattern
 * registries, and a client component anywhere in that tree would ship them to
 * the browser — see the header of `src/lib/learn-map.ts`. This one is safe
 * precisely because it knows nothing.
 *
 * Scrolls the container directly rather than calling scrollIntoView, which
 * would also move the page and undo the "start at the top of the article"
 * behaviour people expect when opening a lesson.
 */
export default function RailRevealCurrent() {
  useIsomorphicLayoutEffect(() => {
    const rail = document.querySelector<HTMLElement>('nav[aria-label="Learn"]');
    const current = rail?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!rail || !current) return;

    // Measured from rects, not offsetTop: the rail is position:sticky, which
    // makes it the offsetParent for its own children, so subtracting the
    // rail's own offsetTop double-counts and lands on zero.
    const railRect = rail.getBoundingClientRect();
    const currentRect = current.getBoundingClientRect();
    const delta =
      currentRect.top - railRect.top - rail.clientHeight / 2 + currentRect.height / 2;

    rail.scrollTop = Math.max(0, rail.scrollTop + delta);
  }, []);

  return null;
}
