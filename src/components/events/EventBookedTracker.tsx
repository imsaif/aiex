'use client';

import { useEffect } from 'react';
import { trackAuditEvent } from '@/lib/audit/analytics';

/**
 * Fires once on /events/[slug]/booked, which is reached only via the Dodo
 * redirect. The gap between event_checkout_clicked and this is people who
 * started booking and did not finish.
 */
export function EventBookedTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackAuditEvent('event_booked_page_viewed', { slug });
  }, [slug]);
  return null;
}

export default EventBookedTracker;
