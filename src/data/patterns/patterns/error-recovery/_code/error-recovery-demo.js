export const errorRecoveryDemoCode = `
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Status = 'idle' | 'loading' | 'error' | 'success' | 'queued';

export default function ErrorRecoveryDemo() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [suggestions, setSuggestions] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [queuePosition, setQueuePosition] = useState(0);

  // Simulate AI suggestion request
  const handleGetSuggestions = async () => {
    // Save the text (state preservation)
    const savedText = text;

    setStatus('loading');
    setSuggestions('');

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // First attempt always shows capacity error (to demonstrate error recovery)
    if (attemptCount === 0) {
      setStatus('error');
      setAttemptCount(1);
      return;
    }

    // Second attempt shows success
    setStatus('success');
    setSuggestions(\`Here are AI-powered suggestions for your text:

• Consider adding more specific examples to strengthen your argument
• The tone could be more engaging - try using active voice
• Break this into shorter paragraphs for better readability
• Consider adding a strong concluding statement\`);
    setAttemptCount(0);
  };

  // Handle retry
  const handleRetry = () => {
    handleGetSuggestions();
  };

  // Handle queue simulation
  const handleWaitInQueue = async () => {
    setStatus('queued');
    setQueuePosition(23);

    // Simulate queue countdown
    for (let i = 23; i > 0; i -= 5) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setQueuePosition(i);
    }

    // After queue, show success
    setStatus('success');
    setSuggestions(\`Here are AI-powered suggestions for your text:

• Consider adding more specific examples to strengthen your argument
• The tone could be more engaging - try using active voice
• Break this into shorter paragraphs for better readability
• Consider adding a strong concluding statement\`);
    setAttemptCount(0);
  };

  const hasText = text.trim().length > 0;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Writing Assistant - Error Recovery Demo</h2>
        <p className="text-sm text-gray-600">
          <strong>How to use:</strong> Write some text below and click &quot;Get AI Suggestions&quot; to see how error recovery works when the service is at capacity.
        </p>
      </div>

      {/* Text Input Area */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Your Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something here... (e.g., 'I think AI is transforming how we work and interact with technology')"
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
          rows={6}
          disabled={status === 'loading' || status === 'queued'}
        />

        <motion.button
          whileHover={hasText && status !== 'loading' && status !== 'queued' ? { scale: 1.02 } : {}}
          whileTap={hasText && status !== 'loading' && status !== 'queued' ? { scale: 0.98 } : {}}
          onClick={handleGetSuggestions}
          disabled={!hasText || status === 'loading' || status === 'queued'}
          className={\`w-full px-6 py-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 \${
            !hasText || status === 'loading' || status === 'queued'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg'
          }\`}
        >
          {status === 'loading' ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Getting Suggestions...</span>
            </>
          ) : status === 'queued' ? (
            <>
              <svg className="animate-pulse h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Waiting in Queue... Position: {queuePosition}</span>
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Get AI Suggestions</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Error State - Service at Capacity */}
      <AnimatePresence mode="wait">
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6 shadow-lg"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">We&apos;re at Capacity Right Now</h3>
                <p className="text-amber-800 mb-4">
                  Our AI writing assistant is experiencing high demand. We&apos;ve saved your text and you have several options to continue.
                </p>

                {/* Saved Text Indicator */}
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Your text has been saved</span>
                  </div>
                </div>

                {/* Recovery Options */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-amber-900 mb-3">Choose how you&apos;d like to proceed:</p>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleRetry}
                    className="w-full p-3 bg-white border-2 border-amber-300 rounded-lg hover:bg-amber-50 transition-all flex items-center justify-center space-x-2 font-medium text-amber-900 shadow-sm"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Try Again Now</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleWaitInQueue}
                    className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center space-x-2 font-medium shadow-md"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Wait in Queue</span>
                  </motion.button>

                  <p className="text-xs text-amber-700 mt-2 text-center">
                    💡 Tip: Premium users get priority access during high demand
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {status === 'success' && suggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-50 border-2 border-green-200 rounded-lg p-6 shadow-lg"
          >
            <div className="flex items-start space-x-3">
              <svg className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-3">AI Suggestions Ready!</h3>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">{suggestions}</pre>
                </div>
                <button
                  onClick={() => {
                    setText('');
                    setSuggestions('');
                    setStatus('idle');
                    setAttemptCount(0);
                  }}
                  className="mt-3 text-sm text-green-700 hover:text-green-900 font-medium underline"
                >
                  Try with different text
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Panel */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error Recovery Features Demonstrated</span>
        </h4>
        <ul className="text-sm text-gray-600 space-y-1 ml-7">
          <li>✓ <strong>Clear Error Messages:</strong> &quot;At capacity&quot; explains what&apos;s happening</li>
          <li>✓ <strong>State Preservation:</strong> Your text is automatically saved</li>
          <li>✓ <strong>Multiple Recovery Paths:</strong> Retry immediately or wait in queue</li>
          <li>✓ <strong>User Trust:</strong> Transparent about issues and options</li>
          <li>✓ <strong>Queue System:</strong> Shows position and progress while waiting</li>
        </ul>
      </div>
    </div>
  );
}
`;
