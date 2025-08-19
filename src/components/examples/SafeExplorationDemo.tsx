'use client';

import React, { useState } from 'react';

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

    if (mode === 'guided') {
      guards.push({
        id: 'guided-safety',
        type: 'permission',
        message: 'Guided mode: Step-by-step assistance available',
        level: 'info'
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
      const newGuard: SafetyGuard = {
        id: 'destructive-action',
        type: 'data',
        message: 'Destructive action detected - backup automatically created',
        level: 'warning'
      };
      
      setSafetyGuards(prev => {
        // Don't add duplicate guards
        if (prev.some(guard => guard.id === newGuard.id)) {
          return prev;
        }
        return [...prev, newGuard];
      });
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

    // Remove safety guards related to destructive actions if no more destructive changes
    const hasDestructiveChanges = updatedSession.changes.some(change => 
      change.toLowerCase().includes('delete') || change.toLowerCase().includes('remove')
    );
    
    if (!hasDestructiveChanges) {
      setSafetyGuards(prev => prev.filter(guard => guard.id !== 'destructive-action'));
    }
  };

  const endExperiment = (save: boolean = false) => {
    if (!currentSession) return;

    if (save) {
      alert('Experimental changes have been saved to your main workspace!');
    } else {
      alert('Experimental changes have been discarded. Your main workspace is unchanged.');
    }

    const finishedSession = {
      ...currentSession,
      isActive: false
    };

    setExperiments(prev => 
      prev.map(exp => exp.id === finishedSession.id ? finishedSession : exp)
    );
    
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

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case 'sandbox': return 'Completely isolated environment';
      case 'guided': return 'Step-by-step assistance provided';
      case 'freeform': return 'Full freedom with safety nets';
      default: return 'Safe experimentation mode';
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
            onChange={(e) => {
              const newMode = e.target.value as 'sandbox' | 'guided' | 'freeform';
              setExplorationMode(newMode);
              if (currentSession) {
                generateSafetyGuards(newMode);
              }
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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

      {showSafetyInfo && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 transition-all duration-300">
          <h3 className="font-semibold text-green-900 mb-3 flex items-center">
            <span className="mr-2">🛡️</span>
            Safety Features
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
            <div className="space-y-2">
              <div>• <strong>Isolated Environment:</strong> Changes don&apos;t affect your main workspace</div>
              <div>• <strong>Automatic Backups:</strong> Your data is automatically backed up</div>
              <div>• <strong>Easy Undo:</strong> Every action can be reversed</div>
            </div>
            <div className="space-y-2">
              <div>• <strong>Time Limits:</strong> Experiments auto-expire for safety</div>
              <div>• <strong>Clear Boundaries:</strong> You&apos;ll always know what&apos;s experimental</div>
              <div>• <strong>Choose Your Level:</strong> From guided tutorials to free exploration</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-green-200">
            <p className="text-sm text-green-600">
              <strong>Current Mode:</strong> {explorationMode.charAt(0).toUpperCase() + explorationMode.slice(1)} - {getModeDescription(explorationMode)}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {!currentSession ? (
            <div className="space-y-6">
              {/* Custom Experiment Creation */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-4">Start New Experiment</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experiment Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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

              {/* Predefined Templates */}
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
              {/* Active Experiment Header */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-blue-900">
                    🧪 Active Experiment: {currentSession.name}
                  </h3>
                  <div className="space-x-2">
                    <button
                      onClick={undoLastChange}
                      disabled={currentSession.changes.length === 0}
                      className="text-xs px-3 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Undo Last
                    </button>
                    <button
                      onClick={() => endExperiment(false)}
                      className="text-xs px-3 py-1 bg-red-200 text-red-600 rounded hover:bg-red-300 transition-colors"
                    >
                      Discard
                    </button>
                    <button
                      onClick={() => endExperiment(true)}
                      className="text-xs px-3 py-1 bg-green-200 text-green-600 rounded hover:bg-green-300 transition-colors"
                    >
                      Save & Apply
                    </button>
                  </div>
                </div>
                <p className="text-sm text-blue-700">{currentSession.description}</p>
                <div className="mt-2 text-xs text-blue-600">
                  Mode: {explorationMode} | Changes: {currentSession.changes.length} | Can Undo: {currentSession.canUndo ? 'Yes' : 'No'}
                </div>
              </div>

              {/* Experiment Workspace */}
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
                        className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                      >
                        Dark Mode
                      </button>
                      <button
                        onClick={() => makeExperimentalChange('Enabled advanced AI suggestions')}
                        className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                      >
                        AI Boost
                      </button>
                      <button
                        onClick={() => makeExperimentalChange('Rearranged interface layout')}
                        className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        New Layout
                      </button>
                      <button
                        onClick={() => makeExperimentalChange('Added experimental feature')}
                        className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Beta Feature
                      </button>
                      <button
                        onClick={() => makeExperimentalChange('Delete old configuration files')}
                        className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Delete Files
                      </button>
                      <button
                        onClick={() => makeExperimentalChange('Updated notification settings')}
                        className="px-3 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors"
                      >
                        Notifications
                      </button>
                    </div>
                  </div>

                  {currentSession.changes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Changes Made:</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {currentSession.changes.map((change, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded px-2 py-1">
                            {index + 1}. {change}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentSession.changes.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl">🧪</span>
                      </div>
                      <p className="text-sm">No changes made yet</p>
                      <p className="text-xs mt-1">Click any button above to start experimenting</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Safety Guards */}
          {safetyGuards.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-3">🛡️ Safety Guards</h3>
              <div className="space-y-2">
                {safetyGuards.map(guard => (
                  <div
                    key={guard.id}
                    className={`p-2 rounded border ${getSafetyGuardColor(guard.level)}`}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-sm">{getSafetyGuardIcon(guard.type)}</span>
                      <div className="flex-1">
                        <p className="text-xs font-medium uppercase tracking-wide mb-1">
                          {guard.type} {guard.level && `- ${guard.level}`}
                        </p>
                        <p className="text-sm">{guard.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exploration History */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Exploration History</h3>
            {experiments.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {experiments.map(experiment => (
                  <div
                    key={experiment.id}
                    className={`p-2 rounded border ${
                      experiment.isActive && currentSession?.id === experiment.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="font-medium text-sm">{experiment.name}</div>
                    <div className="text-xs text-gray-600">
                      {experiment.changes.length} changes made
                      {experiment.isActive ? ' (Active)' : ' (Completed)'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 italic">No experiments yet</p>
            )}
          </div>

          {/* Mode Status */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-3">Current Mode</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-700">Mode:</span>
                <span className="font-medium">{explorationMode.charAt(0).toUpperCase() + explorationMode.slice(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Active Experiments:</span>
                <span className="font-medium">{currentSession ? '1' : '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Safety Guards:</span>
                <span className="font-medium">{safetyGuards.length}</span>
              </div>
            </div>
          </div>

          {/* Safe Exploration Tips */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Safe Exploration Tips</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li className="flex items-start">
                <span className="w-1 h-1 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Start with templates if you&apos;re new
              </li>
              <li className="flex items-start">
                <span className="w-1 h-1 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                All changes are reversible
              </li>
              <li className="flex items-start">
                <span className="w-1 h-1 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Experiment freely - nothing can break
              </li>
              <li className="flex items-start">
                <span className="w-1 h-1 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Save only changes you want to keep
              </li>
              <li className="flex items-start">
                <span className="w-1 h-1 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Try different modes for various levels of guidance
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}