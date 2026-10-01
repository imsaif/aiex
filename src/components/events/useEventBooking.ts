'use client';

import { useEffect, useState } from 'react';

/**
 * Whether this browser has booked an event. Remembered in localStorage under
 * `event-booked:<slug>` (value: the Dodo payment id), set either by the
 * confirmation page after a successful payment or by a verified "View your
 * booking" link. Only changes what this visitor sees; it grants nothing.
 */

const KEY = (slug: string) => `event-booked:${slug}`;
const CHANGED = 'event-booking-changed';

export function rememberBooking(slug: string, paymentId: string) {
  try {
    window.localStorage.setItem(KEY(slug), paymentId);
  } catch {
    // Private mode or blocked storage: the page simply will not remember.
  }
  window.dispatchEvent(new Event(CHANGED));
}

function readBooking(slug: string): boolean {
  try {
    return Boolean(window.localStorage.getItem(KEY(slug)));
  } catch {
    return false;
  }
}

export function useEventBooking(slug: string): boolean {
  // Starts false so server and first client render match; corrected after mount.
  const [booked, setBooked] = useState(false);
  useEffect(() => {
    const sync = () => setBooked(readBooking(slug));
    sync();
    window.addEventListener(CHANGED, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGED, sync);
      window.removeEventListener('storage', sync);
    };
  }, [slug]);
  return booked;
}
