'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { companyLogos } from '@/data/company-logos';
import {
  FolderIcon,
  Squares2X2Icon,
  BeakerIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { PATTERN_COUNT } from '@/data/pattern-count';

export function HandbookHero() {
  const [email, setEmail] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      const handbookResponse = await fetch('/api/handbook/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website_url: '' }),
      });

      if (!handbookResponse.ok) {
        const data = await handbookResponse.json();
        throw new Error(data.error || 'Failed to prepare download');
      }

      window.open('/downloads/ai-ux-checklist.pdf', '_blank');
      setIsEmailSent(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
    <section className="lg:min-h-screen flex flex-col lg:flex-row">
      {/* LEFT SIDE */}
      <div className="flex-1 bg-background px-6 sm:px-8 lg:px-16 py-16 lg:py-24 flex flex-col justify-between">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="mb-8">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-accent-primary/10 text-accent-primary inline-block">
              Free PDF Checklist
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6 leading-tight">
            AIUX Design Checklist
          </h1>

          {/* Subheading */}
          <p className="text-lg text-text-secondary mb-10 leading-relaxed">
            28 patterns across 7 categories. Print it, pin it next to your monitor, and use it during design reviews to score your AI product.
          </p>

          {/* Company Logos */}
          <div className="overflow-hidden mb-10">
            <p className="text-xs text-text-tertiary font-semibold uppercase tracking-wide mb-4">
              Patterns sourced from leading companies
            </p>
            <motion.div
              className="flex gap-8"
              animate={{ x: [-1200, 0] }}
              transition={{
                duration: 40,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'linear',
              }}
            >
              {[...companyLogos, ...companyLogos].map((company, index) => (
                <div
                  key={`${company.name}-${index}`}
                  className="flex-shrink-0 h-10 flex items-center justify-center min-w-max"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    width={28}
                    height={28}
                    className="h-7 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Continue Learning - Desktop Only */}
          <div className="hidden lg:block pt-8 border-t border-primary">
            <h2 className="text-sm font-semibold text-text-primary mb-4">
              Continue Learning
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/resources"
                className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-primary hover:border-accent-primary hover:shadow-sm transition"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                  <FolderIcon className="w-5 h-5 text-accent-primary" />
                </div>
                <div>
                  <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition block">All Resources</span>
                  <span className="text-xs text-text-tertiary">Tools, downloads & guides</span>
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
                  <span className="text-xs text-text-tertiary">Browse the full library</span>
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
                  <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition block">Pattern Audit</span>
                  <span className="text-xs text-text-tertiary">Score your AI product</span>
                </div>
              </Link>
            </div>
          </div>

        </div>

        {/* Back Link - Desktop Only */}
        <Link
          href="/resources"
          className="hidden lg:inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary transition mt-10"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Resources
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 bg-accent-primary px-6 sm:px-8 lg:px-12 py-12 lg:py-16 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-lg mx-auto w-full">
          {/* What You Get + Scoring Guide - Side by Side */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-4">What You Get</p>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 flex-shrink-0 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className="text-sm text-gray-400 leading-tight">28 patterns with checkboxes</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 flex-shrink-0 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className="text-sm text-gray-400 leading-tight">One-line descriptions</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 flex-shrink-0 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className="text-sm text-gray-400 leading-tight">4 maturity levels</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 flex-shrink-0 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className="text-sm text-gray-400 leading-tight">Print-ready 2-page PDF</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-4">Scoring Guide</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-400">22-28 Production-ready</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="text-sm text-gray-400">15-21 Solid foundation</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" />
                  <span className="text-sm text-gray-400">8-14 Early stage</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-600 flex-shrink-0" />
                  <span className="text-sm text-gray-400">0-7 Significant UX debt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Form or Success */}
          {!isEmailSent ? (
            <form onSubmit={handleSubmit} className="space-y-4 mb-10">
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
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
                className="w-full px-5 py-4 border border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition text-base placeholder:text-gray-500"
                required
              />
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  disabled={isLoading}
                  className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-gray-800 text-white focus:ring-white focus:ring-offset-gray-900 cursor-pointer"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-400 transition leading-tight">
                  I agree to receive the checklist and daily AI UX news updates. Unsubscribe anytime.
                </span>
              </label>
              <button
                type="submit"
                disabled={isLoading || !consentGiven}
                className="w-full px-6 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Preparing your checklist...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download Checklist
                  </>
                )}
              </button>

              {error && (
                <div className="text-sm text-red-500 bg-red-950 px-4 py-3 rounded-lg border border-red-800">
                  {error}
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-4 mb-10">
              <div className="p-4 bg-green-900 border border-green-600 rounded-lg">
                <p className="text-white font-semibold mb-1">Your checklist is downloading.</p>
                <p className="text-white text-sm">Check your email for the welcome message.</p>
              </div>
              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setIsDownloaded(false);
                  setEmail('');
                  setConsentGiven(false);
                  setError('');
                }}
                className="w-full px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                Download Another Copy
              </button>
            </div>
          )}

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <svg className="w-5 h-5 text-white mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-400">Print-ready PDF</span>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-5 h-5 text-white mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span className="text-sm text-gray-400">100% free</span>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-5 h-5 text-white mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-400">No spam ever</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Mobile-only: Continue Learning */}
    <section className="lg:hidden bg-background px-6 py-8 border-t border-primary">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-text-primary mb-3">
          Continue Learning
        </h2>
        <div className="flex flex-col gap-3">
          <Link
            href="/resources"
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-primary"
          >
            <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
              <FolderIcon className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <span className="text-sm font-medium text-text-primary block">All Resources</span>
              <span className="text-xs text-text-tertiary">Tools, downloads & guides</span>
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
              <span className="text-xs text-text-tertiary">Browse the full library</span>
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
              <span className="text-sm font-medium text-text-primary block">Pattern Audit</span>
              <span className="text-xs text-text-tertiary">Score your AI product</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Back Link */}
      <Link
        href="/resources"
        className="inline-flex items-center gap-2 text-sm text-text-tertiary"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Resources
      </Link>
    </section>
    </div>
  );
}
