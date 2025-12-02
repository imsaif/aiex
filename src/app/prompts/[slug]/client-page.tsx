'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Pattern } from '@/types';
import categories from '@/data/categories';
import { getRelatedPrompts } from '@/data/utils/prompt-utils';
import PromptCard from '@/components/ui/PromptCard';

// Lazy load FigmaPromptCard
const FigmaPromptCard = dynamic(() => import('@/components/ui/FigmaPromptCard'), {
  loading: () => <div className="animate-pulse bg-background-secondary h-64 rounded-lg"></div>,
  ssr: false,
});

interface ClientPageProps {
  pattern: Pattern;
  previousPattern: Pattern | null;
  nextPattern: Pattern | null;
}

export default function ClientPage({ pattern, previousPattern, nextPattern }: ClientPageProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } },
  };

  // Get category badge classes
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

  const category = categories.find(c => c.title === pattern.category);
  const relatedPrompts = getRelatedPrompts(pattern);

  return (
    <motion.div
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
          href="/prompts"
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
          <span>Back to All Prompts</span>
        </Link>

        {nextPattern && (
          <Link
            href={`/prompts/${nextPattern.slug}`}
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
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryClasses(category?.color)}`}>
            {pattern.category}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold mt-6 mb-4 text-text-primary">{pattern.title}</h1>
        <div className="text-lg text-text-secondary leading-relaxed">
          {pattern.description}
        </div>
      </motion.div>

      {/* Introduction Section */}
      {pattern.introduction && (
        <motion.div className="mb-10" variants={itemVariants}>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            What is {pattern.title}?
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            {pattern.introduction}
          </p>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="space-y-12">
        {/* Example Screenshot */}
        {pattern.content.examples && pattern.content.examples.length > 0 && (
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-text-primary pb-3 mb-6 border-b border-gray-300 dark:border-gray-600">
              Example: {pattern.content.examples[0].title}
            </h2>
            <div className="bg-surface-primary rounded-2xl border border-gray-200 dark:border-gray-700 shadow-card overflow-hidden">
              <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800">
                <Image
                  src={pattern.content.examples[0].image || pattern.content.examples[0].imagePath || ''}
                  alt={pattern.content.examples[0].altText || pattern.content.examples[0].description}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
              <div className="p-6">
                <p className="text-text-secondary leading-relaxed">
                  {pattern.content.examples[0].description}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* AI Design Prompt */}
        {pattern.content.figmaPrompt && (
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-text-primary pb-3 mb-6 border-b border-gray-300 dark:border-gray-600">
              AI Design Prompt
            </h2>
            <FigmaPromptCard figmaPrompt={pattern.content.figmaPrompt} />
          </motion.section>
        )}

        {/* Link to Full Pattern */}
        <motion.section variants={itemVariants}>
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Want to learn more about this pattern?
            </h3>
            <p className="text-text-secondary mb-4">
              Explore the full pattern with real-world examples, implementation guidelines, and code samples.
            </p>
            <Link
              href={`/patterns/${pattern.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-primary hover:bg-accent-hover text-white rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all font-medium"
            >
              View Full Pattern
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </motion.section>

        {/* Related Prompts */}
        {relatedPrompts.length > 0 && (
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-text-primary pb-3 mb-6 border-b border-gray-300 dark:border-gray-600">
              Related Prompts from {pattern.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedPrompts.map((relatedPattern, index) => (
                <PromptCard key={relatedPattern.id} pattern={relatedPattern} index={index} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Previous/Next Pattern Navigation */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-8 mt-12"
          variants={itemVariants}
        >
          {previousPattern ? (
            <Link
              href={`/prompts/${previousPattern.slug}`}
              className="flex items-center text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-100 group mb-4 sm:mb-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>
                <span className="block text-sm text-text-tertiary">Previous Prompt</span>
                <span className="font-medium">{previousPattern.title}</span>
              </span>
            </Link>
          ) : <div />}

          <Link href="/prompts" className="px-5 py-2 bg-gradient-to-r from-pink-500/10 to-violet-500/10 text-text-secondary rounded-full hover:from-pink-500/20 hover:to-violet-500/20 transition-colors font-medium border border-gray-200 dark:border-gray-700">
            View All Prompts
          </Link>

          {nextPattern ? (
            <Link
              href={`/prompts/${nextPattern.slug}`}
              className="flex items-center text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-100 text-right group mt-4 sm:mt-0"
            >
              <span>
                <span className="block text-sm text-text-tertiary">Next Prompt</span>
                <span className="font-medium">{nextPattern.title}</span>
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:transform group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ) : <div />}
        </motion.div>
      </div>

    </motion.div>
  );
}
