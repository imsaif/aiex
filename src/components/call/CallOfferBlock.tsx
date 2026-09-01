'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { CALL_OFFER, isCallOfferLive } from '@/lib/call-offer';
import { trackAuditEvent } from '@/lib/audit/analytics';

interface CallOfferBlockProps {
  /**
   * 'full' — the bordered card on a learning-path overview, placed mid-page.
   * 'compact' — a single quiet line at the foot of a lesson, so the offer is
   * present on every lesson without turning the course into an advert.
   */
  variant?: 'full' | 'compact';
  /** Which surface this instance sits on, sent with both events. */
  source: string;
  className?: string;
}

export function CallOfferBlock({ variant = 'full', source, className = '' }: CallOfferBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Fire "shown" only when the block actually enters the viewport, not on mount.
  // Placement is the whole point of this feature, so a render-time event would
  // measure the wrong thing — it would count people who never scrolled to it.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            trackAuditEvent('call_offer_shown', { source, variant });
            observer.disconnect();
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [source, variant]);

  // No payment link configured yet — render nothing rather than a dead CTA.
  if (!isCallOfferLive()) return null;

  const onClick = () => trackAuditEvent('call_offer_clicked', { source, variant });

  if (variant === 'compact') {
    return (
      <div ref={ref} className={`text-sm text-text-secondary ${className}`}>
        Stuck on your own project?{' '}
        <Link
          href="/call"
          onClick={onClick}
          className="text-accent-primary hover:text-accent-hover font-medium underline underline-offset-2 transition-colors"
        >
          Book {CALL_OFFER.durationLabel} with me for {CALL_OFFER.priceLabel}
        </Link>
        .
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`p-6 md:p-8 rounded-2xl border border-border-primary bg-surface-primary ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent-subtle text-accent-primary border border-info">
          {CALL_OFFER.priceLabel} · {CALL_OFFER.durationLabel}
        </span>
      </div>

      <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">
        Want a hand with your own project?
      </h2>

      <p className="text-text-secondary mb-6 max-w-2xl">
        The course is free and always will be. If you would rather work through your
        own project with me — your codebase, your design system, your actual
        blockers — book a session and we will do it live.
      </p>

      <Link
        href="/call"
        onClick={onClick}
        className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium bg-accent-primary text-white hover:bg-accent-hover transition-colors"
      >
        Book a session · {CALL_OFFER.priceLabel}
      </Link>
    </div>
  );
}

export default CallOfferBlock;
