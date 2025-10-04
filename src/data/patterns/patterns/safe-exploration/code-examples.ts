import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Safe Exploration Interactive Demo",
    description: "A simple, clear demonstration of safe exploration - try changes in an isolated sandbox, then choose to keep or discard them.",
    language: "tsx",
    componentId: "safe-exploration-demo",
    code: `'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SafeExplorationDemo() {
  const [isExperimenting, setIsExperimenting] = useState(false);
  const [changes, setChanges] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const startExperiment = () => {
    setIsExperimenting(true);
    setChanges([]);
    setCurrentStep(2);
  };

  const makeChange = (change: string) => {
    setChanges(prev => [...prev, change]);
    if (currentStep === 2) setCurrentStep(3);
  };

  const undoChange = () => {
    setChanges(prev => prev.slice(0, -1));
  };

  const endExperiment = (save: boolean) => {
    if (save) {
      alert(\`✅ Saved \${changes.length} change(s) to your workspace!\`);
    } else {
      alert('🔄 All changes discarded. Your workspace is unchanged.');
    }
    setIsExperimenting(false);
    setChanges([]);
    setCurrentStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Instructions */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-3">📖 How to Use This Demo</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div className={\`flex items-start space-x-2 \${currentStep === 1 ? 'font-semibold' : ''}\`}>
            <span className="mt-0.5">1️⃣</span>
            <span>Click "Start Sandbox Experiment" to begin in an isolated environment</span>
          </div>
          <div className={\`flex items-start space-x-2 \${currentStep === 2 ? 'font-semibold' : ''}\`}>
            <span className="mt-0.5">2️⃣</span>
            <span>Try experimental changes - they won't affect your real workspace</span>
          </div>
          <div className={\`flex items-start space-x-2 \${currentStep === 3 ? 'font-semibold' : ''}\`}>
            <span className="mt-0.5">3️⃣</span>
            <span>Use "Undo" to reverse changes, or "Save" to apply them / "Discard" to cancel</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Safe Exploration Sandbox</h2>
        <p className="text-gray-600">Experiment freely without breaking anything</p>
      </div>

      {/* Main Content */}
      {!isExperimenting ? (
        <div className="space-y-6">
          {/* Safety Features */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-3">🛡️ Safety Features</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-green-700">
              <div>✅ Isolated from your real workspace</div>
              <div>✅ All changes are reversible</div>
              <div>✅ No risk of breaking anything</div>
              <div>✅ Choose what to keep or discard</div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startExperiment}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Start Sandbox Experiment
          </button>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Experiment Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-blue-900">🧪 Experiment Active</h3>
                  <p className="text-sm text-blue-700">You're in a safe sandbox - experiment freely!</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={undoChange}
                    disabled={changes.length === 0}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ↩️ Undo
                  </button>
                  <button
                    onClick={() => endExperiment(false)}
                    className="px-3 py-1.5 bg-red-200 text-red-700 rounded text-sm hover:bg-red-300"
                  >
                    Discard
                  </button>
                  <button
                    onClick={() => endExperiment(true)}
                    className="px-3 py-1.5 bg-green-200 text-green-700 rounded text-sm hover:bg-green-300"
                  >
                    ✓ Save
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Try experimental changes:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => makeChange('Enabled dark mode theme')}
                  className="px-4 py-3 bg-gray-700 text-white rounded hover:bg-gray-800 text-sm"
                >
                  🌙 Dark Mode
                </button>
                <button
                  onClick={() => makeChange('Changed layout to compact view')}
                  className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  📐 Compact Layout
                </button>
                <button
                  onClick={() => makeChange('Enabled AI auto-complete')}
                  className="px-4 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                >
                  ✨ AI Assist
                </button>
                <button
                  onClick={() => makeChange('Increased font size')}
                  className="px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  🔤 Larger Text
                </button>
              </div>
            </div>

            {/* Changes List */}
            {changes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Changes Made ({changes.length}):
                </h4>
                <div className="space-y-1.5">
                  {changes.map((change, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="text-green-600">✓</span>
                      <span>{change}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Safety Reminder */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <p className="text-sm text-yellow-800">
                🛡️ These changes are isolated and won't affect your workspace until you click "Save"
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}`
  }
];
