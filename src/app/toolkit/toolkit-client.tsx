'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';
import {
  ChartBarIcon,
  CheckCircleIcon,
  NewspaperIcon,
  Squares2X2Icon,
  ArrowDownTrayIcon,
  DocumentIcon,
  CurrencyDollarIcon,
  BoltIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { PATTERN_COUNT } from '@/data/pattern-count';

const toolkitItems = [
  {
    number: 1,
    name: 'Intent-Clarity Spectrum',
    description: 'Map user intent from vague to specific and find the right interaction model',
    icon: ChartBarIcon,
  },
  {
    number: 2,
    name: 'Conversation Checklist',
    description: 'Decide when your AI feature actually needs conversation',
    icon: CheckCircleIcon,
  },
];

const useCases = [
  'Planning new AI features',
  'Auditing existing interactions',
  'Stakeholder presentations',
  'Team alignment workshops',
  'Design reviews & critiques',
];

export function ToolkitClient() {
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = () => {
    // Trigger immediate download
    const link = document.createElement('a');
    link.href = '/downloads/ai-interaction-toolkit.pdf';
    link.download = 'ai-interaction-toolkit.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success state
    setIsDownloaded(true);
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
              AI Interaction Toolkit
            </h1>

            {/* Subheading */}
            <p className="text-base lg:text-lg text-text-secondary mb-6 lg:mb-10 leading-relaxed">
              A practical 2-page framework for deciding when AI should talk vs. act.
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
                    <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition block">{PATTERN_COUNT} Patterns</span>
                    <span className="text-xs text-text-tertiary">Browse the full library</span>
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
                {toolkitItems.map((item) => (
                  <motion.div
                    key={item.number}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: item.number * 0.1 }}
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
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Download Section */}
            {!isDownloaded ? (
              <div className="mb-10">
                <button
                  onClick={handleDownload}
                  className="w-full px-6 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  Download Toolkit (PDF)
                </button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  2 pages • No email required • Instant download
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                {/* Success Message */}
                <div className="p-4 bg-emerald-500/20 border border-emerald-500 rounded-lg mb-6">
                  <p className="text-white font-semibold mb-1">Your toolkit is downloading!</p>
                  <p className="text-emerald-200 text-sm">
                    Check your downloads folder for the PDF.
                  </p>
                </div>

                {/* Email Signup */}
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-5">
                  <h3 className="text-white font-semibold mb-2">Want more frameworks like this?</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Get daily AI UX news in your inbox.
                  </p>
                  <InlineNewsletterSignup
                    variant="news"
                    source="toolkit"
                    customButtonText="Subscribe"
                    customSuccessMessage="You're in! Check your inbox."
                    stacked
                    darkBackground
                  />
                </div>

                {/* Download Again Button */}
                <button
                  onClick={handleDownload}
                  className="w-full mt-4 px-4 py-3 bg-transparent border border-gray-600 text-white font-medium rounded-lg hover:bg-gray-800 transition cursor-pointer text-sm"
                >
                  Download Again
                </button>
              </motion.div>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <DocumentIcon className="w-5 h-5 text-white mb-2" />
                <span className="text-xs text-gray-400">2-page PDF</span>
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
                <span className="text-sm font-medium text-text-primary block">{PATTERN_COUNT} Patterns</span>
                <span className="text-xs text-text-tertiary">Browse the full library</span>
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
