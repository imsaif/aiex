'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRecentPatterns } from '../../hooks/useRecentPatterns';
import OptimizedMedia from '../ui/OptimizedMedia';
import FavoriteButton from '../ui/FavoriteButton';

export default function RecentPatterns() {
  const { recentPatterns, isLoading, clearRecentPatterns } = useRecentPatterns();

  // Don't show section if no recent patterns and not loading
  if (!isLoading && recentPatterns.length === 0) {
    return null;
  }

  // Show first 4 recent patterns
  const displayPatterns = recentPatterns.slice(0, 4);

  return (
    <section className="py-12">
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Recently Viewed
          </h2>
          <p className="text-gray-600">
            Pick up where you left off
          </p>
        </div>
        
        {recentPatterns.length > 0 && (
          <div className="flex items-center space-x-4">
            <Link 
              href="/recent"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </Link>
            <button
              onClick={clearRecentPatterns}
              className="text-sm text-gray-500 hover:text-gray-700"
              title="Clear recent patterns"
            >
              Clear
            </button>
          </div>
        )}
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPatterns.map((entry, index) => (
            <motion.div
              key={entry.pattern.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={`/patterns/${entry.pattern.id}`}>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group-hover:border-gray-300">
                  {/* Pattern Image */}
                  <div className="relative h-32 overflow-hidden bg-gray-50">
                    <OptimizedMedia
                      src={entry.pattern.thumbnail || '/images/placeholder.jpg'}
                      alt={entry.pattern.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      width={300}
                      height={128}
                    />
                    
                    {/* Favorite Button */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FavoriteButton
                        patternId={entry.pattern.id}
                        size="sm"
                        className="bg-white/90 hover:bg-white shadow-sm backdrop-blur-sm"
                      />
                    </div>

                    {/* Recent indicator */}
                    <div className="absolute top-2 left-2">
                      <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Recent
                      </div>
                    </div>
                  </div>

                  {/* Pattern Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {entry.pattern.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {entry.pattern.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {entry.pattern.category}
                      </span>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {entry.viewCount}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}