'use client';

import { useState, useEffect } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { trackAuditEvent } from '@/lib/audit/analytics';
import { useAuditCount } from '@/hooks/useAuditCount';
import { UNLOCKED_AUDIT_LIMIT } from '@/lib/audit/constants';

interface PaywallInlineCaptureProps {
  auditCountAtTrigger?: number;
}

export function PaywallInlineCapture({ auditCountAtTrigger }: PaywallInlineCaptureProps) {
  const { atFinalCap, markUnlocked } = useAuditCount();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (atFinalCap) {
      trackAuditEvent('audit_final_cap_shown', { audit_count_at_trigger: auditCountAtTrigger });
    } else {
      trackAuditEvent('audit_unlock_modal_shown', { audit_count_at_trigger: auditCountAtTrigger });
    }
  }, [auditCountAtTrigger, atFinalCap]);

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
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'audit-unlock' }),
      });

      const data = await response.json();

      if (!response.ok && !/already subscribed/i.test(data.error || '')) {
        throw new Error(data.error || 'Failed to unlock');
      }

      setSuccess(true);
      trackAuditEvent('audit_unlock_submitted');
      markUnlocked();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Final cap — informational only, no form
  if (atFinalCap) {
    return (
      <div className="w-full max-w-xl text-center">
        <h3 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight leading-[1.2] mb-2">
          You&apos;ve reached the free limit
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          You&apos;ve used all {UNLOCKED_AUDIT_LIMIT} of your free audits. We&apos;re keeping this capped for now so it stays available for more designers. We&apos;ll email you when we open it up further.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-xl text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-status-success/10 rounded-full flex items-center justify-center">
          <CheckIcon className="w-6 h-6 text-status-success" strokeWidth={2.5} />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-1.5 tracking-tight">
          Unlocked
        </h3>
        <p className="text-sm text-text-secondary">
          3 more audits are ready. Upload a screenshot to continue.
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
        Unlock 3 more · Free
      </div>

      <h3 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight leading-[1.2] mb-2">
        Like what you saw? Get 3 more audits.
      </h3>
      <p className="text-sm text-text-secondary mb-5">
        Drop your email and we&apos;ll unlock 3 more free audits right now. No card, no commitment.
      </p>

      <form onSubmit={handleSubmit}>
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
              'Unlock 3 more'
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
