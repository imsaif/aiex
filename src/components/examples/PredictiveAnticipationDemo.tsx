'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentItem {
  id: string;
  title: string;
  category: string;
  isPreloaded: boolean;
}

const INITIAL_CONTENTS: ContentItem[] = [
  // Action (5 items)
  { id: '1', title: 'The Dark Knight', category: 'action', isPreloaded: false },
  { id: '2', title: 'Mad Max: Fury Road', category: 'action', isPreloaded: false },
  { id: '3', title: 'John Wick', category: 'action', isPreloaded: false },
  { id: '4', title: 'Gladiator', category: 'action', isPreloaded: false },
  { id: '5', title: 'Top Gun: Maverick', category: 'action', isPreloaded: false },

  // Comedy (5 items)
  { id: '6', title: 'Superbad', category: 'comedy', isPreloaded: false },
  { id: '7', title: 'The Grand Budapest Hotel', category: 'comedy', isPreloaded: false },
  { id: '8', title: 'Anchorman', category: 'comedy', isPreloaded: false },
  { id: '9', title: 'Knives Out', category: 'comedy', isPreloaded: false },
  { id: '10', title: 'Barbie', category: 'comedy', isPreloaded: false },

  // Drama (5 items)
  { id: '11', title: 'The Shawshank Redemption', category: 'drama', isPreloaded: false },
  { id: '12', title: 'Forrest Gump', category: 'drama', isPreloaded: false },
  { id: '13', title: 'The Pursuit of Happyness', category: 'drama', isPreloaded: false },
  { id: '14', title: 'Parasite', category: 'drama', isPreloaded: false },
  { id: '15', title: 'Moonlight', category: 'drama', isPreloaded: false },

  // Sci-Fi (5 items)
  { id: '16', title: 'Inception', category: 'sci-fi', isPreloaded: false },
  { id: '17', title: 'Interstellar', category: 'sci-fi', isPreloaded: false },
  { id: '18', title: 'Blade Runner 2049', category: 'sci-fi', isPreloaded: false },
  { id: '19', title: 'Matrix Resurrections', category: 'sci-fi', isPreloaded: false },
  { id: '20', title: 'Dune', category: 'sci-fi', isPreloaded: false },
];

export default function PredictiveAnticipationDemo() {
  const [contents, setContents] = useState<ContentItem[]>(INITIAL_CONTENTS);
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [detectedPattern, setDetectedPattern] = useState<{
    category: string;
    count: number;
    percentage: number;
  } | null>(null);
  const [notification, setNotification] = useState<string>('');

  // Reset demo
  const handleReset = () => {
    setContents(INITIAL_CONTENTS);
    setViewedIds([]);
    setIsLoading(null);
    setDetectedPattern(null);
    setNotification('');
  };

  // Detect patterns and pre-load content
  useEffect(() => {
    // Require 3+ views before detecting pattern
    if (viewedIds.length < 3) {
      setDetectedPattern(null);
      return;
    }

    // Count category preferences
    const preferences: Record<string, number> = {};
    viewedIds.forEach(id => {
      const item = contents.find(c => c.id === id);
      if (item) {
        preferences[item.category] = (preferences[item.category] || 0) + 1;
      }
    });

    // Find most preferred category
    const mostPreferred = Object.entries(preferences).sort((a, b) => b[1] - a[1])[0];

    if (mostPreferred && mostPreferred[1] >= 3) {
      const count = mostPreferred[1];
      const categoryName = mostPreferred[0];
      setDetectedPattern({
        category: categoryName,
        count: count,
        percentage: Math.round((count / viewedIds.length) * 100)
      } as any);

      // Pre-load items in that category
      setContents(prev => prev.map(item => ({
        ...item,
        isPreloaded: item.category === categoryName && !viewedIds.includes(item.id)
      })));

      // Show notification
      setNotification(`🧠 AI detected your preference for ${categoryName} content!`);
      setTimeout(() => setNotification(''), 4000);
    }
  }, [viewedIds]);

  const handleContentClick = async (id: string) => {
    const item = contents.find(c => c.id === id);
    if (!item || isLoading) return;

    const isPreloaded = item.isPreloaded;
    const loadDelay = isPreloaded ? 0.4 : 1.8;

    setIsLoading(id);
    await new Promise(resolve => setTimeout(resolve, loadDelay * 1000));
    setIsLoading(null);

    if (!viewedIds.includes(id)) {
      setViewedIds([...viewedIds, id]);
    }
  };

  const unviewedContent = contents.filter(c => !viewedIds.includes(c.id));
  const preloadedContent = unviewedContent.filter(c => c.isPreloaded);
  const regularContent = unviewedContent.filter(c => !c.isPreloaded);

  // Calculate preferences for statistics
  const preferences: Record<string, number> = {};
  viewedIds.forEach(id => {
    const item = contents.find(c => c.id === id);
    if (item) {
      preferences[item.category] = (preferences[item.category] || 0) + 1;
    }
  });

  const categories = ['action', 'comedy', 'drama', 'sci-fi'];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header with Reset Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Predictive Content Loading</h2>
        {viewedIds.length > 0 && (
          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm font-medium transition-colors"
          >
            ↻ Reset Demo
          </motion.button>
        )}
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-purple-100 border border-purple-300 text-purple-900 px-4 py-3 rounded-lg text-sm"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pattern Detection Panel */}
      <AnimatePresence>
        {detectedPattern && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-5"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">🧠</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-lg">Pattern Detected!</p>
                <p className="text-gray-700 mt-1">
                  You've viewed <span className="font-bold text-purple-600">{detectedPattern.count}</span> {detectedPattern.category} movies ({detectedPattern.percentage}% of your views)
                </p>
                <p className="text-sm text-gray-600 mt-2">→ Pre-loading more {detectedPattern.category} content for faster loading...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Bar */}
      {viewedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-50 rounded-lg p-4"
        >
          <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Your Viewing Pattern</p>
          <div className="grid grid-cols-4 gap-3">
            {categories.map(category => (
              <div key={category} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{preferences[category] || 0}</div>
                <p className="text-xs text-gray-600 capitalize">{category}</p>
                {preferences[category] && (
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div
                      className={`h-1 rounded-full transition-all ${
                        detectedPattern?.category === category
                          ? 'bg-purple-500'
                          : 'bg-gray-400'
                      }`}
                      style={{
                        width: `${Math.min(100, (preferences[category] / viewedIds.length) * 100)}%`
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommended For You Section */}
      <AnimatePresence>
        {preloadedContent.length > 0 && detectedPattern && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Recommended For You
              </h3>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                AI Pick
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Based on your preference for <span className="font-semibold capitalize">{detectedPattern.category}</span> movies
            </p>

            <div className="grid grid-cols-2 gap-3">
              {preloadedContent.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleContentClick(item.id)}
                  disabled={isLoading === item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-lg border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 text-left transition-all relative overflow-hidden group hover:shadow-lg"
                  whileHover={isLoading === item.id ? {} : { y: -4 }}
                  whileTap={isLoading === item.id ? {} : { scale: 0.96 }}
                >
                  {/* Shimmer animation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    animate={{ x: ['−100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm line-clamp-2">{item.title}</p>
                        <span className="inline-block text-xs text-green-700 capitalize bg-green-200/50 px-2 py-0.5 rounded mt-2">
                          {item.category}
                        </span>
                      </div>
                      {isLoading === item.id ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-green-400 border-t-green-600 rounded-full flex-shrink-0 mt-1"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-green-600 text-lg flex-shrink-0 mt-1"
                        >
                          ⚡
                        </motion.div>
                      )}
                    </div>
                    <p className="text-xs text-green-700 font-semibold mt-2">
                      {isLoading === item.id ? 'Loading...' : 'Instant load'}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Grid - 3 columns */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            {regularContent.length > 0
              ? `Browse More (${regularContent.length}/${contents.length - preloadedContent.length})`
              : preloadedContent.length === 0
              ? 'All Content Viewed'
              : 'All Browsable Content Viewed'}
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {regularContent.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleContentClick(item.id)}
              disabled={isLoading === item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg border-2 text-left transition-all relative overflow-hidden group ${
                item.isPreloaded
                  ? 'bg-green-50 border-green-400 hover:bg-green-100 shadow-md'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              } ${isLoading === item.id ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
              whileHover={isLoading === item.id ? {} : { y: -2 }}
              whileTap={isLoading === item.id ? {} : { scale: 0.98 }}
            >
              {/* Shimmer animation for pre-loaded items */}
              {item.isPreloaded && !viewedIds.includes(item.id) && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ['−100%', '100%'] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              )}

              <div className="relative z-10">
                <p className="font-medium text-gray-900 text-sm line-clamp-2">{item.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-600 capitalize bg-gray-100 px-2 py-1 rounded">
                    {item.category}
                  </span>
                  {isLoading === item.id ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-amber-400 border-t-amber-600 rounded-full flex-shrink-0"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : item.isPreloaded ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-600 text-sm font-semibold"
                    >
                      ✓
                    </motion.div>
                  ) : (
                    <span className="text-xs text-gray-400">Pending</span>
                  )}
                </div>
                {!viewedIds.includes(item.id) && (
                  <p className="text-xs text-gray-500 mt-2">
                    {item.isPreloaded ? '⚡ Instant' : '⏱️ ~1.8s'}
                  </p>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {regularContent.length === 0 && preloadedContent.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            <p className="text-lg font-semibold mb-2">You've viewed all content! 🎉</p>
            <p className="text-sm mb-4">Try the reset button to explore different patterns.</p>
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              ↻ Start Over
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <p className="text-sm font-semibold text-blue-900">How it works:</p>
        <ul className="text-sm text-blue-900 space-y-1 ml-4 list-disc">
          <li>View 3+ movies from the same genre to trigger the AI detection</li>
          <li>Watch as the system identifies your preference and pre-loads similar content</li>
          <li>Pre-loaded content loads instantly (⚡) instead of the normal ~1.8 seconds</li>
          <li>Click "Reset Demo" anytime to try a different pattern</li>
        </ul>
      </div>
    </div>
  );
}
