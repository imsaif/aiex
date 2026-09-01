'use client';

import { useEffect } from 'react';
import { CALL_OFFER, DODO_CALL_LINK, isCallOfferLive } from '@/lib/call-offer';
import { trackAuditEvent } from '@/lib/audit/analytics';

/**
 * The pay button on /call, plus that page's instrumentation. Owning both in one
 * component keeps the two halves of the metric together: how many people reached
 * the page, and how many of those started checkout.
 *
 * Sends the buyer to the Dodo Static Payment Link. Nothing is charged, stored, or
 * validated here — see src/lib/call-offer.ts for why.
 */
export function CallCheckout() {
  useEffect(() => {
    trackAuditEvent('call_page_viewed');
  }, []);

  if (!isCallOfferLive()) {
    return (
      <p className="text-text-secondary">
        Booking is not open right now. Check back shortly.
      </p>
    );
  }

  return (
    <div>
      <a
        href={DODO_CALL_LINK}
        onClick={() => trackAuditEvent('call_checkout_clicked')}
        className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-medium text-lg bg-accent-primary text-white hover:bg-accent-hover transition-colors"
      >
        Pay {CALL_OFFER.priceLabel} and pick a time
      </a>
      <p className="mt-4 text-sm text-text-secondary">
        You will choose your slot straight after paying.
      </p>
    </div>
  );
}

export default CallCheckout;
