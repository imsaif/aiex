'use client';

import { useState, useEffect, useCallback } from 'react';
import { XMarkIcon, CheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { trackAuditEvent } from '@/lib/audit/analytics';

interface PaywallModalProps {
  onClose: () => void;
}

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    description: '3 lifetime audits',
    features: ['AI UX pattern scoring', 'Top gaps & quick wins', 'Chat follow-up (5 messages)'],
    current: true,
  },
  {
    name: 'Early Access Pro',
    price: '$9',
    period: '/mo',
    description: 'First 50 only — locks in before $19',
    features: ['Unlimited audits', 'Priority analysis', 'Full chat history', 'Email reports'],
    highlight: true,
  },
  {
    name: 'Individual Pro',
    price: '$19',
    period: '/mo',
    description: 'After early access fills',
    features: ['Everything in Early Access', 'Team sharing (coming soon)', 'Custom pattern library'],
    highlight: false,
  },
];

export function PaywallModal({ onClose }: PaywallModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    trackAuditEvent('audit_paywall_shown');
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

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

      // Also subscribe to newsletter with waitlist tag (fire-and-forget)
      fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'audit-waitlist', website_url: '' }),
      }).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative w-full max-w-4xl bg-background-primary rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-text-tertiary hover:text-text-primary hover:bg-background-secondary rounded-lg transition-colors z-10"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10">
              {success ? (
                /* Success State */
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-status-success/10 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-8 h-8 text-status-success" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    You&apos;re on the list!
                  </h2>
                  <p className="text-text-secondary mb-6">
                    We&apos;ll email you the moment Early Access opens — you&apos;ll be first in line.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-accent-primary text-white dark:text-gray-900 rounded-xl font-medium hover:bg-accent-hover transition-colors"
                  >
                    Got it
                  </button>
                </div>
              ) : (
                /* Paywall Content */
                <>
                  {/* Header */}
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-warning/10 text-status-warning text-sm font-medium mb-4">
                      <SparklesIcon className="w-4 h-4" />
                      Free audits used
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                      You&apos;ve used your 3 free audits
                    </h2>
                    <p className="text-text-secondary">
                      Unlimited audits are coming soon. Join the early access list to lock in the lowest price.
                    </p>
                  </div>

                  {/* Pricing Tiers */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                    {TIERS.map((tier) => (
                      <div
                        key={tier.name}
                        className={`rounded-xl p-5 border ${
                          tier.highlight
                            ? 'border-accent-primary bg-accent-subtle ring-1 ring-accent-primary'
                            : tier.current
                            ? 'border-border-primary bg-background-secondary opacity-60'
                            : 'border-border-primary bg-background-secondary'
                        }`}
                      >
                        {tier.highlight && (
                          <span className="text-xs font-semibold text-accent-primary uppercase tracking-wide">
                            Most Popular
                          </span>
                        )}
                        {tier.current && (
                          <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                            Current Plan
                          </span>
                        )}
                        <div className="mt-2 mb-4">
                          <span className="text-3xl font-bold text-text-primary">{tier.price}</span>
                          <span className="text-text-secondary text-sm">{tier.period}</span>
                        </div>
                        <p className="text-sm text-text-secondary mb-4">{tier.description}</p>
                        <ul className="space-y-2">
                          {tier.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                              <CheckIcon className="w-4 h-4 text-status-success mt-0.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Email Capture */}
                  <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    {/* Honeypot */}
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

                    <div className="flex gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="flex-1 px-4 py-3 bg-background-secondary border border-border-primary rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
                        required
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={isLoading || !email}
                        className="px-5 py-3 bg-accent-primary text-white dark:text-gray-900 rounded-xl font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                      >
                        {isLoading ? (
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          'Join Early Access List →'
                        )}
                      </button>
                    </div>

                    {error && (
                      <p className="mt-2 text-sm text-status-error">{error}</p>
                    )}

                    <p className="mt-3 text-xs text-text-tertiary text-center">
                      No credit card required. We&apos;ll notify you when early access opens. You&apos;ll also receive daily AI UX news.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
