'use client';

import Link from 'next/link';
import { trackAuditEvent } from '@/lib/audit/analytics';

export default function HeroAuditCTA() {
  return (
    <Link
      href="/audit"
      onClick={() => trackAuditEvent('audit_hero_cta_clicked', { source: 'homepage_below_intro' })}
      className="group flex items-center gap-4 sm:gap-5 w-full text-left bg-surface-primary border border-border-primary rounded-2xl px-5 py-4 sm:px-6 sm:py-5 hover:border-accent-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
    >
      <div
        aria-hidden="true"
        className="relative shrink-0 w-12 h-12 rounded-xl bg-surface-secondary border border-border-primary overflow-hidden"
      >
        <svg
          viewBox="0 0 48 48"
          width="48"
          height="48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-text-tertiary"
        >
          <rect x="10" y="10" width="28" height="28" rx="4" />
          <line x1="15" y1="19" x2="33" y2="19" opacity="0.55" />
          <line x1="15" y1="24" x2="28" y2="24" opacity="0.45" />
          <line x1="15" y1="29" x2="31" y2="29" opacity="0.35" />
        </svg>
        <div
          className="absolute left-2.5 right-2.5 h-px bg-accent-primary motion-safe:animate-[scan_2.5s_ease-in-out_infinite_alternate]"
          style={{ top: '25%', boxShadow: '0 0 8px currentColor', color: 'var(--accent-primary)' }}
        />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-primary motion-safe:animate-pulse" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
        <p className="text-base sm:text-lg font-semibold text-text-primary whitespace-nowrap">
          Try the free AI UX audit
        </p>
        <p className="text-sm text-text-secondary truncate">
          See how your AI product&apos;s UX compares. Personalized fixes in 2 minutes, no signup.
        </p>
      </div>

      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-accent-primary transition-transform group-hover:translate-x-0.5"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>

      <style jsx>{`
        @keyframes scan {
          0% {
            top: 22%;
          }
          100% {
            top: 70%;
          }
        }
      `}</style>
    </Link>
  );
}
