'use client';

import categories from '@/data/categories';
import { Pattern, PatternSummary } from '@/types';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';

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
  relatedPatterns: PatternSummary[];
  categoryPatterns: PatternSummary[];
}

export default function ClientPage({ pattern, previousPattern, nextPattern, relatedPatterns, categoryPatterns }: ClientPageProps) {
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
    <main className="max-w-7xl mx-auto pt-20 md:pt-24 pb-8 px-6 animate-fade-in">
      {/* Previous / Next Navigation */}
      <nav className="flex items-center justify-between text-sm mb-6">
        {previousPattern ? (
          <Link
            href={`/patterns/${previousPattern.slug}`}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Previous: {previousPattern.title}</span>
          </Link>
        ) : <div />}

        {nextPattern ? (
          <Link
            href={`/patterns/${nextPattern.slug}`}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group text-right"
          >
            <span>Next: {nextPattern.title}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        ) : <div />}
      </nav>

      {/* Pattern Header */}
      <div className="mb-10">
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
      </div>

      {/* Introduction Section - SEO Enhanced */}
      {pattern.introduction && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            What is {pattern.title}?
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            {pattern.introduction}
          </p>
        </div>
      )}

      {/* Main Content - Full Width */}
      <div className="space-y-12">
        {/* Problem and Solution Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        {/* Products Using This Pattern */}
        <div>
          <ProductsSection pattern={pattern} />
        </div>

        {/* Image Carousel for Examples */}
        {pattern.content.examples && pattern.content.examples.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-text-primary pb-3 mb-6 border-b border-gray-300 dark:border-gray-600">Real-World Examples</h2>
            <div className="bg-surface-primary rounded-lg p-2 overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
              <Carousel examples={pattern.content.examples} />
            </div>
          </section>
        )}

        {/* Code Examples */}
        {pattern.content.codeExamples && pattern.content.codeExamples.length > 0 && (
          <section>
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
          </section>
        )}

        {/* AI Design Prompt */}
        {pattern.content.figmaPrompt && (
          <section>
            <h2 className="text-2xl font-bold text-text-primary pb-3 mb-6 border-b border-gray-300 dark:border-gray-600">AI Design Prompt</h2>
            <FigmaPromptCard figmaPrompt={pattern.content.figmaPrompt} />
          </section>
        )}

        {/* Implementation Guidelines and Design Considerations */}
        <section>
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
        </section>

        {/* Related Patterns - Rich Cards (moved above newsletter for better engagement) */}
        {relatedPatterns.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-text-primary pb-3 mb-6 border-b border-gray-300 dark:border-gray-600">Related Patterns</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedPatterns.map((related) => (
                <Link
                  key={related.id}
                  href={`/patterns/${related.slug}`}
                  className="group block"
                >
                  <div className="bg-surface-primary rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                    <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent-primary transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 flex-grow mb-4">
                      {related.description}
                    </p>
                    <span className="inline-block self-start px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-text-secondary">
                      {related.category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* More from Category */}
        {categoryPatterns.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-text-primary pb-3 mb-6 border-b border-gray-300 dark:border-gray-600">
              More in {pattern.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {categoryPatterns.map((catPattern) => (
                <Link
                  key={catPattern.id}
                  href={`/patterns/${catPattern.slug}`}
                  className="group block"
                >
                  <div className="bg-surface-primary rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                    <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent-primary transition-colors">
                      {catPattern.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 flex-grow">
                      {catPattern.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Signup */}
        <section>
          <div className="bg-surface-primary border border-gray-200 dark:border-gray-700 rounded-2xl p-8 md:p-12 shadow-card animate-fade-in">
            <InlineNewsletterSignup
              variant="pattern-detail"
              customHeading="Want More Patterns Like This?"
              customSubheading="Score your AI interface against 28 proven UX patterns (free PDF) + daily AI/UX news"
            />
          </div>
        </section>

        {/* Previous/Next Pattern Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-8 mt-12">
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
        </div>
      </div>

    </main>
  );
}
