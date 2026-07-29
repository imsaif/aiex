'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import {
  AdjustmentsHorizontalIcon,
  EyeIcon,
  ListBulletIcon,
  ClipboardDocumentListIcon,
  ArrowUpIcon,
  ShieldCheckIcon,
  ArrowsRightLeftIcon,
  SignalIcon,
  ArrowDownTrayIcon,
  DocumentIcon,
  CurrencyDollarIcon,
  BoltIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  NewspaperIcon,
  Squares2X2Icon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import { PATTERN_COUNT } from '@/data/pattern-count';

const checklistPatterns = [
  { number: 1, name: 'Autonomy Spectrum', icon: AdjustmentsHorizontalIcon },
  { number: 2, name: 'Intent Preview', icon: EyeIcon },
  { number: 3, name: 'Plan Summary', icon: ListBulletIcon },
  { number: 4, name: 'Action Audit Trail', icon: ClipboardDocumentListIcon },
  { number: 5, name: 'Escalation Pathways', icon: ArrowUpIcon },
  { number: 6, name: 'Trust Calibration', icon: ShieldCheckIcon },
  { number: 7, name: 'Mixed-Initiative Control', icon: ArrowsRightLeftIcon },
  { number: 8, name: 'Agent Status & Monitoring', icon: SignalIcon },
];

const useCases = [
  'Designing new agentic AI features',
  'Auditing existing agent-based products',
  'Aligning teams on agent autonomy boundaries',
  'Design reviews for agentic workflows',
  'Stakeholder presentations on agent UX',
];

export function AgenticChecklistClient() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const triggerDownload = () => {
    const link = document.createElement('a');
    link.href = '/downloads/agentic-ux-checklist.pdf';
    link.download = 'agentic-ux-checklist.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        body: JSON.stringify({ email, source: 'agentic-checklist', website_url: '' }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        triggerDownload();
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Split Layout */}
      <section className="lg:min-h-screen flex flex-col lg:flex-row">
        {/* LEFT SIDE */}
        <div className="flex-1 bg-background px-6 sm:px-8 lg:px-16 xl:px-20 py-8 lg:py-20 flex flex-col justify-between">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="mb-4 lg:mb-8">
              <span className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs font-semibold bg-accent-primary/10 text-accent-primary inline-block">
                Free Download
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl lg:text-5xl font-bold text-text-primary mb-3 lg:mb-6 leading-tight tracking-tight">
              Agentic UX Checklist
            </h1>

            {/* Subheading */}
            <p className="text-base lg:text-lg text-text-secondary mb-6 lg:mb-10 leading-relaxed">
              Building an AI agent? Use this checklist to answer the same UX questions that teams behind Claude, ChatGPT, and Copilot solve every day — from how much autonomy to give, to when your agent should stop and ask.
            </p>

            {/* Use Cases - Pills (desktop) */}
            <div className="hidden lg:block mb-10">
              <h2 className="text-sm font-semibold text-text-primary mb-4">
                Use it for
              </h2>
              <div className="flex flex-wrap gap-2">
                {useCases.map((useCase) => (
                  <span
                    key={useCase}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-background-secondary text-text-secondary border border-primary hover:border-accent-primary transition"
                  >
                    {useCase}
                  </span>
                ))}
              </div>
            </div>

            {/* Continue Learning (desktop) */}
            <div className="hidden lg:block pt-8 border-t border-primary">
              <h2 className="text-sm font-semibold text-text-primary mb-4">
                Continue Learning
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/news"
                  className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-primary hover:border-accent-primary hover:shadow-sm transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                    <NewspaperIcon className="w-5 h-5 text-accent-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition block">Newsletter</span>
                    <span className="text-xs text-text-secondary">Daily AI UX news</span>
                  </div>
                </Link>
                <Link
                  href="/#patterns"
                  className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-primary hover:border-accent-primary hover:shadow-sm transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                    <Squares2X2Icon className="w-5 h-5 text-accent-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition block">{PATTERN_COUNT} Patterns</span>
                    <span className="text-xs text-text-secondary">Browse the full library</span>
                  </div>
                </Link>
                <Link
                  href="/"
                  className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-primary hover:border-accent-primary hover:shadow-sm transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                    <BeakerIcon className="w-5 h-5 text-accent-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition block">Pattern Audit Tool</span>
                    <span className="text-xs text-text-secondary">Audit your AI patterns</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Back Link (desktop) */}
          <Link
            href="/"
            className="hidden lg:inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition mt-10"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* RIGHT SIDE - Accent Background */}
        <div className="flex-1 bg-accent-primary px-6 sm:px-8 lg:px-12 py-12 lg:py-16 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-lg mx-auto w-full">
            {/* What's Inside - Cards */}
            <div className="mb-10">
              <h2 className="text-xs text-gray-300 font-semibold uppercase tracking-wide mb-4">
                What&apos;s Inside: 8 Patterns
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {checklistPatterns.map((item) => (
                  <motion.div
                    key={item.number}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={reduce ? undefined : { opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.3, delay: item.number * 0.06 }}
                    className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-gray-500 transition flex flex-col items-center text-center gap-2"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-800 text-white flex items-center justify-center">
                      <item.icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-medium text-white leading-tight">{item.name}</h3>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Download Section */}
            {status !== 'success' ? (
              <div className="mb-10">
                <form onSubmit={handleSubmit} className="space-y-3">
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
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <label htmlFor="agentic-email" className="sr-only">
                        Email address
                      </label>
                      <EnvelopeIcon
                        className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        id="agentic-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        disabled={status === 'loading'}
                        className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-white focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="px-6 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {status === 'loading' ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <>
                          <ArrowDownTrayIcon className="w-5 h-5" />
                          Download
                        </>
                      )}
                    </button>
                  </div>
                  {status === 'error' && errorMessage && (
                    <p className="text-sm text-red-400 text-center">{errorMessage}</p>
                  )}
                </form>
                <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
                  Downloads instantly. You&apos;ll also join{' '}
                  <span className="font-medium text-white">AI UX Daily</span>, our free newsletter.
                  Unsubscribe anytime.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                <div className="p-4 bg-emerald-500/20 border border-emerald-500 rounded-lg mb-4">
                  <p className="text-white font-semibold mb-1">Your checklist is downloading!</p>
                  <p className="text-emerald-200 text-sm">
                    Check your downloads folder for the PDF.
                  </p>
                </div>
                <button
                  onClick={triggerDownload}
                  className="w-full px-4 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition cursor-pointer text-sm flex items-center justify-center gap-2"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Download Again
                </button>
              </motion.div>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <DocumentIcon className="w-5 h-5 text-white mb-2" />
                <span className="text-xs text-gray-400">8 patterns</span>
              </div>
              <div className="flex flex-col items-center">
                <CurrencyDollarIcon className="w-5 h-5 text-white mb-2" />
                <span className="text-xs text-gray-400">100% free</span>
              </div>
              <div className="flex flex-col items-center">
                <BoltIcon className="w-5 h-5 text-white mb-2" />
                <span className="text-xs text-gray-400">Instant download</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-only: Use Cases & Continue Learning */}
      <section className="lg:hidden bg-background px-6 py-8 border-t border-primary">
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            Use it for
          </h2>
          <div className="flex flex-wrap gap-2">
            {useCases.map((useCase) => (
              <span
                key={useCase}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-background-secondary text-text-secondary border border-primary"
              >
                {useCase}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            Continue Learning
          </h2>
          <div className="flex flex-col gap-3">
            <Link
              href="/news"
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-primary"
            >
              <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                <NewspaperIcon className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-text-primary block">Newsletter</span>
                <span className="text-xs text-text-secondary">Daily AI UX news</span>
              </div>
            </Link>
            <Link
              href="/#patterns"
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-primary"
            >
              <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                <Squares2X2Icon className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-text-primary block">{PATTERN_COUNT} Patterns</span>
                <span className="text-xs text-text-secondary">Browse the full library</span>
              </div>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-primary"
            >
              <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                <BeakerIcon className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-text-primary block">Pattern Audit Tool</span>
                <span className="text-xs text-text-secondary">Audit your AI patterns</span>
              </div>
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Home
        </Link>
      </section>
    </div>
  );
}
