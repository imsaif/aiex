'use client';

import { useEffect } from 'react';
import { WORKSHOP, DODO_WORKSHOP_LINK, isWorkshopLive } from '@/lib/workshop-offer';
import { trackAuditEvent } from '@/lib/audit/analytics';

/**
 * The pay button on /workshop, plus that page's instrumentation, kept together
 * so the two halves of the metric live in one place: how many people reached
 * the page, and how many of those started checkout.
 */
export function WorkshopCheckout() {
  useEffect(() => {
    trackAuditEvent('workshop_page_viewed');
  }, []);

  if (!isWorkshopLive()) {
    return (
      <p className="text-text-secondary">
        The next date is not open yet. Check back shortly.
      </p>
    );
  }

  return (
    <div>
      <a
        href={DODO_WORKSHOP_LINK}
        onClick={() => trackAuditEvent('workshop_checkout_clicked')}
        className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-medium text-lg bg-accent-primary text-white hover:bg-accent-hover transition-colors"
      >
        Pay {WORKSHOP.priceLabel} and hold your seat
      </a>
      <p className="mt-4 text-sm text-text-secondary">
        Paying is the only way in. There is no waiting list.
      </p>
    </div>
  );
}

export default WorkshopCheckout;
