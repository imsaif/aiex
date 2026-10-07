'use client';

import { useLayoutEffect, useEffect } from 'react';

// useLayoutEffect runs before paint, so the rail is already in the right place
// on first frame. With useEffect the rail painted at scrollTop 0 and then
// jumped, which is exactly the flicker this is meant to prevent. Falls back to
// useEffect on the server, where useLayoutEffect warns and does nothing.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Breathing room kept between a revealed row and the rail's top or bottom edge.
const EDGE = 48;

// The rail is rendered by each page, so it remounts on every lesson click and
// would start at scrollTop 0. Its position is remembered per course, so moving
// between lessons of one course keeps the rail where the reader left it.
function storageKey(): string {
  const course = window.location.pathname.match(/^\/guides\/[^/]+/);
  return `learn-rail-scroll:${course ? course[0] : window.location.pathname}`;
}

function readSaved(key: string): number | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw === null ? null : Number(raw);
  } catch {
    return null; // private mode or blocked storage
  }
}

/**
 * Keeps the current item visible in the rail without making it jump.
 *
 * The rail is pinned with its own scroll, and on a long course it is several
 * times taller than the viewport, so on a deep lesson the highlighted row
 * would start below the fold and you would have to hunt for your place.
 *
 * First arrival in a course centres the current row. After that, clicking a
 * lesson keeps the rail exactly where it was: it used to re-centre on every
 * click, so the row you had just clicked slid ~540px away from the pointer.
 * The rail only moves when the new current row would be out of view (the
 * Next button, a link from the article), and then only far enough to show it.
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
    if (!rail) return;
    const key = storageKey();
    const current = rail.querySelector<HTMLElement>('[aria-current="page"]');
    const saved = readSaved(key);

    if (current) {
      // Measured from rects, not offsetTop: the rail is position:sticky, which
      // makes it the offsetParent for its own children, so subtracting the
      // rail's own offsetTop double-counts and lands on zero.
      if (saved === null) {
        const railRect = rail.getBoundingClientRect();
        const currentRect = current.getBoundingClientRect();
        const delta =
          currentRect.top - railRect.top - rail.clientHeight / 2 + currentRect.height / 2;
        rail.scrollTop = Math.max(0, rail.scrollTop + delta);
      } else {
        rail.scrollTop = saved;
        const railRect = rail.getBoundingClientRect();
        const currentRect = current.getBoundingClientRect();
        // Move only if the row is actually cut off; a row you could see and
        // click stays put, even right at the edge. EDGE is the room left once
        // a move is needed.
        if (currentRect.top < railRect.top) {
          rail.scrollTop = Math.max(0, rail.scrollTop - (railRect.top + EDGE - currentRect.top));
        } else if (currentRect.bottom > railRect.top + rail.clientHeight) {
          rail.scrollTop += currentRect.bottom - (railRect.top + rail.clientHeight - EDGE);
        }
      }
    }

    const remember = () => {
      try {
        window.sessionStorage.setItem(key, String(rail.scrollTop));
      } catch {
        /* private mode or blocked storage */
      }
    };
    remember();
    rail.addEventListener('scroll', remember, { passive: true });
    return () => rail.removeEventListener('scroll', remember);
  }, []);

  return null;
}
