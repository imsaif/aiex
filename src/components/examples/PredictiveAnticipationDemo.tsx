'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ContentItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  isPreloaded: boolean;
  isPredicted: boolean;
}

export default function PredictiveAnticipationDemo() {
  const [contents, setContents] = useState<ContentItem[]>([
    { id: '1', title: 'AI in Design Systems', category: 'tech', duration: '8 min', isPreloaded: false, isPredicted: false },
    { id: '2', title: 'Future of UI/UX', category: 'design', duration: '12 min', isPreloaded: false, isPredicted: false },
    { id: '3', title: 'React Performance Tips', category: 'tech', duration: '6 min', isPreloaded: false, isPredicted: false },
    { id: '4', title: 'Color Theory Basics', category: 'design', duration: '10 min', isPreloaded: false, isPredicted: false },
    { id: '5', title: 'TypeScript Best Practices', category: 'tech', duration: '15 min', isPreloaded: false, isPredicted: false },
    { id: '6', title: 'Design Psychology', category: 'design', duration: '9 min', isPreloaded: false, isPredicted: false },
  ]);

  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [categoryPreferences, setCategoryPreferences] = useState<Record<string, number>>({});
  const [predictionConfidence, setPredictionConfidence] = useState(0);

  // Predict and pre-load content based on viewing patterns
  useEffect(() => {
    if (viewedIds.length < 2) {
      setPredictionConfidence(0);
      return;
    }

    // Analyze category preferences
    const preferences: Record<string, number> = {};
    viewedIds.forEach(id => {
      const item = contents.find(c => c.id === id);
      if (item) {
        preferences[item.category] = (preferences[item.category] || 0) + 1;
      }
    });

    setCategoryPreferences(preferences);

    // Determine most preferred category
    const mostPreferred = Object.entries(preferences).sort((a, b) => b[1] - a[1])[0];

    if (mostPreferred) {
      const confidence = (mostPreferred[1] / viewedIds.length) * 100;
      setPredictionConfidence(Math.min(confidence, 95));

      // Pre-load next content in preferred category
      setContents(prev => prev.map(item => {
        const shouldPreload =
          item.category === mostPreferred[0] &&
          !viewedIds.includes(item.id) &&
          item.id !== currentItemId;

        return {
          ...item,
          isPreloaded: shouldPreload,
          isPredicted: shouldPreload
        };
      }));
    }
  }, [viewedIds, currentItemId]);

  const handleContentClick = (id: string) => {
    if (!viewedIds.includes(id)) {
      setViewedIds([...viewedIds, id]);
    }
    setCurrentItemId(id);
  };

  const getUnviewedContent = () => contents.filter(c => !viewedIds.includes(c.id));
  const getViewedCount = viewedIds.length;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Predictive Content Library</h2>
        <p className="text-gray-600">Watch as AI learns your preferences and pre-loads content</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Currently Viewing */}
          {currentItemId && (
            <motion.div
              className="bg-white rounded-lg border-2 border-blue-500 p-6 shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-sm font-semibold text-blue-600">NOW VIEWING</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    {contents.find(c => c.id === currentItemId)?.title}
                  </h3>
                </div>
                <div className="text-4xl">▶️</div>
              </div>
              <p className="text-sm text-gray-600">
                {contents.find(c => c.id === currentItemId)?.duration} •
                <span className="ml-2 capitalize">
                  {contents.find(c => c.id === currentItemId)?.category}
                </span>
              </p>
            </motion.div>
          )}

          {/* Content Grid */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
              Available Content ({getUnviewedContent().length} new)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {getUnviewedContent().map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleContentClick(item.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    item.isPreloaded
                      ? 'bg-green-50 border-green-300 hover:bg-green-100'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm line-clamp-2">{item.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-500">{item.duration}</span>
                      </div>
                    </div>
                    {item.isPreloaded && (
                      <motion.div
                        className="ml-2 flex-shrink-0"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {getUnviewedContent().length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">You've viewed all content!</p>
              </div>
            )}
          </div>
        </div>

        {/* Behavioral Learning Panel */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200 p-6 shadow-md sticky top-6">
            <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wider mb-4">
              🧠 AI Learning System
            </h3>

            {/* Prediction Confidence */}
            <div className="mb-6 p-4 bg-white rounded-lg border border-purple-200">
              <div className="text-xs font-semibold text-gray-600 mb-2">PREDICTION CONFIDENCE</div>
              <div className="text-2xl font-bold text-purple-600 mb-2">{Math.round(predictionConfidence)}%</div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-400 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${predictionConfidence}%` }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </div>
            </div>

            {/* Viewing Stats */}
            <div className="mb-6 p-4 bg-white rounded-lg border border-purple-200">
              <div className="text-xs font-semibold text-gray-600 mb-3">VIEWING ACTIVITY</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">Items Viewed:</span>
                  <span className="font-bold text-gray-900">{getViewedCount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">Pre-loaded:</span>
                  <span className="font-bold text-green-600">
                    {contents.filter(c => c.isPreloaded).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Detected Preferences */}
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <div className="text-xs font-semibold text-gray-600 mb-3">DETECTED PREFERENCES</div>
              {Object.keys(categoryPreferences).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(categoryPreferences)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, count]) => {
                      const percentage = (count / getViewedCount) * 100;
                      return (
                        <div key={category}>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="capitalize font-medium text-gray-700">{category}</span>
                            <span className="text-gray-500">{Math.round(percentage)}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${
                                category === 'tech'
                                  ? 'bg-blue-400'
                                  : 'bg-pink-400'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-xs text-gray-500">View content to see preferences emerge</p>
              )}
            </div>

            {/* Info */}
            <div className="mt-4 p-3 bg-purple-100 border border-purple-300 rounded-lg">
              <p className="text-xs text-purple-900 leading-relaxed">
                <strong>💡 Tip:</strong> Click items to build viewing history. Watch as AI predicts your interests!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
