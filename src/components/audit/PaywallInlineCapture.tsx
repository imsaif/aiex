'use client';

import { useState, useEffect } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { trackAuditEvent } from '@/lib/audit/analytics';

interface PaywallInlineCaptureProps {
  auditCountAtTrigger?: number;
}

export function PaywallInlineCapture({ auditCountAtTrigger }: PaywallInlineCaptureProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    trackAuditEvent('audit_paywall_shown', { audit_count_at_trigger: auditCountAtTrigger });
  }, [auditCountAtTrigger]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/audit/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website_url: '' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setSuccess(true);
      trackAuditEvent('audit_paywall_waitlist_signup');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-xl text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-status-success/10 rounded-full flex items-center justify-center">
          <CheckIcon className="w-6 h-6 text-status-success" strokeWidth={2.5} />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-1.5 tracking-tight">
          You&apos;re on the list
        </h3>
        <p className="text-sm text-text-secondary">
          We&apos;ll email you the moment Early Access opens — you&apos;ll be first in line.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl">
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-background-secondary border border-border-primary text-[11px] font-medium text-text-secondary mb-4">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-primary"></span>
        </span>
        Early Access · First 50 only
      </div>

      <h3 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight leading-[1.2] mb-2">
        Be first for unlimited audits.
      </h3>
      <p className="text-sm text-text-secondary mb-5">
        Free audit used. Get notified when Early Access opens.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="website_url"
          value=""
          onChange={() => {}}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, width: 0, overflow: 'hidden' }}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="you@company.com"
            className="flex-1 px-5 py-4 rounded-full text-base sm:text-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary placeholder:text-gray-400 focus:border-accent-primary dark:focus:border-white focus:outline-none transition-colors"
            autoComplete="email"
            required
          />
          <button
            type="submit"
            disabled={isLoading || !email}
            className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-accent-primary text-white dark:text-gray-900 text-base sm:text-lg font-semibold hover:bg-accent-hover transition-all active:scale-95 cursor-pointer shadow-lg shadow-accent-primary/20 whitespace-nowrap disabled:bg-text-disabled disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Join the waitlist'
            )}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-border-error text-center" role="alert">{error}</p>
        )}

        <p className="mt-4 text-[11px] text-text-tertiary text-center leading-relaxed">
          Includes our daily AI UX newsletter. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
