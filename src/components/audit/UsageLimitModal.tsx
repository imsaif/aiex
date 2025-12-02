'use client';

import { useEffect } from 'react';

interface UsageLimitModalProps {
  message: string;
  onClose: () => void;
}

export function UsageLimitModal({ message, onClose }: UsageLimitModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background-primary rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-status-warning/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-status-warning"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-text-primary mb-3">
          Daily Limit Reached
        </h2>

        {/* Message */}
        <p className="text-text-secondary text-center mb-6">
          {message}
        </p>

        {/* Info Box */}
        <div className="bg-background-secondary rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-text-tertiary mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm text-text-secondary">
              <p className="font-medium text-text-primary mb-1">Why the limit?</p>
              <p>We offer free analyses to help designers improve their interfaces. Limits help us keep the service available for everyone.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-accent-primary text-white rounded-xl font-medium hover:bg-accent-hover transition-colors"
        >
          Got it
        </button>

        {/* Footer text */}
        <p className="text-xs text-text-tertiary text-center mt-4">
          Your limit resets at midnight UTC
        </p>
      </div>
    </div>
  );
}
