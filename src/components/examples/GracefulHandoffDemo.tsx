'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Mode = 'ai' | 'manual';

interface TaskState {
  title: string;
  progress: number;
  currentStep: string;
  context: Record<string, string>;
}

export default function GracefulHandoffDemo() {
  const [mode, setMode] = useState<Mode>('ai');
  const [isProcessing, setIsProcessing] = useState(false);
  const [taskState, setTaskState] = useState<TaskState>({
    title: 'Write Product Description',
    progress: 45,
    currentStep: 'Analyzing features',
    context: {
      product: 'Cloud Storage App',
      tone: 'Professional',
      length: 'Medium',
    },
  });

  // Simulate AI processing
  const handleStartAi = async () => {
    setIsProcessing(true);
    setMode('ai');

    // Simulate AI working
    for (let i = 45; i <= 90; i += 15) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTaskState(prev => ({
        ...prev,
        progress: i,
        currentStep: i <= 50 ? 'Analyzing features' : i <= 70 ? 'Drafting content' : 'Refining tone',
      }));
    }

    setIsProcessing(false);
  };

  // Switch from AI to Manual
  const handleSwitchToManual = () => {
    setMode('manual');
    setIsProcessing(false);
  };

  // Resume AI from manual
  const handleResumeAi = async () => {
    setMode('ai');
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 1500));
    setTaskState(prev => ({
      ...prev,
      progress: 100,
      currentStep: 'Complete!',
    }));
    setIsProcessing(false);
  };

  // Reset demo
  const handleReset = () => {
    setMode('ai');
    setIsProcessing(false);
    setTaskState({
      title: 'Write Product Description',
      progress: 0,
      currentStep: 'Ready to start',
      context: {
        product: 'Cloud Storage App',
        tone: 'Professional',
        length: 'Medium',
      },
    });
  };

  const isComplete = taskState.progress >= 100;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Graceful Handoff Demo</h2>
        <p className="text-sm text-gray-600">
          <strong>How to use:</strong> Watch AI work on a task, then seamlessly take over at any point. All your context is preserved.
        </p>
      </div>

      {/* Task Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Current Task</h3>
          <p className="text-lg font-bold text-gray-900">{taskState.title}</p>
        </div>

        {/* Context Panel */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Preserved Context</p>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(taskState.context).map(([key, value]) => (
              <div key={key} className="bg-white rounded border border-gray-200 p-3">
                <p className="text-xs text-gray-600 uppercase tracking-wide">{key}</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Progress</p>
            <p className="text-sm font-bold text-gray-800">{taskState.progress}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${taskState.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-gray-600">
            <strong>Current Step:</strong> {taskState.currentStep}
          </p>
        </div>
      </div>

      {/* Mode Indicator & Control Buttons */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        {/* Current Mode Display */}
        <div className="flex items-center space-x-3">
          <motion.div
            key={mode}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-4 h-4 rounded-full ${mode === 'ai' ? 'bg-blue-500' : 'bg-green-500'}`}
          />
          <span className="text-sm font-semibold text-gray-800">
            {mode === 'ai' ? '🤖 AI is in control' : '👤 You are in control'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {mode === 'ai' && !isComplete && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartAi}
              disabled={isProcessing}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'
              }`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>AI Working...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Let AI Continue</span>
                </>
              )}
            </motion.button>
          )}

          {mode === 'ai' && taskState.progress > 0 && !isComplete && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSwitchToManual}
              disabled={isProcessing}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <span>✋ Take Over & Edit</span>
            </motion.button>
          )}

          {mode === 'manual' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResumeAi}
              disabled={isProcessing}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'
              }`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>AI Resuming...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Resume AI from Here</span>
                </>
              )}
            </motion.button>
          )}

          {isComplete && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-all shadow-lg"
            >
              <span>↻ Try Again</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Features Info Panel */}
      <AnimatePresence>
        {taskState.progress > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-indigo-50 border border-indigo-200 rounded-lg p-4"
          >
            <h4 className="font-semibold text-indigo-900 mb-2 flex items-center space-x-2">
              <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Graceful Handoff Features Demonstrated</span>
            </h4>
            <ul className="text-sm text-indigo-900 space-y-1 ml-7">
              <li>✓ <strong>Clear Mode Visibility:</strong> Always know if AI or you are in control</li>
              <li>✓ <strong>Seamless Switching:</strong> Take over at any time, progress is preserved</li>
              <li>✓ <strong>Context Preservation:</strong> All task details stay intact during handoff</li>
              <li>✓ <strong>Resume Automation:</strong> Let AI continue from where you took over</li>
              <li>✓ <strong>No Data Loss:</strong> Smooth transitions without losing information</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
