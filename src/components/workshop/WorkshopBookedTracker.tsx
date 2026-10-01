'use client';

import { useEffect } from 'react';
import { trackAuditEvent } from '@/lib/audit/analytics';

/**
 * Fires once on /workshop/booked, which is reached only via the Dodo redirect.
 * The gap between workshop_checkout_clicked and this is people who started
 * checkout and did not pay.
 */
export function WorkshopBookedTracker() {
  useEffect(() => {
    trackAuditEvent('workshop_booked_page_viewed');
  }, []);
  return null;
}

export default WorkshopBookedTracker;
