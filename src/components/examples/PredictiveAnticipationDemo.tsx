'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, BoltIcon } from '@heroicons/react/24/outline';

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
      });

      // Pre-load items in that category
      setContents(prev => prev.map(item => ({
        ...item,
        isPreloaded: item.category === categoryName && !viewedIds.includes(item.id)
      })));

      // Show notification
      setNotification(`AI detected your preference for ${categoryName} content.`);
      setTimeout(() => setNotification(''), 4000);
    }
  }, [viewedIds]); // eslint-disable-line react-hooks/exhaustive-deps

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
    <div className="max-w-5xl mx-auto p-6 space-y-5">
      {/* Header with Reset Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Predictive content loading</h2>
          <p className="text-sm text-text-secondary mt-1">
            Watch a few movies in one genre. The system notices, then prepares more of that genre so it loads instantly.
          </p>
        </div>
        {viewedIds.length > 0 && (
          <button
            onClick={handleReset}
            className="flex-shrink-0 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 rounded-card bg-accent-subtle border border-border-primary px-4 py-3 text-sm text-text-primary"
          >
            <SparklesIcon className="h-4 w-4 text-accent-primary flex-shrink-0" aria-hidden="true" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pattern Detection Panel */}
      <AnimatePresence>
        {detectedPattern && (
          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="rounded-card bg-accent-subtle border border-accent-primary p-5"
          >
            <div className="flex items-start gap-3">
              <SparklesIcon className="h-6 w-6 text-accent-primary flex-shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <p className="font-semibold text-text-primary">Pattern detected</p>
                <p className="text-text-secondary mt-1 text-sm">
                  You&apos;ve viewed <span className="font-bold text-accent-primary">{detectedPattern.count}</span> {detectedPattern.category} movies ({detectedPattern.percentage}% of your views).
                </p>
                <p className="text-sm text-text-tertiary mt-2">
                  Preparing more {detectedPattern.category} content so it loads instantly. Nothing plays on its own, you still choose.
                </p>
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
          className="rounded-card bg-background-secondary p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-3">Your viewing pattern</p>
          <div className="grid grid-cols-4 gap-3">
            {categories.map(category => (
              <div key={category} className="text-center">
                <div className="text-2xl font-bold text-text-primary">{preferences[category] || 0}</div>
                <p className="text-xs text-text-tertiary capitalize">{category}</p>
                {preferences[category] && (
                  <div className="w-full bg-surface-primary rounded-full h-1 mt-2 overflow-hidden">
                    <div
                      className={`h-1 rounded-full transition-all ${
                        detectedPattern?.category === category ? 'bg-accent-primary' : 'bg-border-secondary'
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
              <SparklesIcon className="h-4 w-4 text-accent-primary" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
                Recommended for you
              </h3>
              <span className="text-xs font-semibold text-accent-primary bg-accent-subtle px-2 py-0.5 rounded-pill">
                AI pick
              </span>
            </div>
            <p className="text-xs text-text-tertiary">
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
                  className="p-4 rounded-card border border-accent-primary bg-accent-subtle text-left transition-all relative overflow-hidden group"
                  whileHover={isLoading === item.id ? {} : { y: -4 }}
                  whileTap={isLoading === item.id ? {} : { scale: 0.96 }}
                >
                  {/* Shimmer animation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-surface-primary/60 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-text-primary text-sm line-clamp-2">{item.title}</p>
                        <span className="inline-block text-xs text-text-secondary capitalize bg-surface-primary px-2 py-0.5 rounded-pill mt-2">
                          {item.category}
                        </span>
                      </div>
                      {isLoading === item.id ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-border-secondary border-t-accent-primary rounded-full flex-shrink-0 mt-1"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <BoltIcon className="h-5 w-5 text-accent-primary flex-shrink-0 mt-1" aria-hidden="true" />
                      )}
                    </div>
                    <p className="text-xs text-accent-primary font-semibold mt-2">
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
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
            {regularContent.length > 0
              ? `Browse more (${regularContent.length}/${contents.length - preloadedContent.length})`
              : preloadedContent.length === 0
              ? 'All content viewed'
              : 'All browsable content viewed'}
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
              className={`p-3 rounded-card border text-left transition-all relative overflow-hidden group ${
                item.isPreloaded
                  ? 'bg-accent-subtle border-accent-primary'
                  : 'bg-surface-primary border-border-primary hover:border-border-secondary'
              } ${isLoading === item.id ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
              whileHover={isLoading === item.id ? {} : { y: -2 }}
              whileTap={isLoading === item.id ? {} : { scale: 0.98 }}
            >
              {/* Shimmer animation for pre-loaded items */}
              {item.isPreloaded && !viewedIds.includes(item.id) && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-surface-primary/60 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              )}

              <div className="relative">
                <p className="font-medium text-text-primary text-sm line-clamp-2">{item.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-text-secondary capitalize bg-background-secondary px-2 py-1 rounded-pill">
                    {item.category}
                  </span>
                  {isLoading === item.id ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-border-secondary border-t-accent-primary rounded-full flex-shrink-0"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : item.isPreloaded ? (
                    <BoltIcon className="h-4 w-4 text-accent-primary flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <span className="text-xs text-text-tertiary">Pending</span>
                  )}
                </div>
                {!viewedIds.includes(item.id) && (
                  <p className="text-xs text-text-tertiary mt-2">
                    {item.isPreloaded ? 'Instant' : '~1.8s'}
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
            className="text-center py-12 text-text-secondary"
          >
            <p className="text-lg font-semibold mb-2">You&apos;ve viewed all content.</p>
            <p className="text-sm mb-4">Reset to explore a different pattern.</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-accent-primary text-white rounded-input text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Start over
            </button>
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      <div className="rounded-card bg-accent-subtle border border-border-primary p-4 space-y-2">
        <p className="text-sm font-semibold text-text-primary">How it works</p>
        <ul className="text-sm text-text-secondary space-y-1 ml-4 list-disc">
          <li>View 3+ movies from one genre and the system detects the pattern (it waits for a real signal, not one click).</li>
          <li>It <em>prepares</em> more of that genre so it loads instantly, but never plays anything on its own.</li>
          <li>Prepared content loads instantly instead of the usual ~1.8s. A wrong guess just sits there, ignored, at no cost.</li>
          <li>That is the line this pattern walks: prepare the next step, let the user take it. The trap is the silent autopilot.</li>
        </ul>
      </div>
    </div>
  );
}
