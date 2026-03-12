'use client';

import { useState, useEffect } from 'react';
import type { NewsletterSource } from '@/types/newsletter';

interface InlineNewsletterSignupProps {
  variant?: 'hero' | 'footer' | 'pattern-detail' | 'news';
  className?: string;
  customHeading?: string;
  customSubheading?: string;
  customButtonText?: string;
  customSuccessMessage?: string;
  stacked?: boolean;
  source?: NewsletterSource;
  /** Use when component is placed on a dark background */
  darkBackground?: boolean;
}

export function InlineNewsletterSignup({
  variant = 'hero',
  className = '',
  customHeading,
  customSubheading,
  customButtonText,
  customSuccessMessage,
  stacked = false,
  source = 'handbook',
  darkBackground = false,
}: InlineNewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isHidden, setIsHidden] = useState(false);

  // Check localStorage on mount to hide if already subscribed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSubscribed = localStorage.getItem('newsletter_subscribed') === 'true';
      setIsHidden(hasSubscribed);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source,
          website_url: '',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setEmail('');
        // Set localStorage to hide component on future page loads
        if (typeof window !== 'undefined') {
          localStorage.setItem('newsletter_subscribed', 'true');
        }
        // Reset to idle after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || data.message || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  const isHero = variant === 'hero';
  const isPatternDetail = variant === 'pattern-detail';
  const isNews = variant === 'news';

  // Hide component if user has already subscribed
  if (isHidden) {
    return null;
  }

  return (
    <div className={className}>
      {status === 'success' ? (
        <div
          className={`text-center animate-fade-in ${isHero ? 'py-6' : 'py-4'}`}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent-subtle border border-success rounded-full">
            <svg className="w-5 h-5 text-border-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-text-primary">
              {customSuccessMessage || 'Success! Check your email for the checklist PDF 🎉'}
            </span>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full"
        >
          {/* Custom Heading */}
          {(isPatternDetail || isNews) && customHeading && (
            <h3 className={`font-semibold text-text-primary mb-2 ${isNews ? 'text-lg' : 'text-2xl text-center'}`}>
              {customHeading}
            </h3>
          )}

          {/* Value Proposition / Subheading */}
          {(isHero || ((isPatternDetail || isNews) && customSubheading)) && (
            <p className={`text-text-secondary mb-4 font-medium ${isNews ? 'text-sm' : 'text-base text-center'}`}>
              {customSubheading || 'Score your AI interface against 28 proven UX patterns'}
            </p>
          )}

          {/* Honeypot - hidden from real users */}
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

          {/* Input Group */}
          <div className={`flex ${stacked ? 'flex-col' : 'flex-col sm:flex-row'} gap-3 ${isHero || isPatternDetail ? 'max-w-lg mx-auto' : ''}`}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={status === 'loading'}
              className={`
                flex-1 px-5 py-4 rounded-full
                ${darkBackground
                  ? 'border-2 border-gray-600 bg-gray-800 text-white placeholder:text-gray-500 focus:border-white'
                  : 'border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary placeholder:text-gray-400 focus:border-accent-primary dark:focus:border-white'
                }
                focus:outline-none
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
                ${isHero ? 'text-lg' : isPatternDetail ? 'text-base' : 'text-sm'}
              `}
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`
                px-8 py-4 rounded-full font-semibold
                ${darkBackground
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-accent-primary dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                cursor-pointer
                transition-all duration-200
                hover:scale-[1.02] active:scale-[0.98]
                whitespace-nowrap shadow-lg
                ${isHero ? 'text-lg' : isPatternDetail ? 'text-base' : 'text-sm'}
              `}
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Subscribing...
                </span>
              ) : (
                customButtonText || 'Get the Checklist →'
              )}
            </button>
          </div>

          {/* Error Message */}
          {status === 'error' && errorMessage && (
            <p className="text-sm text-border-error mt-2 text-center animate-fade-in">
              {errorMessage}
            </p>
          )}

          {/* Trust Badge */}
          {(isHero || isPatternDetail || isNews) && (
            <p className={`text-xs mt-4 ${isNews ? '' : 'text-center'} ${darkBackground ? 'text-gray-400' : 'text-text-secondary'}`}>
              One-page PDF for design reviews + weekly AI/UX analysis. Unsubscribe anytime.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
