'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Response {
  id: number;
  content: string;
}

export default function FeedbackLoopsDemo() {
  const [responses] = useState<Response[]>([
    { id: 1, content: 'This response was helpful and answered my question clearly.' },
    { id: 2, content: 'Great explanation with practical examples included.' },
    { id: 3, content: 'Detailed breakdown of the concept with code samples.' },
  ]);

  const [feedback, setFeedback] = useState<Record<number, 'helpful' | 'not-helpful'>>({});
  const [showConfirmation, setShowConfirmation] = useState<number | null>(null);

  const handleFeedback = (id: number, reaction: 'helpful' | 'not-helpful') => {
    setFeedback(prev => ({ ...prev, [id]: reaction }));
    setShowConfirmation(id);
    setTimeout(() => setShowConfirmation(null), 3000);
  };

  const feedbackCount = Object.keys(feedback).length;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {responses.map(response => (
        <div key={response.id} className="border border-gray-200 rounded-lg p-4 bg-white">
          <p className="text-gray-700 mb-4">{response.content}</p>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">How is the AI doing?</p>

            <div className="flex gap-2">
              <button
                onClick={() => handleFeedback(response.id, 'helpful')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  feedback[response.id] === 'helpful'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👍 Helpful
              </button>
              <button
                onClick={() => handleFeedback(response.id, 'not-helpful')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  feedback[response.id] === 'not-helpful'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👎 Not Helpful
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showConfirmation === response.id && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <p className="text-green-700 text-sm font-medium">
                  ✓ Thank you for making our app improve!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {feedbackCount > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800 text-sm">
            <span className="font-semibold">{feedbackCount}</span> feedback{feedbackCount !== 1 ? 's' : ''} received • We're learning from your responses
          </p>
        </div>
      )}
    </div>
  );
}
