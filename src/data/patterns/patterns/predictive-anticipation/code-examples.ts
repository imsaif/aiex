import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Predictive Content Pre-loader",
    description: "This React component predicts which content a user is likely to view next based on their browsing patterns and pre-loads it in the background for instant access.",
    language: "tsx",
    componentId: "predictive-anticipation-demo",
    code: `'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ContentItem {
  id: string;
  title: string;
  category: string;
  loaded: boolean;
  predicted: boolean;
}

export default function PredictiveAnticipationDemo() {
  const [items] = useState<ContentItem[]>([
    { id: '1', title: 'Article 1', category: 'tech', loaded: false, predicted: false },
    { id: '2', title: 'Article 2', category: 'tech', loaded: false, predicted: false },
    { id: '3', title: 'Article 3', category: 'design', loaded: false, predicted: false },
    { id: '4', title: 'Article 4', category: 'tech', loaded: false, predicted: false },
  ]);

  const [viewHistory, setViewHistory] = useState<string[]>([]);
  const [preloaded, setPreloaded] = useState<Set<string>>(new Set());
  const [currentView, setCurrentView] = useState<string | null>(null);

  // Predict next items based on category preference
  useEffect(() => {
    if (viewHistory.length >= 2) {
      const lastCategories = viewHistory.slice(-2).map(id =>
        items.find(item => item.id === id)?.category
      );

      const preferredCategory = lastCategories[0];
      const nextPredicted = items.find(item =>
        item.category === preferredCategory &&
        !viewHistory.includes(item.id) &&
        !preloaded.has(item.id)
      );

      if (nextPredicted) {
        setTimeout(() => {
          setPreloaded(prev => new Set([...prev, nextPredicted.id]));
        }, 500);
      }
    }
  }, [viewHistory, items]);

  const handleView = (id: string) => {
    setCurrentView(id);
    setViewHistory(prev => [...prev, id]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Try this:</strong> Click on tech articles to see AI predict and pre-load similar content
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {items.map(item => (
          <motion.div
            key={item.id}
            onClick={() => handleView(item.id)}
            className={\`p-4 border rounded-lg cursor-pointer \${
              currentView === item.id ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-200'
            }\`}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-xs text-gray-500">{item.category}</p>
            {preloaded.has(item.id) && (
              <span className="text-xs text-green-600">✓ Pre-loaded</span>
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Viewing History:</h4>
        <p className="text-sm text-gray-600">
          {viewHistory.length > 0 ? viewHistory.join(' → ') : 'No history yet'}
        </p>
      </div>
    </div>
  );
}`
  }
];
