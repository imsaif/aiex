'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import OptimizedMedia from '../ui/OptimizedMedia';
import patterns from '../../data/patterns';

export default function SmartSuggestions() {
  // Show popular patterns from different categories
  const suggestions = patterns.slice(0, 4);

  if (suggestions.length === 0) {
    return null;
  }

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
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center md:text-left tracking-tight relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Popular Patterns</span>
              <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 w-full"></div>
            </h2>
          </div>
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
                  </div>

                  {/* Pattern Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {pattern.title}
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {pattern.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}