'use client';

import Link from 'next/link';
import { trackAuditEvent } from '@/lib/audit/analytics';

export default function HeroAuditCTA() {
  return (
    <div>
      <p className="text-base text-text-secondary mb-3">
        See how your AI product&apos;s UX compares to the best
      </p>
      <Link
        href="/audit"
        onClick={() => trackAuditEvent('audit_hero_cta_clicked', { source: 'homepage_below_intro' })}
        className="inline-flex items-center gap-1.5 text-base font-semibold text-accent-primary hover:text-accent-hover transition-colors"
      >
        Try the free AI UX audit
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </Link>
      <p className="mt-2 text-sm text-text-tertiary">
        Personalized UX gaps and fixes in 2 minutes. No signup required.
      </p>
    </div>
  );
}
