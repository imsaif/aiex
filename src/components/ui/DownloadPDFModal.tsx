'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, EnvelopeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface DownloadPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  guideTitle: string;
  guideSlug: string;
}

export default function DownloadPDFModal({ isOpen, onClose, guideTitle, guideSlug }: DownloadPDFModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/guides/download-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, guideSlug, guideTitle }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
      setStatus('error');
    }
  };

  const handleClose = () => {
    setEmail('');
    setStatus('idle');
    setErrorMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="relative p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-text-secondary" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent-subtle flex items-center justify-center">
                    <DocumentArrowDownIcon className="w-6 h-6 text-accent-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary">Download PDF</h2>
                    <p className="text-sm text-text-secondary">Get the offline version</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {status === 'success' ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Check your inbox!</h3>
                    <p className="text-text-secondary mb-4">
                      We've sent the PDF download link to <strong>{email}</strong>
                    </p>
                    <button
                      onClick={handleClose}
                      className="px-6 py-2.5 rounded-full bg-accent-primary text-white dark:text-gray-900 font-medium hover:bg-accent-hover transition-colors"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-text-secondary mb-4">
                      Enter your email to receive <strong>{guideTitle}</strong> as a PDF you can read offline.
                    </p>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                          Email address
                        </label>
                        <div className="relative">
                          <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (status === 'error') setStatus('idle');
                            }}
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
                            disabled={status === 'loading'}
                          />
                        </div>
                        {status === 'error' && errorMessage && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-3 rounded-full bg-accent-primary text-white dark:text-gray-900 font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {status === 'loading' ? (
                          <>
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <DocumentArrowDownIcon className="w-5 h-5" />
                            Send me the PDF
                          </>
                        )}
                      </button>
                    </form>

                    <p className="mt-4 text-xs text-text-secondary text-center">
                      We'll also send you occasional updates about new guides. Unsubscribe anytime.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
