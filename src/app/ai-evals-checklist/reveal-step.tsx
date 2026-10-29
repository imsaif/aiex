'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * One step of the checklist timeline that fades and rises into place the first
 * time it scrolls into view, while its segment of the connecting line draws
 * down to the next step.
 *
 * Visible by default: the server HTML and no-JS readers get every step, and so
 * does anyone with prefers-reduced-motion. Only a step that is still below the
 * fold when the page hydrates is hidden, then revealed on intersection, so
 * nothing on screen ever blinks out. The page title is outside this component
 * and never animates (LCP rule in performance.md).
 */
export function RevealStep({
  id,
  className,
  innerClassName,
  last,
  marker,
  children,
}: {
  id: string;
  className: string;
  /** Layout for the step's content (the grid), applied inside the fading wrapper. */
  innerClassName: string;
  last: boolean;
  /** The step's icon circle. Rendered outside the moving wrapper: a transform on
   *  an ancestor would make it the circle's containing block and pull the
   *  absolutely-positioned circle on top of the text. */
  marker: React.ReactNode;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const [state, setState] = useState<'static' | 'waiting' | 'shown'>('static');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return; // already on screen
    setState('waiting');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('shown');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -15% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden = state === 'waiting';
  return (
    <li ref={ref} id={id} className={className}>
      {!last && (
        <span
          aria-hidden
          className={`absolute left-4 top-10 bottom-0 w-px origin-top bg-border-secondary transition-transform duration-500 ease-out md:left-5 md:top-12 ${
            hidden ? 'scale-y-0' : 'scale-y-100'
          }`}
        />
      )}
      <div className={`transition-opacity duration-300 ease-out ${hidden ? 'opacity-0' : 'opacity-100'}`}>{marker}</div>
      <div
        className={`${innerClassName} transition-[opacity,transform] duration-300 ease-out ${
          hidden ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {children}
      </div>
    </li>
  );
}
