'use client';

import { useEffect } from 'react';
import { trackAuditEvent } from '@/lib/audit/analytics';

interface Props {
  slug: string;
  open: boolean;
  priceLabel: string;
  seats?: number;
  paymentLink: string;
  calendarUrl: string;
}

/**
 * The registration card, plus the page's instrumentation, kept together so the
 * two halves of the metric live in one place: how many people reached the page,
 * and how many of those started checkout.
 */
export function EventRegistration({ slug, open, priceLabel, seats, paymentLink, calendarUrl }: Props) {
  useEffect(() => {
    trackAuditEvent('event_page_viewed', { slug });
  }, [slug]);

  return (
    <div className="rounded-2xl border border-border-primary bg-surface-primary overflow-hidden">
      <div className="px-5 py-3 text-sm font-medium text-text-secondary bg-background-secondary border-b border-border-primary">
        Book your seat
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-2xl font-bold text-text-primary">
            {priceLabel} <span className="text-base font-normal text-text-secondary">per seat</span>
          </span>
          {seats ? <span className="text-sm text-text-secondary">Limited to {seats}</span> : null}
        </div>
        <p className="text-sm text-text-secondary mb-5">
          {open
            ? 'Includes the live session and help getting Claude Code set up before the day.'
            : 'Booking opens soon. Check back shortly.'}
        </p>

        {open && (
          <a
            href={paymentLink}
            onClick={() => trackAuditEvent('event_checkout_clicked', { slug })}
            className="flex w-full items-center justify-center px-6 py-3.5 rounded-xl font-medium bg-accent-primary text-text-on-accent hover:bg-accent-hover transition-colors"
          >
            Book your seat
          </a>
        )}

        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center px-6 py-3 rounded-xl text-sm font-medium border border-border-primary text-text-primary hover:bg-background-secondary transition-colors"
        >
          Add to Google Calendar
        </a>
      </div>
    </div>
  );
}

export default EventRegistration;
