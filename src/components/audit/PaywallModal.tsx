'use client';

import { useState, useEffect, useCallback } from 'react';
import { XMarkIcon, CheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { trackAuditEvent } from '@/lib/audit/analytics';
import { UNLOCKED_AUDIT_LIMIT } from '@/lib/audit/constants';

interface PaywallModalProps {
  onClose: () => void;
  mode: 'unlock' | 'final';
  auditCountAtTrigger?: number;
  onUnlocked?: () => void;
}

const UNLOCK_BENEFITS = [
  '3 more audits — score AI surfaces against 36 patterns',
  'Upload up to 2 screenshots per audit',
  'Daily AI UX newsletter (unsubscribe anytime)',
];

export function PaywallModal({ onClose, mode, auditCountAtTrigger, onUnlocked }: PaywallModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (mode === 'unlock') {
      trackAuditEvent('audit_unlock_modal_shown', { audit_count_at_trigger: auditCountAtTrigger });
    } else {
      trackAuditEvent('audit_final_cap_shown', { audit_count_at_trigger: auditCountAtTrigger });
    }
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [auditCountAtTrigger, mode]);

  const handleDismiss = useCallback(() => {
    if (mode === 'unlock' && !success) {
      trackAuditEvent('audit_unlock_dismissed');
    }
    onClose();
  }, [success, onClose, mode]);

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
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'audit-unlock' }),
      });

      const data = await response.json();

      // Treat "already subscribed" as success — they get the unlock either way.
      if (!response.ok && !/already subscribed/i.test(data.error || '')) {
        throw new Error(data.error || 'Failed to unlock');
      }

      setSuccess(true);
      trackAuditEvent('audit_unlock_submitted');
      onUnlocked?.();
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

            {/* Final cap — informational, no email field */}
            {mode === 'final' && (
              <div className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-5 bg-accent-primary/10 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-accent-primary" strokeWidth={2} />
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-2 tracking-tight">
                  You&apos;ve reached the free limit
                </h2>
                <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                  You&apos;ve used all {UNLOCKED_AUDIT_LIMIT} of your free audits. We&apos;re keeping the free tool capped for now so it stays available for more designers exploring it. Want a deeper review of your whole product?
                </p>
                <a
                  href="/services?from=post-audit-cta"
                  onClick={() => trackAuditEvent('service_cta_clicked', { source: 'paywall_final_cap' })}
                  className="inline-block px-5 py-2.5 bg-accent-primary text-white rounded-xl font-medium hover:bg-accent-hover transition-colors"
                >
                  Get your product audited
                </a>
                <button
                  onClick={onClose}
                  className="block mx-auto mt-4 text-sm text-text-tertiary hover:text-text-primary transition-colors"
                >
                  No thanks
                </button>
              </div>
            )}

            {/* Unlock — email capture for 3 more audits */}
            {mode === 'unlock' && success && (
              <div className="p-10 text-center">
                <div className="w-12 h-12 mx-auto mb-5 bg-status-success/10 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-6 h-6 text-status-success" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-2 tracking-tight">
                  Unlocked
                </h2>
                <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                  3 more audits are ready. Upload a new screenshot whenever you&apos;re ready.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-accent-primary text-white rounded-xl font-medium hover:bg-accent-hover transition-colors"
                >
                  Continue
                </button>
              </div>
            )}

            {mode === 'unlock' && !success && (
              <div className="p-8">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-background-secondary border border-border-primary text-[11px] font-medium text-text-secondary mb-5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-primary"></span>
                  </span>
                  Free · No card needed
                </div>

                <h2 className="text-[22px] font-semibold text-text-primary tracking-tight leading-[1.2] mb-2">
                  Get 3 more audits, free.
                </h2>
                <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                  Add your email and we&apos;ll unlock them right away.
                </p>

                <form onSubmit={handleSubmit} className="mb-5">
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
                      'Unlock audits'
                    )}
                  </button>

                  {error && (
                    <p className="mt-2 text-sm text-status-error">{error}</p>
                  )}
                </form>

                <ul className="space-y-2 pt-5 border-t border-border-divider">
                  {UNLOCK_BENEFITS.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-[13px] text-text-secondary leading-relaxed">
                      <span className="mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded-full bg-accent-primary/10 flex items-center justify-center">
                        <CheckIcon className="w-2 h-2 text-accent-primary" strokeWidth={3} />
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
