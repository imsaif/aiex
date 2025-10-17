'use client';

import { useState, FormEvent } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setEmail('');
        // Reset status after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <footer className="bg-background-secondary border-t border-border-primary">
      {/* Newsletter Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              Get Notified on New Patterns
            </h2>
            <p className="text-text-secondary mb-8">
              Subscribe to receive updates when new AI design patterns are added
            </p>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={status === 'loading'}
                  aria-label="Email address"
                  className="flex-1 px-4 py-3 rounded-full border border-border-primary bg-surface-primary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3 bg-accent-primary text-background-primary rounded-full font-medium hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Subscribe"
                >
                  {status === 'loading' ? (
                    <svg
                      className="w-5 h-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <p className="mt-3 text-sm text-green-600 dark:text-green-400">
                  ✓ Thanks for subscribing! Check your email for confirmation.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                  {errorMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Built With & Contact Section */}
      <div className="border-t border-border-primary">
        <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16 py-8">
          <div className="flex flex-col items-center gap-4 text-sm text-text-secondary">
            {/* Built with and social links */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span>Built with ☕ by Imran</span>
              <span>·</span>
              <a
                href="https://www.imranaidesign.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:text-accent-hover transition-colors"
              >
                Portfolio
              </a>
              <span>·</span>
              <a
                href="https://github.com/imsaif"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:text-accent-hover transition-colors"
              >
                GitHub
              </a>
              <span>·</span>
              <a
                href="https://www.linkedin.com/in/imsaif/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:text-accent-hover transition-colors"
              >
                LinkedIn
              </a>
            </div>

            {/* Contact email */}
            <div className="flex items-center gap-2">
              <span>Contact:</span>
              <a
                href="mailto:imranrizom@gmail.com"
                className="text-accent-primary hover:text-accent-hover transition-colors"
              >
                imranrizom@gmail.com
              </a>
            </div>

            {/* Copyright */}
            <div>
              <p>© {new Date().getFullYear()} aiux. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
