'use client';

import { useEffect } from 'react';
import { CAL_BOOKING_URL } from '@/lib/call-offer';
import { trackAuditEvent } from '@/lib/audit/analytics';

/**
 * The Cal.com booking calendar, shown immediately after payment.
 *
 * A plain iframe rather than Cal.com's embed script: it adds no dependency and
 * no third-party JS to the page, and the booking page is the one place where a
 * script failing to load would cost real money — the buyer has already paid.
 *
 * Firing call_booking_page_viewed here is how the paid-but-never-booked gap
 * becomes visible: compare this count against call_checkout_clicked.
 */
export function BookingEmbed() {
  useEffect(() => {
    trackAuditEvent('call_booking_page_viewed');
  }, []);

  if (!CAL_BOOKING_URL) {
    return (
      <div className="p-6 rounded-2xl border border-border-primary bg-surface-primary text-center">
        <p className="text-text-primary font-medium mb-2">
          Your payment went through.
        </p>
        <p className="text-text-secondary">
          The booking calendar is not connected yet. Email me and I will send you
          times directly.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border-primary overflow-hidden bg-surface-primary">
      <iframe
        src={CAL_BOOKING_URL}
        title="Pick a time for your session"
        className="w-full"
        style={{ height: 'min(80vh, 900px)', border: 'none' }}
        loading="lazy"
      />
    </div>
  );
}

export default BookingEmbed;
