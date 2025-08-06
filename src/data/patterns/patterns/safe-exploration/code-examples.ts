import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Safe Exploration Interactive Demo",
    description: "This React component demonstrates safe exploration with practical implementation following best practices for user experience and accessibility.",
    language: "tsx",
    componentId: "safe-exploration-demo",
    code: `'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExperimentSession {
  id: string;
  name: string;
  description: string;
  changes: string[];
  canUndo: boolean;
  isActive: boolean;
}

interface SafetyGuard {
  id: string;
  type: 'data' | 'permission' | 'reversibility' | 'scope';
  message: string;
  level: 'info' | 'warning' | 'error';
}

export default function SafeExplorationDemo() {
  const [currentSession, setCurrentSession] = useState<ExperimentSession | null>(null);
  const [experiments, setExperiments] = useState<ExperimentSession[]>([]);
  const [safetyGuards, setSafetyGuards] = useState<SafetyGuard[]>([]);
  const [explorationMode, setExplorationMode] = useState<'sandbox' | 'guided' | 'freeform'>('sandbox');
  const [experimentName, setExperimentName] = useState('');
  const [showSafetyInfo, setShowSafetyInfo] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const startExperiment = (name: string, description: string) => {
    const newExperiment: ExperimentSession = {
      id: Date.now().toString(),
      name,
      description,
      changes: [],
      canUndo: true,
      isActive: true
    };

    setCurrentSession(newExperiment);
    setExperiments(prev => [...prev, newExperiment]);

    // Generate appropriate safety guards
    generateSafetyGuards(explorationMode);
  };

  const generateSafetyGuards = (mode: string) => {
    const guards: SafetyGuard[] = [];

    if (mode === 'sandbox') {
      guards.push({
        id: 'sandbox-isolation',
        type: 'scope',
        message: 'This experiment is isolated from your main data and settings',
        level: 'info'
      });
    }

    guards.push({
      id: 'auto-backup',
      type: 'data',
      message: 'Automatic backup created before starting experiment',
      level: 'info'
    });

    guards.push({
      id: 'time-limit',
      type: 'scope',
      message: 'Experiment will auto-expire in 24 hours for safety',
      level: 'warning'
    });

    if (mode === 'freeform') {
      guards.push({
        id: 'advanced-warning',
        type: 'permission',
        message: 'Advanced mode: Some changes may require manual review',
        level: 'warning'
      });
    }

    setSafetyGuards(guards);
  };

  const makeExperimentalChange = (change: string) => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      changes: [...currentSession.changes, change]
    };

    setCurrentSession(updatedSession);
    setExperiments(prev =>
      prev.map(exp => exp.id === updatedSession.id ? updatedSession : exp)
    );

    // Simulate safety checks
    if (change.toLowerCase().includes('delete') || change.toLowerCase().includes('remove')) {
      setSafetyGuards(prev => [...prev, {
        id: 'destructive-action',
        type: 'data',
        message: 'Destructive action detected - backup automatically created',
        level: 'warning'
      }]);
    }
  };

  const undoLastChange = () => {
    if (!currentSession || currentSession.changes.length === 0) return;

    const updatedSession = {
      ...currentSession,
      changes: currentSession.changes.slice(0, -1)
    };

    setCurrentSession(updatedSession);
    setExperiments(prev =>
      prev.map(exp => exp.id === updatedSession.id ? updatedSession : exp)
    );
  };

  const endExperiment = (save: boolean = false) => {
    if (!currentSession) return;

    if (save) {
      // Simulate saving experimental changes
      alert('Experimental changes have been saved to your main workspace!');
    } else {
      // Simulate discarding changes
      alert('Experimental changes have been discarded. Your main workspace is unchanged.');
    }

    setCurrentSession(null);
    setSafetyGuards([]);
  };

  const getSafetyGuardColor = (level: string) => {
    switch (level) {
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSafetyGuardIcon = (type: string) => {
    switch (type) {
      case 'data': return '🔒';
      case 'permission': return '⚠️';
      case 'reversibility': return '↩️';
      case 'scope': return '🎯';
      default: return '🛡️';
    }
  };

  const predefinedExperiments = [
    {
      name: 'AI Writing Style',
      description: 'Experiment with different AI writing styles and tones'
    },
    {
      name: 'Interface Layout',
      description: 'Try new interface arrangements and components'
    },
    {
      name: 'Data Visualization',
      description: 'Explore different ways to visualize your data'
    },
    {
      name: 'Automation Rules',
      description: 'Test new automation workflows safely'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Safe Exploration Playground</h2>
          <p className="text-gray-600">Experiment freely without fear of breaking anything</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={explorationMode}
            onChange={(e) => setExplorationMode(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="sandbox">Sandbox Mode</option>
            <option value="guided">Guided Mode</option>
            <option value="freeform">Freeform Mode</option>
          </select>
          <button
            onClick={() => setShowSafetyInfo(!showSafetyInfo)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Safety Info
          </button>
        </div>
      </header>

      <AnimatePresence>
        {showSafetyInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <h3 className="font-semibold text-green-900 mb-3">🛡️ Safety Features</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
              <div className="space-y-2">
                <div>• <strong>Isolated Environment:</strong> Changes don't affect your main workspace</div>
                <div>• <strong>Automatic Backups:</strong> Your data is automatically backed up</div>
                <div>• <strong>Easy Undo:</strong> Every action can be reversed</div>
              </div>
              <div className="space-y-2">
                <div>• <strong>Time Limits:</strong> Experiments auto-expire for safety</div>
                <div>• <strong>Clear Boundaries:</strong> You'll always know what's experimental</div>
                <div>• <strong>Choose Your Level:</strong> From guided tutorials to free exploration</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {!currentSession ? (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-4">Start New Experiment</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experiment Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="My AI Experiment"
                      value={experimentName}
                      onChange={(e) => setExperimentName(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => startExperiment(
                      experimentName || 'Quick Experiment',
                      'Custom experiment created by user'
                    )}
                    disabled={!experimentName.trim()}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Start Custom Experiment
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Quick Start Templates</span>
                </div>
                <div className="p-4 space-y-3">
                  {predefinedExperiments.map((experiment, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => startExperiment(experiment.name, experiment.description)}
                    >
                      <h4 className="font-medium text-gray-900">{experiment.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{experiment.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-blue-900">
                    🧪 Active Experiment: {currentSession.name}
                  </h3>
                  <div className="space-x-2">
                    <button
                      onClick={undoLastChange}
                      disabled={currentSession.changes.length === 0}
                      className="text-xs px-3 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Undo Last
                    </button>
                    <button
                      onClick={() => endExperiment(false)}
                      className="text-xs px-3 py-1 bg-red-200 text-red-600 rounded hover:bg-red-300"
                    >
                      Discard
                    </button>
                    <button
                      onClick={() => endExperiment(true)}
                      className="text-xs px-3 py-1 bg-green-200 text-green-600 rounded hover:bg-green-300"
                    >
                      Save & Apply
                    </button>
                  </div>
                </div>
                <p className="text-sm text-blue-700">{currentSession.description}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Experiment Workspace</span>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Try an experimental change:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => makeExperimentalChange('Changed color scheme to dark mode')}
                        className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        Dark Mode
                      </button>
                      <button
                        onClick={() => makeExperimentalChange('Enabled advanced AI suggestions')}
                        className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                      >
                        AI Boost
                      </button>
                      <button
                        onClick={() => makeExperimentalChange('Rearranged interface layout')}
                        className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        New Layout
                      </button>
                      <button
                        onClick={() => makeExperimentalChange('Added experimental feature')}
                        className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Beta Feature
                      </button>
                    </div>
                  </div>

                  {currentSession.changes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Changes Made:</h4>
                      <div className="space-y-1">
                        {currentSession.changes.map((change, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded px-2 py-1">
                            {index + 1}. {change}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {safetyGuards.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-3">🛡️ Safety Guards</h3>
              <div className="space-y-2">
                {safetyGuards.map(guard => (
                  <div
                    key={guard.id}
                    className={\`p-2 rounded border \${getSafetyGuardColor(guard.level)}\`}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-sm">{getSafetyGuardIcon(guard.type)}</span>
                      <div className="flex-1">
                        <p className="text-xs font-medium uppercase tracking-wide mb-1">
                          {guard.type}
                        </p>
                        <p className="text-sm">{guard.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Exploration History</h3>
            {experiments.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {experiments.map(experiment => (
                  <div
                    key={experiment.id}
                    className={\`p-2 rounded border \${
                      experiment.isActive && currentSession?.id === experiment.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }\`}
                  >
                    <div className="font-medium text-sm">{experiment.name}</div>
                    <div className="text-xs text-gray-600">
                      {experiment.changes.length} changes made
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 italic">No experiments yet</p>
            )}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Safe Exploration Tips</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Start with templates if you're new</li>
              <li>• All changes are reversible</li>
              <li>• Experiment freely - nothing can break</li>
              <li>• Save only changes you want to keep</li>
              <li>• Ask for help anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}`
  }
];
