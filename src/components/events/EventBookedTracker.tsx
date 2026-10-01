'use client';

import { useEffect } from 'react';
import { trackAuditEvent } from '@/lib/audit/analytics';
import { rememberBooking } from '@/components/events/useEventBooking';

/**
 * Runs once on /events/[slug]/booked, which is reached via the Dodo redirect.
 *
 * - Analytics: the gap between event_checkout_clicked and this is people who
 *   started booking and did not finish.
 * - Remembers the booking in this browser when Dodo's redirect says the payment
 *   succeeded (`?payment_id=...&status=succeeded`), so the event page shows
 *   "You're booked" on return.
 * - Strips Dodo's query string, which includes the buyer's email, from the
 *   address bar so it does not linger in history or get shared by accident.
 */
export function EventBookedTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackAuditEvent('event_booked_page_viewed', { slug });
    const url = new URL(window.location.href);
    const paymentId = url.searchParams.get('payment_id');
    if (paymentId && url.searchParams.get('status') === 'succeeded') {
      rememberBooking(slug, paymentId);
    }
    if (url.search) window.history.replaceState(null, '', url.pathname + url.hash);
  }, [slug]);
  return null;
}

export default EventBookedTracker;
