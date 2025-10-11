'use client';

import { useState, FormEvent } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      return;
    }

    // TODO: Integrate with email service (e.g., Mailchimp, ConvertKit, etc.)
    // For now, just show success message
    setStatus('success');
    setEmail('');

    // Reset status after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);
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
                  aria-label="Email address"
                  className="flex-1 px-4 py-3 rounded-full border border-border-primary bg-surface-primary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-accent-primary text-background-primary rounded-full font-medium hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 transition-colors duration-200"
                  aria-label="Subscribe"
                >
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
                </button>
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <p className="mt-3 text-sm text-green-600 dark:text-green-400">
                  Thanks for subscribing! We&apos;ll notify you of new patterns.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                  Please enter a valid email address.
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
