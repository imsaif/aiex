'use client';

import Link from 'next/link';
import { trackAuditEvent } from '@/lib/audit/analytics';

export default function HeroAuditCTA() {
  return (
    <div>
      <p className="text-lg text-text-secondary mb-5">
        See how your AI product&apos;s UX compares to the best
      </p>
      <Link
        href="/audit"
        onClick={() => trackAuditEvent('audit_hero_cta_clicked', { source: 'homepage_hero' })}
        className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary text-white dark:text-gray-900 rounded-full text-lg font-semibold hover:bg-accent-hover transition-all active:scale-95 shadow-[0_4px_20px_rgba(22,32,54,0.35)] hover:shadow-[0_6px_28px_rgba(22,32,54,0.5)]"
      >
        Audit Your Interface Free
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </Link>
      <p className="mt-4 text-sm text-text-tertiary">
        Personalized UX gaps and fixes in 2 minutes. No signup required.
      </p>
    </div>
  );
}
