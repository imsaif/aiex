'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InlineNewsletterSignupProps {
  variant?: 'hero' | 'footer' | 'pattern-detail';
  className?: string;
  customHeading?: string;
  customSubheading?: string;
}

export function InlineNewsletterSignup({
  variant = 'hero',
  className = '',
  customHeading,
  customSubheading
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
          source: 'handbook' // Send handbook PDF + subscribe to newsletter
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
        setErrorMessage(data.message || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  const isHero = variant === 'hero';
  const isPatternDetail = variant === 'pattern-detail';

  // Hide component if user has already subscribed
  if (isHidden) {
    return null;
  }

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-center ${isHero ? 'py-6' : 'py-4'}`}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium text-green-900 dark:text-green-100">
                Success! Check your email for the handbook PDF 🎉
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="w-full"
          >
            {/* Custom Heading for Pattern Detail */}
            {isPatternDetail && customHeading && (
              <h3 className="text-2xl font-semibold text-text-primary mb-2 text-center">
                {customHeading}
              </h3>
            )}

            {/* Value Proposition / Subheading */}
            {(isHero || (isPatternDetail && customSubheading)) && (
              <p className="text-base text-text-secondary mb-4 text-center font-medium">
                {isPatternDetail && customSubheading ? customSubheading : 'Get 6 essential AI design patterns'}
              </p>
            )}

            {/* Input Group */}
            <div className={`flex flex-col sm:flex-row gap-3 ${isHero || isPatternDetail ? 'max-w-lg mx-auto' : ''}`}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={status === 'loading'}
                className={`
                  flex-1 px-5 py-4 rounded-full
                  border-2 border-gray-200 dark:border-gray-700
                  bg-white dark:bg-gray-800
                  text-text-primary placeholder:text-gray-400
                  focus:outline-none focus:border-black dark:focus:border-white
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
                  bg-black dark:bg-white
                  text-white dark:text-black
                  hover:bg-gray-800 dark:hover:bg-gray-100
                  disabled:opacity-50 disabled:cursor-not-allowed
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
                  'Get Patterns →'
                )}
              </button>
            </div>

            {/* Error Message */}
            {status === 'error' && errorMessage && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-sm text-red-600 dark:text-red-400 mt-2 text-center"
              >
                {errorMessage}
              </motion.p>
            )}

            {/* Trust Badge */}
            {(isHero || isPatternDetail) && (
              <p className="text-xs text-text-tertiary/60 mt-4 text-center">
                Free • No spam • Unsubscribe anytime
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
