'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useFavorites } from '../../hooks/useFavorites';
import patterns from '../../data/patterns';
import OptimizedMedia from '../../components/ui/OptimizedMedia';
import FavoriteButton from '../../components/ui/FavoriteButton';
import Navbar from '../../components/layout/Navbar';
import { Pattern } from '../../types';

export default function FavoritesPage() {
  const { favorites, isLoading, favoriteCount } = useFavorites();

  // Get the actual pattern objects for favorited IDs
  const favoritePatterns = favorites
    .map(id => patterns.find(pattern => pattern.id === id))
    .filter((pattern): pattern is Pattern => pattern !== undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16 py-16">
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Favorite Patterns
          </h1>
          <p className="text-xl text-gray-600">
            {favoriteCount === 0 
              ? "You haven't favorited any patterns yet. Start exploring to build your collection!"
              : `${favoriteCount} pattern${favoriteCount !== 1 ? 's' : ''} saved for easy access`
            }
          </p>
        </motion.div>

        {/* Empty State */}
        {favoriteCount === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No favorites yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Discover patterns that inspire you and click the heart icon to save them here for quick access.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Explore Patterns
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        )}

        {/* Favorites Grid */}
        {favoriteCount > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {favoritePatterns.map((pattern, index) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/patterns/${pattern.id}`}>
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:border-purple-200">
                    {/* Pattern Image */}
                    <div className="relative h-48 overflow-hidden">
                      <OptimizedMedia
                        src={pattern.thumbnail || '/images/placeholder.jpg'}
                        alt={pattern.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        width={400}
                        height={192}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Favorite Button */}
                      <div className="absolute top-3 right-3">
                        <FavoriteButton
                          patternId={pattern.id}
                          size="md"
                          className="bg-white/90 hover:bg-white shadow-sm backdrop-blur-sm"
                        />
                      </div>
                    </div>

                    {/* Pattern Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {pattern.category}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {pattern.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {pattern.description}
                      </p>

                      {/* Tags */}
                      {pattern.tags && pattern.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {pattern.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag}
                              className="inline-block px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                          {pattern.tags.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs text-gray-400 bg-gray-50 rounded-md">
                              +{pattern.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Quick Actions */}
        {favoriteCount > 0 && (
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Find More Patterns
              </Link>
              
              <button 
                onClick={() => {
                  // Future: Add export favorites functionality
                  alert('Export functionality coming soon!');
                }}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Favorites
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}