'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRecentPatterns } from '../../hooks/useRecentPatterns';
import { getRelatedPatterns } from '../../utils/search';
import OptimizedMedia from '../ui/OptimizedMedia';
import FavoriteButton from '../ui/FavoriteButton';
import patterns from '../../data/patterns';

export default function SmartSuggestions() {
  const { recentPatterns } = useRecentPatterns();

  // Get suggestions based on recently viewed patterns
  const getSuggestions = () => {
    if (recentPatterns.length === 0) {
      // If no recent patterns, show popular patterns from different categories
      return patterns.slice(0, 4);
    }

    // Get related patterns for the most recent pattern
    const mostRecentPattern = recentPatterns[0]?.pattern;
    if (!mostRecentPattern) return patterns.slice(0, 4);

    const related = getRelatedPatterns(mostRecentPattern, 6);
    
    // If we don't have enough related patterns, supplement with popular ones
    if (related.length < 4) {
      const additionalPatterns = patterns
        .filter(p => !related.find(r => r.id === p.id) && p.id !== mostRecentPattern.id)
        .slice(0, 4 - related.length);
      return [...related, ...additionalPatterns];
    }

    return related.slice(0, 4);
  };

  const suggestions = getSuggestions();

  if (suggestions.length === 0) {
    return null;
  }

  const isBasedOnRecent = recentPatterns.length > 0;
  const basePattern = isBasedOnRecent ? recentPatterns[0]?.pattern : null;

  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isBasedOnRecent ? 'Recommended for You' : 'Popular Patterns'}
            </h2>
            <p className="text-gray-600">
              {isBasedOnRecent && basePattern
                ? `Based on your interest in ${basePattern.title}`
                : 'Discover the most useful AI design patterns'
              }
            </p>
          </div>
          
          {isBasedOnRecent && (
            <div className="flex items-center text-sm text-blue-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Smart suggestions</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {suggestions.map((pattern, index) => (
            <motion.div
              key={pattern.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={`/patterns/${pattern.slug}`}>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group-hover:border-gray-300">
                  {/* Pattern Image */}
                  <div className="relative h-32 overflow-hidden bg-gray-50">
                    <OptimizedMedia
                      src={pattern.thumbnail || '/images/placeholder.jpg'}
                      alt={pattern.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      width={300}
                      height={128}
                    />
                    
                    {/* Favorite Button */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FavoriteButton
                        patternId={pattern.id}
                        size="sm"
                        className="bg-white/90 hover:bg-white shadow-sm backdrop-blur-sm"
                      />
                    </div>

                    {/* Suggestion reason */}
                    <div className="absolute top-2 left-2">
                      {isBasedOnRecent && basePattern ? (
                        <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {pattern.category === basePattern.category ? 'Similar' : 'Related'}
                        </div>
                      ) : (
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Popular
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pattern Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {pattern.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {pattern.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {pattern.category}
                      </span>
                      
                      {/* Show tag overlap if suggesting based on recent patterns */}
                      {isBasedOnRecent && basePattern && pattern.tags && basePattern.tags && (
                        (() => {
                          const commonTags = basePattern.tags.filter(tag => 
                            pattern.tags?.includes(tag)
                          );
                          return commonTags.length > 0 ? (
                            <div className="flex items-center text-xs text-blue-600">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              <span>{commonTags.length} common</span>
                            </div>
                          ) : null;
                        })()
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Learn more about suggestions */}
        {isBasedOnRecent && (
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-gray-500">
              Suggestions improve as you explore more patterns. 
              <Link href="/patterns" className="text-blue-600 hover:text-blue-700 ml-1 font-medium">
                Browse all patterns
              </Link>
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}