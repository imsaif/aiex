'use client';

import { useState, useEffect, useCallback } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { trackAuditEvent } from '@/lib/audit/analytics';

interface PaywallModalProps {
  onClose: () => void;
  auditCountAtTrigger?: number;
}

const BENEFITS = [
  'Unlimited audits across every project',
  'Priority analysis with full chat history',
  'Email reports for you and your team',
];

export function PaywallModal({ onClose, auditCountAtTrigger }: PaywallModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    trackAuditEvent('audit_paywall_shown', { audit_count_at_trigger: auditCountAtTrigger });
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [auditCountAtTrigger]);

  const handleDismiss = useCallback(() => {
    if (!success) trackAuditEvent('audit_paywall_dismissed');
    onClose();
  }, [success, onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') handleDismiss();
  }, [handleDismiss]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-text-primary/70 backdrop-blur-md" onClick={handleDismiss} />

      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative w-full max-w-md bg-background-primary rounded-2xl border border-border-primary shadow-[0_24px_60px_-12px_rgba(22,32,54,0.25)] animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-px bg-gradient-to-r from-transparent via-accent-primary/40 to-transparent" />

            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-1.5 text-text-tertiary hover:text-text-primary rounded-lg transition-colors z-10"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            {success ? (
              <div className="p-10 text-center">
                <div className="w-12 h-12 mx-auto mb-5 bg-status-success/10 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-6 h-6 text-status-success" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-2 tracking-tight">
                  You&apos;re on the list
                </h2>
                <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                  We&apos;ll email you the moment Early Access opens — you&apos;ll be first in line.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-medium hover:bg-accent-hover transition-colors"
                >
                  Got it
                </button>
              </div>
            ) : (
              <div className="p-8">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-background-secondary border border-border-primary text-[11px] font-medium text-text-secondary mb-5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-primary"></span>
                  </span>
                  Early Access · First 50 only
                </div>

                <h2 className="text-[22px] font-semibold text-text-primary tracking-tight leading-[1.2] mb-2">
                  Be first in line for unlimited audits.
                </h2>
                <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                  Drop your email and we&apos;ll let you know the moment Early Access opens.
                </p>

                <form onSubmit={handleSubmit} className="mb-5">
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

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3.5 bg-background-primary border border-border-secondary rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all mb-2.5 text-[15px]"
                    required
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full px-5 py-3.5 bg-accent-primary text-white rounded-xl font-medium hover:bg-accent-hover disabled:bg-text-disabled disabled:cursor-not-allowed transition-colors flex items-center justify-center text-[15px] shadow-sm"
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

                  {error && (
                    <p className="mt-2 text-sm text-status-error">{error}</p>
                  )}
                </form>

                <ul className="space-y-2 pt-5 border-t border-border-divider">
                  {BENEFITS.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-[13px] text-text-secondary leading-relaxed">
                      <span className="mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded-full bg-accent-primary/10 flex items-center justify-center">
                        <CheckIcon className="w-2 h-2 text-accent-primary" strokeWidth={3} />
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <p className="mt-5 text-[11px] text-text-tertiary text-center leading-relaxed">
                  By joining, you&apos;ll also get our daily AI UX newsletter. Unsubscribe anytime.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
