'use client';

import { useEffect } from 'react';
import { rememberBooking } from '@/components/events/useEventBooking';

/**
 * Picks up `?booking=<token>` from the "View your booking" link in the
 * confirmation email, checks it with the server, remembers the booking in this
 * browser, then removes the token from the address bar.
 */
export function BookingLinkCatcher({ slug }: { slug: string }) {
  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('booking');
    if (!token) return;
    url.searchParams.delete('booking');
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    fetch(`/api/events/booking?slug=${encodeURIComponent(slug)}&token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((res: { booked?: boolean; paymentId?: string }) => {
        if (res.booked && res.paymentId) rememberBooking(slug, res.paymentId);
      })
      .catch(() => {});
  }, [slug]);
  return null;
}

export default BookingLinkCatcher;
