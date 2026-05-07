'use client';

import Link from 'next/link';
import { trackAuditEvent } from '@/lib/audit/analytics';

/**
 * Primary audit CTA in the homepage hero (Stage A reposition, May 2026).
 * Tracks clicks with `source: 'homepage_hero'` so the analytics signal is
 * distinct from the old below-the-fold banner (`source: 'homepage_below_intro'`).
 */
export default function HeroAuditButton() {
  return (
    <Link
      href="/audit"
      onClick={() =>
        trackAuditEvent('audit_hero_cta_clicked', { source: 'homepage_hero' })
      }
      className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-semibold bg-accent-primary text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg whitespace-nowrap"
    >
      Start your audit
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform group-hover:translate-x-0.5"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </Link>
  );
}
