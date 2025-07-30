'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Pattern } from '@/types';
import { getRelatedPatterns } from '@/utils/search';
import OptimizedMedia from './OptimizedMedia';
import FavoriteButton from './FavoriteButton';

interface RelatedPatternsProps {
  currentPattern: Pattern;
  allPatterns?: Pattern[];
  limit?: number;
  className?: string;
}

export default function RelatedPatterns({ 
  currentPattern, 
  allPatterns,
  limit = 3,
  className = ''
}: RelatedPatternsProps) {
  // Get related patterns using the search utility
  const relatedPatterns = getRelatedPatterns(currentPattern, limit);

  if (relatedPatterns.length === 0) {
    return null;
  }

  return (
    <section className={`py-8 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-b from-pink-500 to-violet-500 w-1 h-8 mr-3 rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-900">Related Patterns</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPatterns.map((pattern, index) => (
            <motion.div
              key={pattern.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:border-gray-300"
            >
              <Link href={`/patterns/${pattern.slug}`}>
                <div className="relative">
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

                    {/* Pattern Category */}
                    <div className="absolute top-2 left-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                        pattern.category === currentPattern.category
                          ? 'bg-blue-500'
                          : 'bg-gray-600'
                      }`}>
                        {pattern.category === currentPattern.category ? 'Same Category' : pattern.category}
                      </div>
                    </div>
                  </div>

                  {/* Pattern Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {pattern.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {pattern.description}
                    </p>

                    {/* Tags overlap indicator */}
                    {currentPattern.tags && pattern.tags && (
                      (() => {
                        const commonTags = currentPattern.tags.filter(tag => 
                          pattern.tags?.includes(tag)
                        );
                        return commonTags.length > 0 ? (
                          <div className="mb-2">
                            <div className="flex flex-wrap gap-1">
                              {commonTags.slice(0, 2).map(tag => (
                                <span 
                                  key={tag}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                                >
                                  {tag}
                                </span>
                              ))}
                              {commonTags.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{commonTags.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        ) : null;
                      })()
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-gray-500">
                          {pattern.category === currentPattern.category ? 'Similar category' : 'Related topic'}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                        <span className="text-xs font-medium mr-1">View</span>
                        <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Show more link if there are more related patterns */}
        {relatedPatterns.length >= limit && (
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link 
              href={`/patterns?category=${currentPattern.category}`}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors font-medium"
            >
              <span>Explore {currentPattern.category} patterns</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}