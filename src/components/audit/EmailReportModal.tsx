'use client';

import { useState, useEffect, useCallback } from 'react';
import { XMarkIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import type { AnalysisResults } from '@/types/audit';

interface EmailReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: AnalysisResults;
}

export function EmailReportModal({ isOpen, onClose, results }: EmailReportModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Reset state when opening
      setEmail('');
      setError(null);
      setSuccess(false);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/audit/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, results, website_url: '' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send report');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send report');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative w-full max-w-md bg-background-primary rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-primary">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-subtle rounded-lg">
                  <EnvelopeIcon className="w-5 h-5 text-accent-primary" />
                </div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Email Report
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-text-tertiary hover:text-text-primary hover:bg-background-secondary rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {success ? (
                // Success State
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-status-success/10 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-8 h-8 text-status-success" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Report Sent!
                  </h3>
                  <p className="text-text-secondary text-sm mb-6">
                    Check your inbox at <span className="font-medium">{email}</span>
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full px-5 py-3 bg-accent-primary text-white dark:text-gray-900 rounded-xl font-medium hover:bg-accent-hover transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                // Form State
                <form onSubmit={handleSubmit}>
                  <p className="text-text-secondary text-sm mb-4">
                    Get your audit results delivered to your inbox with pattern recommendations and next steps.
                  </p>

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

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-background-secondary border border-border-primary rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
                      required
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-status-error/10 border border-status-error/20 rounded-lg">
                      <p className="text-sm text-status-error">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-accent-primary text-white dark:text-gray-900 rounded-xl font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <EnvelopeIcon className="w-5 h-5" />
                        Send Report
                      </>
                    )}
                  </button>

                  <p className="mt-4 text-xs text-text-tertiary text-center">
                    You&apos;ll also receive occasional AI UX tips and pattern updates.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
