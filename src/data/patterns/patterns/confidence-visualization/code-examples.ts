import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "AI Prediction with Confidence Score",
    description: "A component that displays AI predictions with visual confidence indicators to help users assess reliability.",
    language: "tsx",
    componentId: "confidence-visualization-demo",
    code: `'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Prediction {
  text: string;
  confidence: number;
}

export default function ConfidenceVisualizationDemo() {
  const [predictions] = useState<Prediction[]>([
    { text: "User likely to click 'Purchase'", confidence: 0.92 },
    { text: "User interested in premium features", confidence: 0.76 },
    { text: "User may churn this month", confidence: 0.45 },
  ]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {predictions.map((pred, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white border border-gray-200 rounded-lg p-4"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{pred.text}</h3>
            <span className={\`text-sm px-2 py-1 rounded \${
              pred.confidence >= 0.8 ? 'bg-green-100 text-green-700' :
              pred.confidence >= 0.6 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }\`}>
              {getConfidenceLabel(pred.confidence)}
            </span>
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: \`\${pred.confidence * 100}%\` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={\`h-2 rounded-full \${getConfidenceColor(pred.confidence)}\`}
                />
              </div>
              <span className="text-sm font-medium w-12">{Math.round(pred.confidence * 100)}%</span>
            </div>
          </div>

          {pred.confidence < 0.6 && (
            <p className="text-sm text-gray-600 mt-2">
              ⚠️ Low confidence - human verification recommended
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}`
  }
];
