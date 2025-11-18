'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { companyLogos } from '@/data/company-logos';

const patterns = [
  {
    number: 1,
    name: 'Contextual Assistance',
    description: "Help users when they're actually stuck",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    companies: ['Google', 'GitHub', 'Notion'],
  },
  {
    number: 2,
    name: 'Confidence Visualization',
    description: 'Show certainty levels for AI results',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    companies: ['ChatGPT', 'Claude', 'Perplexity'],
  },
  {
    number: 3,
    name: 'Error Recovery',
    description: 'Handle AI failures gracefully',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    companies: ['Slack', 'Discord', 'Vercel'],
  },
  {
    number: 4,
    name: 'Privacy-First Design',
    description: 'Make users feel safe sharing data',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    companies: ['Apple', 'DuckDuckGo', 'Signal'],
  },
  {
    number: 5,
    name: 'Explainable AI',
    description: 'Show why AI made each decision',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    companies: ['Figma', 'Stripe', 'IBM'],
  },
  {
    number: 6,
    name: 'Progressive Disclosure',
    description: 'Start simple, add power later',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-3" />
      </svg>
    ),
    companies: ['Canva', 'Webflow', 'Linear'],
  },
];

export function HandbookHero() {
  const [email, setEmail] = useState('');
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

      // Call handbook PDF generation endpoint
      // This will subscribe them to the newsletter AND generate a download token
      const handbookResponse = await fetch('/api/handbook/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!handbookResponse.ok) {
        const data = await handbookResponse.json();
        throw new Error(data.error || 'Failed to prepare handbook download');
      }

      const { token, email: responseEmail } = await handbookResponse.json();

      // Open PDF in new tab
      window.open('/handbook.pdf', '_blank');

      // Show success state
      setIsEmailSent(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT SIDE - White Background */}
      <div className="flex-1 bg-white px-6 sm:px-8 lg:px-16 py-16 lg:py-24 flex flex-col justify-between">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="mb-10">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 inline-block">
              ✨ Free Handbook
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-8 leading-loose">
            Get 6 Essential AI Design Patterns
          </h1>

          {/* Subheading */}
          <p className="text-lg text-text-secondary mb-12 leading-loose">
            Master AI design with proven patterns from leading companies
          </p>

          {/* Logos Carousel */}
          <div className="overflow-hidden mb-12">
            <p className="text-xs text-text-secondary font-semibold uppercase tracking-wide mb-6 leading-relaxed">
              Patterns used by leading companies
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
                    className="h-7 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Back Link at Bottom */}
        <Link href="/" className="inline-block text-sm text-text-secondary hover:text-text-primary transition mt-12">
          ← Back to Home
        </Link>
      </div>

      {/* RIGHT SIDE - Black Background */}
      <div className="flex-1 bg-black px-6 sm:px-8 lg:px-12 py-12 lg:py-16 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-lg mx-auto w-full">
          {/* What's Inside - Pattern Cards Grid */}
          <div className="mb-10">
            <p className="text-xs text-text-tertiary font-semibold uppercase tracking-wide mb-4">
              What's Inside
            </p>
            <div className="grid grid-cols-2 gap-3">
              {patterns.map((pattern) => (
                <motion.div
                  key={pattern.number}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: pattern.number * 0.05 }}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition"
                >
                  {/* Icon */}
                  <div className="w-8 h-8 rounded bg-gray-800 text-white flex items-center justify-center mb-2 text-text-tertiary">
                    {pattern.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {pattern.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-text-tertiary leading-tight">
                    {pattern.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Featured Pattern Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-4">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">
                Example: Pattern #1
              </p>
              <h3 className="text-base font-bold text-white mb-2">Contextual Assistance</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-3">
                Help users when they're stuck. Used by Gmail Smart Compose, GitHub Copilot, and Notion AI.
              </p>
              <div className="space-y-1 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <svg className="w-3 h-3 flex-shrink-0 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Implementation guidelines</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3 h-3 flex-shrink-0 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Code examples & design prompts</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Email Form or Success Message */}
          {!isEmailSent ? (
            <form onSubmit={handleSubmit} className="space-y-4 mb-10">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
                className="w-full px-5 py-4 border border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition text-base placeholder:text-text-tertiary"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Preparing your handbook...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      <path d="M12 10l1-2.2 1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z" fill="white" />
                    </svg>
                    Download Handbook
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
                <p className="text-white font-semibold mb-1">✓ All Set!</p>
                <p className="text-white text-sm mb-3">Your handbook is downloading. Check your email for the welcome message.</p>
              </div>
              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setIsDownloaded(false);
                  setEmail('');
                  setError('');
                }}
                className="w-full px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                Download Another Copy
              </button>
              <p className="text-center text-accent-primary text-xs">
                You can also access it anytime from the link in your email.
              </p>
            </div>
          )}

          {/* Benefits Below Email */}
          <div className="grid grid-cols-3 gap-4 mb-10 text-center">
            <div className="flex flex-col items-center">
              <svg className="w-5 h-5 text-white mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-gray-300">15-min read</span>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-5 h-5 text-white mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span className="text-xs text-gray-300">100% free</span>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-5 h-5 text-white mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-gray-300">No spam ever</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
