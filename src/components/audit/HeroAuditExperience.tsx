'use client';

import { useState } from 'react';
import LazyLogoCarousel from '@/components/ui/LazyLogoCarousel';
import { companyLogos } from '@/data/company-logos';
import AuditClient from '@/app/audit/audit-client';
import { trackAuditEvent } from '@/lib/audit/analytics';

type Mode = 'marketing' | 'tool';

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export default function HeroAuditExperience() {
  const [mode, setMode] = useState<Mode>('marketing');
  const [email, setEmail] = useState('');
  const [optIn, setOptIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    if (optIn && (!email || !isValidEmail(email))) {
      setError('Enter a valid email to receive updates');
      return;
    }
    setError(null);
    trackAuditEvent('audit_hero_cta_clicked', { source: 'homepage_hero' });

    if (optIn && email && isValidEmail(email)) {
      // Fire-and-forget — transition shouldn't wait on the network.
      fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage-hero', website_url: '' }),
      }).catch(() => {});
    }

    setMode('tool');
  };

  if (mode === 'tool') {
    return (
      <div>
        <div className="bg-[#F0F1F5] dark:bg-[#162036] pt-4 sm:pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setMode('marketing')}
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back
            </button>
          </div>
        </div>
        <AuditClient initialStep="screenshot" showSocialProof={false} />
      </div>
    );
  }

  return (
    <section className="pt-16 md:pt-20 pb-16 md:pb-20 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            style={{ color: 'var(--text-hero)', textWrap: 'balance', wordSpacing: '0.01em', letterSpacing: '0.01em' }}
          >
            Free AIUX audit scored against 36 patterns
          </h1>

          <p className="text-2xl md:text-3xl text-text-secondary mb-12">
            How the world&apos;s best AI products design their experiences, documented, analyzed, and continuously updated.
          </p>

          <div className="mb-10">
            <p className="text-[9px] font-bold text-text-secondary uppercase tracking-tight mb-4">
              Patterns used by leading companies
            </p>
            <LazyLogoCarousel companies={companyLogos} size="sm" gap="lg" />
          </div>

          <form
            className="w-full max-w-xl mx-auto animate-fade-in"
            onSubmit={(e) => {
              e.preventDefault();
              handleStart();
            }}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="your@email.com"
                className="flex-1 px-5 py-4 rounded-full text-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary placeholder:text-gray-400 focus:border-accent-primary dark:focus:border-white focus:outline-none transition-colors"
                autoComplete="email"
              />
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-semibold bg-accent-primary text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg whitespace-nowrap cursor-pointer"
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
              </button>
            </div>

            <label className="flex items-center justify-center gap-2 mt-4 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={optIn}
                onChange={(e) => {
                  setOptIn(e.target.checked);
                  if (error) setError(null);
                }}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-accent-primary focus:ring-accent-primary cursor-pointer"
              />
              <span className="text-sm text-text-secondary">
                Email me daily AIUX product news and pattern updates
              </span>
            </label>

            {error && (
              <p className="text-sm text-border-error mt-2" role="alert">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
