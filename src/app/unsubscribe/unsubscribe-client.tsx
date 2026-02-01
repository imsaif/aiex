'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type ViewState = 'loading' | 'manage' | 'unsubscribed' | 'updated' | 'error' | 'invalid';

interface SubscriberData {
  email: string;
  emailFrequency: string;
  active: boolean;
}

const UNSUBSCRIBE_REASONS = [
  { value: 'too_many_emails', label: 'Too many emails' },
  { value: 'not_relevant', label: 'Content not relevant' },
  { value: 'didnt_sign_up', label: "I didn't sign up for this" },
  { value: 'other', label: 'Other' },
];

export default function UnsubscribeClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [viewState, setViewState] = useState<ViewState>('loading');
  const [subscriber, setSubscriber] = useState<SubscriberData | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<string>('all');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Fetch subscriber data on mount
  useEffect(() => {
    if (!token) {
      setViewState('invalid');
      return;
    }

    const fetchSubscriber = async () => {
      try {
        const response = await fetch(`/api/newsletter/unsubscribe?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.error || 'Failed to load subscription data');
          setViewState('error');
          return;
        }

        setSubscriber(data.subscriber);
        setSelectedFrequency(data.subscriber.emailFrequency);

        // If already unsubscribed, show unsubscribed state
        if (!data.subscriber.active || data.subscriber.emailFrequency === 'none') {
          setViewState('unsubscribed');
        } else {
          setViewState('manage');
        }
      } catch {
        setErrorMessage('Failed to connect to server');
        setViewState('error');
      }
    };

    fetchSubscriber();
  }, [token]);

  // Handle immediate unsubscribe (one click, no questions)
  const handleUnsubscribe = async () => {
    if (!token) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          action: 'unsubscribe',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to unsubscribe');
        setIsSubmitting(false);
        return;
      }

      setViewState('unsubscribed');
    } catch {
      setErrorMessage('Failed to connect to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle frequency preference update
  const handleUpdatePreferences = async () => {
    if (!token) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          action: 'update_frequency',
          frequency: selectedFrequency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to update preferences');
        setIsSubmitting(false);
        return;
      }

      setViewState('updated');
    } catch {
      setErrorMessage('Failed to connect to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle optional feedback submission (after unsubscribe)
  const handleSubmitFeedback = async () => {
    if (!token) return;
    setIsSubmitting(true);

    const reason = selectedReason === 'other' ? otherReason : selectedReason;

    try {
      await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          action: 'feedback',
          reason,
        }),
      });
      // We don't care about the response for feedback - just show thanks
    } catch {
      // Ignore errors for optional feedback
    } finally {
      setIsSubmitting(false);
      setSelectedReason('submitted');
    }
  };

  // Handle resubscribe
  const handleResubscribe = async () => {
    if (!token) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          action: 'resubscribe',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to resubscribe');
        setIsSubmitting(false);
        return;
      }

      setSubscriber(data.subscriber);
      setSelectedFrequency(data.subscriber.emailFrequency);
      setViewState('manage');
    } catch {
      setErrorMessage('Failed to connect to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (viewState === 'loading') {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
        <div className="bg-surface-primary p-8 rounded-lg shadow-md max-w-md w-full border border-border-primary text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-background-secondary rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-background-secondary rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-text-tertiary mt-4">Loading your subscription...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (viewState === 'invalid') {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
        <div className="bg-surface-primary p-8 rounded-lg shadow-md max-w-md w-full border border-border-primary text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Invalid Link</h1>
          <p className="text-text-secondary mb-6">
            This unsubscribe link is invalid or has expired. Please use the link from a recent newsletter email.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  if (viewState === 'error') {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
        <div className="bg-surface-primary p-8 rounded-lg shadow-md max-w-md w-full border border-border-primary text-center">
          <h1 className="text-2xl font-bold text-status-error mb-4">Something Went Wrong</h1>
          <p className="text-text-secondary mb-6">{errorMessage}</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Updated preferences confirmation
  if (viewState === 'updated') {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
        <div className="bg-surface-primary p-8 rounded-lg shadow-md max-w-md w-full border border-border-primary text-center">
          <div className="w-16 h-16 bg-status-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-4">Preferences Updated</h1>
          <p className="text-text-secondary mb-6">
            Your subscription has been updated to receive{' '}
            <strong>{selectedFrequency === 'all' ? 'all emails (daily + weekly)' : 'weekly digest only'}</strong>.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
          >
            Return to AI UX Patterns
          </Link>
        </div>
      </div>
    );
  }

  // Unsubscribed state with optional feedback
  if (viewState === 'unsubscribed') {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
        <div className="bg-surface-primary p-8 rounded-lg shadow-md max-w-md w-full border border-border-primary">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-status-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">You&apos;ve Been Unsubscribed</h1>
            <p className="text-text-secondary">
              You will no longer receive emails from AI UX Patterns.
            </p>
          </div>

          {/* Optional feedback section */}
          {selectedReason !== 'submitted' && (
            <div className="border-t border-border-primary pt-6 mt-6">
              <p className="text-text-secondary text-sm mb-4">
                Mind telling us why? <span className="text-text-tertiary">(optional)</span>
              </p>
              <div className="space-y-2 mb-4">
                {UNSUBSCRIBE_REASONS.map((reason) => (
                  <label
                    key={reason.value}
                    className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${
                      selectedReason === reason.value
                        ? 'border-accent-primary bg-accent-primary/5'
                        : 'border-border-secondary hover:border-border-primary'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reason.value}
                      checked={selectedReason === reason.value}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-text-primary">{reason.label}</span>
                  </label>
                ))}
              </div>

              {selectedReason === 'other' && (
                <textarea
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="Tell us more..."
                  className="w-full px-3 py-2 border border-border-primary rounded-md bg-background-secondary text-text-primary mb-4 resize-none"
                  rows={3}
                />
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitFeedback}
                  disabled={!selectedReason || isSubmitting}
                  className="flex-1 px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
                <button
                  onClick={() => setSelectedReason('submitted')}
                  className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  No thanks
                </button>
              </div>
            </div>
          )}

          {selectedReason === 'submitted' && (
            <div className="text-center text-text-tertiary text-sm mt-4">
              Thank you for your feedback!
            </div>
          )}

          {/* Resubscribe option */}
          <div className="border-t border-border-primary pt-6 mt-6 text-center">
            <p className="text-text-tertiary text-sm mb-3">Changed your mind?</p>
            <button
              onClick={handleResubscribe}
              disabled={isSubmitting}
              className="text-accent-primary hover:text-accent-primary/80 font-medium transition-colors"
            >
              {isSubmitting ? 'Resubscribing...' : 'Resubscribe'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Manage subscription state
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="bg-surface-primary p-8 rounded-lg shadow-md max-w-md w-full border border-border-primary">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Unsubscribe</h1>
        <p className="text-text-secondary text-sm mb-6">
          {subscriber?.email}
        </p>

        {/* Primary action: Unsubscribe */}
        <button
          onClick={handleUnsubscribe}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-text-primary text-white rounded-md hover:bg-text-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Unsubscribing...' : 'Unsubscribe from all emails'}
        </button>

        {/* Alternative: Reduce frequency */}
        <div className="mt-8 pt-6 border-t border-border-secondary">
          <p className="text-text-secondary text-sm mb-4">
            Or, just get fewer emails instead:
          </p>

          <div className="space-y-2 mb-4">
            <label
              className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${
                selectedFrequency === 'weekly'
                  ? 'border-accent-primary bg-accent-primary/5'
                  : 'border-border-secondary hover:border-border-primary'
              }`}
            >
              <input
                type="radio"
                name="frequency"
                value="weekly"
                checked={selectedFrequency === 'weekly'}
                onChange={(e) => setSelectedFrequency(e.target.value)}
                className="mr-3"
              />
              <div>
                <span className="text-text-primary font-medium">Weekly digest only</span>
                <span className="text-text-tertiary text-sm ml-2">
                  (1 email/week)
                </span>
              </div>
            </label>
          </div>

          <button
            onClick={handleUpdatePreferences}
            disabled={isSubmitting || selectedFrequency !== 'weekly'}
            className="w-full px-4 py-2 border border-accent-primary text-accent-primary rounded-md hover:bg-accent-primary/5 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Switch to weekly only'}
          </button>
        </div>

        {errorMessage && (
          <p className="text-status-error text-sm mt-4 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
