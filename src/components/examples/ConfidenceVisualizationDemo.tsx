'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Email {
  id: string;
  subject: string;
  preview: string;
  prediction: 'spam' | 'not-spam';
  confidence: number;
}

export default function ConfidenceVisualizationDemo() {
  const emails: Email[] = [
    {
      id: '1',
      subject: 'Congratulations! You Won $1M!',
      preview: 'Click here to claim your prize immediately...',
      prediction: 'spam',
      confidence: 0.95
    },
    {
      id: '2',
      subject: 'Meeting Tomorrow at 3pm',
      preview: 'Hi team, let\'s sync on the Q4 roadmap...',
      prediction: 'not-spam',
      confidence: 0.88
    },
    {
      id: '3',
      subject: 'Check This Out (No Subject)',
      preview: 'You won\'t believe what happened next...',
      prediction: 'spam',
      confidence: 0.62
    },
    {
      id: '4',
      subject: 'Your Package Is Delayed',
      preview: 'We apologize, but your delivery has been...',
      prediction: 'not-spam',
      confidence: 0.48
    },
    {
      id: '5',
      subject: 'Limited Time Offer - 50% Off',
      preview: 'Exclusive deal just for you! Expires in 2 hours...',
      prediction: 'spam',
      confidence: 0.71
    }
  ];

  const [selectedId, setSelectedId] = useState<string>('1');
  const selected = emails.find(e => e.id === selectedId)!;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceBgColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-50';
    if (confidence >= 0.6) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const getPredictionLabel = (prediction: string) => {
    return prediction === 'spam' ? 'Likely Spam' : 'Likely Legitimate';
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Email Spam Detection</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Email List */}
        <div className="md:col-span-1 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Emails to Analyze
          </h3>
          <div className="space-y-2">
            {emails.map((email) => (
              <motion.button
                key={email.id}
                onClick={() => setSelectedId(email.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selectedId === email.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                  {email.subject}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                  {email.preview}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Prediction Result */}
        <div className="md:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
            AI Analysis
          </h3>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-lg border-2 p-6 ${
                getConfidenceBgColor(selected.confidence)
              } ${
                selected.prediction === 'spam'
                  ? 'border-red-200'
                  : 'border-green-200'
              }`}
            >
              {/* Email Preview */}
              <div className="mb-6 pb-6 border-b">
                <p className="text-sm text-gray-600 mb-1">Selected Email:</p>
                <p className="font-semibold text-gray-900">{selected.subject}</p>
                <p className="text-sm text-gray-600 mt-2">{selected.preview}</p>
              </div>

              {/* Prediction */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">Prediction</p>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      selected.prediction === 'spam'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {getPredictionLabel(selected.prediction)}
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {selected.prediction === 'spam' ? '🚫 Spam' : '✅ Not Spam'}
                </p>
              </div>

              {/* Confidence Visualization */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Confidence Level
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {getConfidenceLabel(selected.confidence)}
                    </p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-2xl font-bold text-gray-900"
                  >
                    {Math.round(selected.confidence * 100)}%
                  </motion.div>
                </div>

                {/* Confidence Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selected.confidence * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`h-3 rounded-full ${getConfidenceColor(
                      selected.confidence
                    )}`}
                  />
                </div>

                {/* Confidence Gauge Visualization */}
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>Low</span>
                  <div className="flex-1 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" />
                  <span>High</span>
                </div>
              </div>

              {/* Warnings for Low Confidence */}
              {selected.confidence < 0.7 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg"
                >
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">⚠️ Low Confidence</span> -
                    This prediction may not be reliable. We recommend manual
                    verification before taking action.
                  </p>
                </motion.div>
              )}

              {selected.confidence >= 0.85 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg"
                >
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">✓ High Confidence</span> -
                    This prediction is reliable. You can trust this
                    classification.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <p className="text-sm font-semibold text-blue-900">How it works:</p>
        <ul className="text-sm text-blue-900 space-y-1 ml-4 list-disc">
          <li>
            Click on any email to see AI confidence in its classification
          </li>
          <li>
            The confidence bar shows how certain the AI is about the prediction
          </li>
          <li>
            High confidence (80%+) means you can trust the result with minimal
            verification
          </li>
          <li>
            Low confidence (&lt;70%) indicates you should manually review before
            taking action
          </li>
          <li>
            This transparency helps you know when to trust AI and when to be
            skeptical
          </li>
        </ul>
      </div>
    </div>
  );
}
