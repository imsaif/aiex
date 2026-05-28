import { useEffect, RefObject } from 'react';

/**
 * Fire `handler` when a pointer/touch event lands outside the referenced
 * element. Used by Dialog backdrop dismissal and floating-menu autoclose.
 *
 * Guards against the same click that opened the element by attaching on
 * the next tick.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  active: boolean = true
): void {
  useEffect(() => {
    if (!active) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler(event);
    };

    // Defer one tick so the opener click doesn't immediately close.
    const timeout = setTimeout(() => {
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
    }, 0);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, active]);
}
