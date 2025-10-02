import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Adaptive Recommendation System",
    description: "A component that learns from user feedback to improve recommendations over time.",
    language: "tsx",
    componentId: "feedback-loops-demo",
    code: `'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Item {
  id: number;
  title: string;
  category: string;
}

export default function FeedbackLoopsDemo() {
  const [items] = useState<Item[]>([
    { id: 1, title: 'Tech Article 1', category: 'tech' },
    { id: 2, title: 'Design Article 1', category: 'design' },
    { id: 3, title: 'Tech Article 2', category: 'tech' },
    { id: 4, title: 'Business Article 1', category: 'business' },
  ]);

  const [feedback, setFeedback] = useState<Record<number, 'like' | 'dislike'>>({});
  const [showMessage, setShowMessage] = useState(false);

  const categoryScores = Object.entries(feedback).reduce((acc, [id, reaction]) => {
    const item = items.find(i => i.id === Number(id));
    if (item) {
      acc[item.category] = (acc[item.category] || 0) + (reaction === 'like' ? 1 : -1);
    }
    return acc;
  }, {} as Record<string, number>);

  const handleFeedback = (id: number, reaction: 'like' | 'dislike') => {
    setFeedback(prev => ({ ...prev, [id]: reaction }));
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  const getRecommendationScore = (category: string) => {
    return categoryScores[category] || 0;
  };

  const topCategory = Object.entries(categoryScores).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm"
          >
            ✓ Thanks for your feedback! Learning your preferences...
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <span className="text-xs text-gray-500">{item.category}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFeedback(item.id, 'like')}
                  className={\`px-3 py-1 rounded \${
                    feedback[item.id] === 'like'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }\`}
                >
                  👍
                </button>
                <button
                  onClick={() => handleFeedback(item.id, 'dislike')}
                  className={\`px-3 py-1 rounded \${
                    feedback[item.id] === 'dislike'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }\`}
                >
                  👎
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {topCategory && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Based on your feedback, we'll show you more <strong>{topCategory}</strong> content
          </p>
        </div>
      )}
    </div>
  );
}`
  }
];
