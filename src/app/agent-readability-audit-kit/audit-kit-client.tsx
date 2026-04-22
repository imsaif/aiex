'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ClipboardDocumentCheckIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassCircleIcon,
  NewspaperIcon,
  Squares2X2Icon,
  BeakerIcon,
  ArrowDownTrayIcon,
  DocumentIcon,
  CurrencyDollarIcon,
  BoltIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const auditKitItems = [
  {
    number: 1,
    name: 'The 5-Prompt Test',
    description:
      'The exact prompts to paste into ChatGPT or Claude with your product URL. Run in fresh chats to simulate real agent visits.',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    number: 2,
    name: 'Layer Stripping Checklist',
    description:
      'Score your product across four layers (structure, content, interaction, editorial) to see where agents lose visibility.',
    icon: AdjustmentsHorizontalIcon,
  },
  {
    number: 3,
    name: 'Gap-Filling Scorecard',
    description:
      'Check for three failure modes: competitor blending, narrative recycling, and confident fabrication.',
    icon: MagnifyingGlassCircleIcon,
  },
];

const useCases = [
  'Testing how ChatGPT/Claude describe your product',
  'Identifying where agents lose visibility into your content',
  'Finding competitor blending and content gaps',
  'Prioritizing agent readability improvements',
  'Stakeholder presentations on AI discovery',
];

export function AuditKitClient() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const triggerDownload = () => {
    const link = document.createElement('a');
    link.href = '/downloads/agent-readability-audit.pdf';
    link.download = 'agent-readability-audit.pdf';
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
        body: JSON.stringify({ email, source: 'audit-kit', website_url: '' }),
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
      {/* Hero Section - Split Layout (fixed colors, no dark mode) */}
      <section className="lg:min-h-screen flex flex-col lg:flex-row">
        {/* LEFT SIDE - Always White Background */}
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
              Agent Readability Audit Kit
            </h1>

            {/* Subheading */}
            <p className="text-base lg:text-lg text-text-secondary mb-6 lg:mb-10 leading-relaxed">
              A 4-page toolkit to test how AI agents read, understand, and represent your product.
            </p>

            {/* Use Cases - Pills (hidden on mobile, shown on desktop) */}
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

            {/* Continue Learning - Cards (hidden on mobile, shown on desktop) */}
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
                    <span className="text-xs text-text-tertiary">Daily AI UX news</span>
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
                    <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition block">36 Patterns</span>
                    <span className="text-xs text-text-tertiary">Browse the full library</span>
                  </div>
                </Link>
                <Link
                  href="/audit"
                  className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-primary hover:border-accent-primary hover:shadow-sm transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                    <BeakerIcon className="w-5 h-5 text-accent-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition block">Pattern Audit Tool</span>
                    <span className="text-xs text-text-tertiary">Audit your AI patterns</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Back Link at Bottom (hidden on mobile) */}
          <Link
            href="/"
            className="hidden lg:inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary transition mt-10"
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
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-4">
                What&apos;s Inside
              </p>
              <div className="space-y-3">
                {auditKitItems.map((item) => (
                  <div
                    key={item.number}
                    className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-gray-500 transition"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-10 h-10 rounded bg-gray-800 text-white flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6" />
                      </div>

                      <div>
                        {/* Title */}
                        <h3 className="text-base font-semibold text-white mb-1">{item.name}</h3>

                        {/* Description */}
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Section */}
            {status !== 'success' ? (
              <div className="mb-10">
                <form onSubmit={handleSubmit} className="space-y-3">
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
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        disabled={status === 'loading'}
                        className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                <p className="text-xs text-gray-400 text-center mt-3">
                  Enter email · Instant download · No spam
                </p>
              </div>
            ) : (
              <div className="mb-10">
                {/* Success Message */}
                <div className="p-4 bg-emerald-500/20 border border-emerald-500 rounded-lg mb-4">
                  <p className="text-white font-semibold mb-1">Your audit kit is downloading!</p>
                  <p className="text-emerald-200 text-sm">
                    Check your downloads folder for the PDF.
                  </p>
                </div>

                {/* Download Again Button */}
                <button
                  onClick={triggerDownload}
                  className="w-full px-4 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition cursor-pointer text-sm flex items-center justify-center gap-2"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Download Again
                </button>
              </div>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <DocumentIcon className="w-5 h-5 text-white mb-2" />
                <span className="text-xs text-gray-400">4-page PDF</span>
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
        {/* Use Cases - Pills */}
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

        {/* Continue Learning */}
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
                <span className="text-xs text-text-tertiary">Daily AI UX news</span>
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
                <span className="text-sm font-medium text-text-primary block">36 Patterns</span>
                <span className="text-xs text-text-tertiary">Browse the full library</span>
              </div>
            </Link>
            <Link
              href="/audit"
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-primary"
            >
              <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                <BeakerIcon className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-text-primary block">Pattern Audit Tool</span>
                <span className="text-xs text-text-tertiary">Audit your AI patterns</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-tertiary"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Home
        </Link>
      </section>
    </div>
  );
}
