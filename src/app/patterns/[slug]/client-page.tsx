'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Pattern } from '@/types';

// Lazy load heavy components to reduce initial bundle size
const Carousel = dynamic(() => import('@/components/ui/Carousel'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>,
  ssr: false
});

const CodeExampleBlock = dynamic(() => import('@/components/ui/CodeExampleBlock'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-40 rounded-lg"></div>,
  ssr: false
});

interface ClientPageProps {
  pattern: Pattern;
  previousPattern: Pattern | null;
  nextPattern: Pattern | null;
}

export default function ClientPage({ pattern, previousPattern, nextPattern }: ClientPageProps) {
  // Minimal animations - simplified for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } }
  };

  return (
    <motion.main 
      className="max-w-6xl mx-auto py-8 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Breadcrumb Navigation */}
      <motion.nav 
        className="flex items-center space-x-2 text-sm text-gray-500 mb-6"
        variants={itemVariants}
      >
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span>/</span>
        <Link href="/patterns" className="hover:text-gray-800">Patterns</Link>
        <span>/</span>
        <span className="text-gray-700">{pattern.title}</span>
      </motion.nav>

      {/* Pattern Header */}
      <motion.div className="mb-10" variants={itemVariants}>
        <h1 className="text-5xl font-bold mt-3 mb-6 text-gray-900">{pattern.title}</h1>
        <div className="text-xl text-gray-600 leading-relaxed">
          {pattern.description}
        </div>
      </motion.div>
      
      {/* Main Content - Full Width */}
      <div className="space-y-12">
        {/* Problem and Solution Side by Side */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={itemVariants}
        >
          <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-b from-pink-500 to-violet-500 w-1 h-8 mr-3 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">Problem</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>{pattern.content.problem}</p>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-b from-pink-500 to-violet-500 w-1 h-8 mr-3 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">Solution</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>{pattern.content.solution}</p>
            </div>
          </section>
        </motion.div>
        
        {/* Image Carousel for Examples */}
        {pattern.content.examples && pattern.content.examples.length > 0 && (
          <motion.section variants={itemVariants}>
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-b from-pink-500 to-violet-500 w-1 h-8 mr-3 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">Examples in the Wild</h2>
            </div>
            <div className="bg-white rounded-lg p-2 overflow-hidden border border-gray-200 shadow-sm">
              <Carousel examples={pattern.content.examples} />
            </div>
          </motion.section>
        )}
        
        {/* Code Examples */}
        {pattern.content.codeExamples && pattern.content.codeExamples.length > 0 && (
          <motion.section variants={itemVariants}>
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-b from-pink-500 to-violet-500 w-1 h-8 mr-3 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">Interactive Code Example</h2>
            </div>
            
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
        
        {/* Implementation Guidelines and Design Considerations */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-b from-pink-500 to-violet-500 w-1 h-8 mr-3 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Implementation & Considerations</h2>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-100">
                  Implementation Guidelines
                </h3>
                <div className="space-y-4">
                  {pattern.content.guidelines.map((guideline, i) => (
                    <div key={i} className="flex items-start">
                      <div className="h-6 w-6 flex-shrink-0 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center font-medium text-gray-700 mr-3 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-gray-700">{guideline}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 p-6 md:p-8 bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-100">
                  Design Considerations
                </h3>
                <div className="space-y-4">
                  {pattern.content.considerations.map((consideration, i) => (
                    <div key={i} className="flex items-start">
                      <div className="h-6 w-6 flex-shrink-0 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center font-medium text-gray-700 mr-3 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-gray-700">{consideration}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* Related Patterns */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-b from-pink-500 to-violet-500 w-1 h-8 mr-3 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Related Patterns</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pattern.content.relatedPatterns.map((related, i) => (
              <Link 
                key={i} 
                href={`/patterns/${related.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mr-3">
                    <line x1="7" y1="17" x2="17" y2="7"/>
                    <polyline points="7 7 17 7 17 17"/>
                  </svg>
                  <span className="text-lg font-medium text-gray-700">{related}</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Previous/Next Pattern Navigation */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 pt-8 mt-12"
          variants={itemVariants}
        >
          {previousPattern ? (
            <Link 
              href={`/patterns/${previousPattern.slug}`}
              className="flex items-center text-gray-600 hover:text-gray-800 group mb-4 sm:mb-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>
                <span className="block text-sm text-gray-500">Previous Pattern</span>
                <span className="font-medium">{previousPattern.title}</span>
              </span>
            </Link>
          ) : <div />}
          
          <Link href="/patterns" className="px-5 py-2 bg-gradient-to-r from-pink-500/10 to-violet-500/10 text-gray-700 rounded-full hover:from-pink-500/20 hover:to-violet-500/20 transition-colors font-medium border border-gray-200">
            View All Patterns
          </Link>
          
          {nextPattern ? (
            <Link 
              href={`/patterns/${nextPattern.slug}`}
              className="flex items-center text-gray-600 hover:text-gray-800 text-right group mt-4 sm:mt-0"
            >
              <span>
                <span className="block text-sm text-gray-500">Next Pattern</span>
                <span className="font-medium">{nextPattern.title}</span>
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:transform group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          ) : <div />}
        </motion.div>
      </div>
    </motion.main>
  );
} 