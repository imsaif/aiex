'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { smartSearch, exampleQueries, SmartSearchResult } from '../../utils/smartSearch';
import { Pattern } from '../../types';
import { useInteractionTracking } from '../../hooks/usePageTracking';

interface SmartSearchChatProps {
  className?: string;
  onPatternSelect?: (pattern: Pattern) => void;
}

export default function SmartSearchChat({ className = "", onPatternSelect }: SmartSearchChatProps) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SmartSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { trackSearch } = useInteractionTracking();

  // Perform search when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (query.trim().length >= 3) {
        setIsLoading(true);
        try {
          const searchResult = await smartSearch(query);
          setResult(searchResult);
          setShowResults(true);
          
          // Track search analytics
          trackSearch(query, searchResult.patterns.length);
        } catch (error) {
          console.error('Search error:', error);
        }
        setIsLoading(false);
      } else {
        setResult(null);
        setShowResults(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [query, trackSearch]);

  // Handle click outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExampleClick = (exampleQuery: string, index: number) => {
    setQuery(exampleQuery);
    setSelectedExampleIndex(index);
    inputRef.current?.focus();
  };

  const handlePatternClick = (pattern: Pattern) => {
    setShowResults(false);
    if (onPatternSelect) {
      onPatternSelect(pattern);
    } else {
      router.push(`/patterns/${pattern.slug}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already triggered by the useEffect
    if (result && result.patterns.length > 0) {
      handlePatternClick(result.patterns[0]);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResult(null);
    setShowResults(false);
    setSelectedExampleIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className={`relative w-full max-w-2xl mx-auto ${className}`}>
      {/* Search Input */}
      <motion.form 
        onSubmit={handleSubmit}
        className="relative mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you trying to build?"
            className="w-full px-6 py-4 text-text-primary bg-surface-primary border-2 border-primary rounded-full hover:border-secondary focus:outline-none focus:ring-2 focus:ring-ring-focus focus:border-transparent shadow-lg transition-all duration-200 text-lg"
          />
          
          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-ring-focus border-t-transparent"></div>
            </div>
          )}
        </div>
      </motion.form>

      {/* Example Queries */}
      {!query && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-text-secondary text-sm mb-3">Try asking about:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example, index)}
                className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 ${
                  selectedExampleIndex === index
                    ? 'bg-blue-500 text-white border-interactive'
                    : 'bg-surface-primary text-text-secondary border-primary hover:border-secondary hover:text-accent-primary'
                }`}
              >
                {example}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search Results */}
      <AnimatePresence>
        {showResults && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-surface-primary border border-primary rounded-2xl shadow-xl p-6 space-y-4"
          >
            {/* Response Header */}
            <div className="mb-4">
              <p className="text-text-primary font-medium mb-2">
                {result.patterns.length > 0 
                  ? `Found ${result.patterns.length} pattern${result.patterns.length > 1 ? 's' : ''} that can help:`
                  : "Try these related patterns:"
                }
              </p>
              {result.suggestion && (
                <p className="text-text-secondary text-sm mb-2">{result.suggestion}</p>
              )}
            </div>

            {/* Pattern Results */}
            {result.patterns.length > 0 ? (
              <div className="space-y-3">
                {result.patterns.slice(0, 3).map((pattern, index) => (
                  <motion.button
                    key={pattern.id}
                    onClick={() => handlePatternClick(pattern)}
                    className="w-full text-left p-4 bg-background-secondary hover:bg-blue-50 rounded-xl transition-all duration-200 border border-transparent hover:border-secondary group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 font-medium text-sm">
                          {pattern.category.split(' ').map(word => word[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                          {pattern.title}
                        </h4>
                        <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                          {pattern.description}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-secondary text-text-secondary group-hover:bg-accent-primary/10 group-hover:text-accent-primary transition-colors">
                            {pattern.category}
                          </span>
                          {result.confidence === 'high' && index === 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Perfect Match
                            </span>
                          )}
                        </div>
                      </div>
                      <svg 
                        className="w-5 h-5 text-text-tertiary group-hover:text-accent-primary transition-colors" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </motion.button>
                ))}
                
                {result.patterns.length > 3 && (
                  <p className="text-center text-text-tertiary text-sm">
                    And {result.patterns.length - 3} more pattern{result.patterns.length - 3 > 1 ? 's' : ''}...
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-text-tertiary">
                <svg className="w-12 h-12 mx-auto mb-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm">Try describing your specific challenge or use case</p>
                <p className="text-xs mt-1">Example: &quot;users don&apos;t trust my AI recommendations&quot;</p>
              </div>
            )}

            {/* Matched Keywords (for debugging - can remove later) */}
            {result.matchedKeywords.length > 0 && (
              <div className="text-xs text-text-tertiary border-t border-primary pt-3">
                Matched: {result.matchedKeywords.join(', ')}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}