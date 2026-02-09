'use client';

import { useEffect } from 'react';
import categories from '@/data/categories';
import { Pattern } from '@/types';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';
import { usePatternViewTracker } from '@/hooks';
import { SmartHandbookPrompt } from '@/components/smart-prompt';
import AuthorFooter from '@/components/sections/AuthorFooter';

// Lazy load heavy components to reduce initial bundle size
const Carousel = dynamic(() => import('@/components/ui/Carousel'), {
  loading: () => <div className="animate-pulse bg-background-secondary h-64 rounded-lg"></div>,
  ssr: false
});

const CodeExampleBlock = dynamic(() => import('@/components/ui/CodeExampleBlock'), {
  loading: () => <div className="animate-pulse bg-background-secondary h-40 rounded-lg"></div>,
  ssr: false
});

const FigmaPromptCard = dynamic(() => import('@/components/ui/FigmaPromptCard'), {
  loading: () => <div className="animate-pulse bg-background-secondary h-64 rounded-lg"></div>,
  ssr: false
});

const ProductsSection = dynamic(() => import('@/components/sections/ProductsSection'), {
  loading: () => <div className="animate-pulse bg-background-secondary h-32 rounded-lg"></div>,
  ssr: false
});

interface ClientPageProps {
  pattern: Pattern;
  previousPattern: Pattern | null;
  nextPattern: Pattern | null;
}

export default function ClientPage({ pattern, previousPattern, nextPattern }: ClientPageProps) {
  // Smart prompt tracking for handbook offer
  const {
    viewCount,
    showPrompt,
    trackView,
    dismiss: dismissPrompt,
    markHandbookDownloaded
  } = usePatternViewTracker({ threshold: 4 });

  // Track pattern view on mount
  useEffect(() => {
    trackView(pattern.id);
  }, [pattern.id, trackView]);

  // Minimal animations - simplified for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } }
  };

  // Get category badge classes - safer approach for Tailwind JIT
  const getCategoryClasses = (color: string = 'blue') => {
    const colorMap: Record<string, string> = {
      'blue': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'green': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'purple': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'orange': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'pink': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'red': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'yellow': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'indigo': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'teal': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    };
    return colorMap[color] || colorMap['blue'];
  };

  return (
    <motion.main
      className="max-w-7xl mx-auto pt-20 md:pt-24 pb-8 px-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Breadcrumb Navigation */}
      <motion.nav
        className="flex items-center justify-between text-sm mb-6"
        variants={itemVariants}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Back to All Patterns</span>
        </Link>

        {nextPattern && (
          <Link
            href={`/patterns/${nextPattern.slug}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-100 transition-colors"
          >
            <span>Next: {nextPattern.title}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        )}
      </motion.nav>

      {/* Pattern Header */}
      <motion.div className="mb-10" variants={itemVariants}>
        <div className="mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryClasses(categories.find(c => c.title === pattern.category)?.color)}`}>
              {pattern.category}
            </span>
          </div>
        </div>
        <h1 className="text-5xl font-bold mt-6 mb-4 text-text-primary">{pattern.title}</h1>
        <div className="text-lg text-text-secondary leading-relaxed">
          {pattern.description}
        </div>
      </motion.div>

      {/* Introduction Section - SEO Enhanced */}
      {pattern.introduction && (
        <motion.div
          className="mb-10"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            What is {pattern.title}?
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            {pattern.introduction}
          </p>
        </motion.div>
      )}

      {/* Main Content - Full Width */}
      <div className="space-y-12">
        {/* Problem and Solution Side by Side */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={itemVariants}
        >
          <section className="bg-surface-primary p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-bold text-text-primary pb-3 mb-4 border-b border-gray-300 dark:border-gray-600">Problem</h2>
            <div className="prose prose-lg max-w-none text-text-secondary">
              <p>{pattern.content.problem}</p>
            </div>
          </section>

          <section className="bg-surface-primary p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-bold text-text-primary pb-3 mb-4 border-b border-gray-300 dark:border-gray-600">Solution</h2>
            <div className="prose prose-lg max-w-none text-text-secondary">
              <p>{pattern.content.solution}</p>
            </div>
          </section>
        </motion.div>

        {/* Products Using This Pattern */}
        <motion.div variants={itemVariants}>
          <ProductsSection pattern={pattern} />
        </motion.div>

        {/* Image Carousel for Examples */}
        {pattern.content.examples && pattern.content.examples.length > 0 && (
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-text-primary pb-3 mb-6 border-b border-gray-300 dark:border-gray-600">Real-World Examples</h2>
            <div className="bg-surface-primary rounded-lg p-2 overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
              <Carousel examples={pattern.content.examples} />
            </div>
          </motion.section>
        )}

        {/* Code Examples */}
        {pattern.content.codeExamples && pattern.content.codeExamples.length > 0 && (
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-text-primary pb-3 mb-6 border-b border-gray-300 dark:border-gray-600">Implementation</h2>

            <div className="space-y-8">
              {pattern.content.codeExamples.map((example, index) => (
                <CodeExampleBlock
                  key={index}
                  code={example.code}
                  language={example.language}
                  title={example.title}
                  description={example.description}
                  componentId={example.componentId || `${pattern.slug}-example-${index}`}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* AI Design Prompt */}
        {pattern.content.figmaPrompt && (
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-text-primary pb-3 mb-6 border-b border-gray-300 dark:border-gray-600">AI Design Prompt</h2>
            <FigmaPromptCard figmaPrompt={pattern.content.figmaPrompt} />
          </motion.section>
        )}

        {/* Implementation Guidelines and Design Considerations */}
        <motion.section variants={itemVariants}>
          <h2 className="text-2xl font-bold text-text-primary pb-3 mb-6 border-b border-gray-300 dark:border-gray-600">Guidelines & Considerations</h2>

          <div className="bg-surface-primary border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-text-primary mb-5 pb-2 border-b border-gray-300 dark:border-gray-600">
                  Implementation Guidelines
                </h3>
                <div className="space-y-4">
                  {pattern.content.guidelines.map((guideline, i) => (
                    <div key={i} className="flex items-start">
                      <div className="h-6 w-6 flex-shrink-0 bg-background-secondary border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center font-medium text-text-secondary mr-3 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-text-secondary">{guideline}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 p-6 md:p-8 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
                <h3 className="text-xl font-semibold text-text-primary mb-5 pb-2 border-b border-gray-300 dark:border-gray-600">
                  Design Considerations
                </h3>
                <div className="space-y-4">
                  {pattern.content.considerations.map((consideration, i) => (
                    <div key={i} className="flex items-start">
                      <div className="h-6 w-6 flex-shrink-0 bg-background-secondary border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center font-medium text-text-secondary mr-3 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-text-secondary">{consideration}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Newsletter Signup */}
        <motion.section variants={itemVariants}>
          <div className="bg-surface-primary border border-gray-200 dark:border-gray-700 rounded-2xl p-8 md:p-12 shadow-card">
            <InlineNewsletterSignup
              variant="pattern-detail"
              customHeading="Want More Patterns Like This?"
              customSubheading="Get 6 essential AI design patterns (free PDF) + weekly AI/UX analysis"
            />
          </div>
        </motion.section>

        {/* Related Patterns */}
        <motion.section variants={itemVariants}>
          <h2 className="text-2xl font-bold text-text-primary pb-3 mb-6 border-b border-gray-300 dark:border-gray-600">Related Patterns</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pattern.content.relatedPatterns.map((related, i) => (
              <Link
                key={i}
                href={`/patterns/${related.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-surface-primary rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-background-secondary transition-colors"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary mr-3">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                  <span className="text-lg font-medium text-text-secondary">{related}</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Previous/Next Pattern Navigation */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-8 mt-12"
          variants={itemVariants}
        >
          {previousPattern ? (
            <Link
              href={`/patterns/${previousPattern.slug}`}
              className="flex items-center text-text-secondary hover:text-text-primary group mb-4 sm:mb-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>
                <span className="block text-sm text-text-tertiary">Previous Pattern</span>
                <span className="font-medium">{previousPattern.title}</span>
              </span>
            </Link>
          ) : <div />}

          <Link href="/" className="px-5 py-2 bg-gradient-to-r from-pink-500/10 to-violet-500/10 text-text-secondary rounded-full hover:from-pink-500/20 hover:to-violet-500/20 transition-colors font-medium border border-gray-200 dark:border-gray-700">
            View All Patterns
          </Link>

          {nextPattern ? (
            <Link
              href={`/patterns/${nextPattern.slug}`}
              className="flex items-center text-text-secondary hover:text-text-primary text-right group mt-4 sm:mt-0"
            >
              <span>
                <span className="block text-sm text-text-tertiary">Next Pattern</span>
                <span className="font-medium">{nextPattern.title}</span>
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:transform group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ) : <div />}
        </motion.div>

        {/* Author Footer */}
        <AuthorFooter />
      </div>

      {/* Smart Handbook Prompt - appears after viewing 4 patterns */}
      <SmartHandbookPrompt
        isOpen={showPrompt}
        onClose={dismissPrompt}
        onSuccess={markHandbookDownloaded}
        viewCount={viewCount}
      />
    </motion.main>
  );
}
