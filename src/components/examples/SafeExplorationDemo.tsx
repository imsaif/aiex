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
  const [expandedGuard, setExpandedGuard] = useState<string | null>(null);

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
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Safe Exploration Playground</h2>
          <p className="text-gray-600 mb-4">Experiment freely with AI features in a controlled, protected environment</p>

          {/* Mode Selector & Controls */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
            <div className="flex-1 sm:flex-none">
              <label className="block text-sm font-medium text-gray-700 mb-2">Exploration Mode</label>
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
                <option value="sandbox">🔒 Sandbox Mode</option>
                <option value="guided">📚 Guided Mode</option>
                <option value="freeform">🚀 Freeform Mode</option>
              </select>
            </div>
            <div className="flex items-end gap-2 sm:ml-auto">
              <button
                onClick={() => setShowSafetyInfo(!showSafetyInfo)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
              >
                {showSafetyInfo ? '✓ Safety Info' : 'Safety Info'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Overview Banner */}
      {showSafetyInfo && (
        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold text-green-900 text-lg flex items-center">
              <span className="mr-3 text-2xl">🛡️</span>
              Active Safety Protections
            </h3>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              {currentSession ? 'PROTECTED' : 'READY'}
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-green-900">🔐 Data Isolation</div>
              <p className="text-sm text-green-700">Changes don&apos;t affect your main workspace</p>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-green-900">⏮️ Full Reversibility</div>
              <p className="text-sm text-green-700">Every action can be undone instantly</p>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-green-900">📋 Auto Backups</div>
              <p className="text-sm text-green-700">Automatic snapshots before changes</p>
            </div>
          </div>
          <div className="pt-4 border-t border-green-300">
            <p className="text-sm text-green-800">
              <strong>Current Mode:</strong> {explorationMode.charAt(0).toUpperCase() + explorationMode.slice(1)} Mode — {getModeDescription(explorationMode)}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {!currentSession ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">✨</span>
                  Start New Experiment
                </h3>
                <p className="text-xs text-gray-600 mt-2">Give your experiment a name and begin exploring safely</p>
              </div>
              <div className="p-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experiment Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    placeholder="e.g., Test new AI suggestions"
                    value={experimentName}
                    onChange={(e) => setExperimentName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && experimentName.trim() && startExperiment(experimentName, 'Custom experiment created by user')}
                  />
                </div>
                <button
                  onClick={() => startExperiment(
                    experimentName || 'Quick Experiment',
                    'Custom experiment created by user'
                  )}
                  disabled={!experimentName.trim()}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-base"
                >
                  🚀 Start Experiment
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active Experiment Header */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-blue-900 mb-1">
                      🧪 Active Experiment: {currentSession.name}
                    </h3>
                    <p className="text-sm text-blue-700">{currentSession.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-xs font-semibold whitespace-nowrap ml-4">
                    {currentSession.changes.length} changes
                  </span>
                </div>
                <div className="flex gap-2 pt-4 border-t border-blue-200">
                  <button
                    onClick={undoLastChange}
                    disabled={currentSession.changes.length === 0}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    ⏮️ Undo Last
                  </button>
                  <button
                    onClick={() => endExperiment(false)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    ❌ Discard All
                  </button>
                  <button
                    onClick={() => endExperiment(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium ml-auto"
                  >
                    ✅ Save & Apply
                  </button>
                </div>
              </div>

              {/* Experiment Workspace */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <span className="mr-2">🔬</span>
                    Experiment Workspace
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">All changes are isolated and reversible</p>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Try an experimental change:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => makeExperimentalChange('Changed color scheme to dark mode')}
                        className="px-4 py-3 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors font-medium"
                      >
                        🌙 Dark Mode
                      </button>
                      <button
                        onClick={() => makeExperimentalChange('Enabled advanced AI suggestions')}
                        className="px-4 py-3 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors font-medium"
                      >
                        ✨ AI Boost
                      </button>
                      <button
                        onClick={() => makeExperimentalChange('Rearranged interface layout')}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium"
                      >
                        🎨 New Layout
                      </button>
                      <button
                        onClick={() => makeExperimentalChange('Added experimental feature')}
                        className="px-4 py-3 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors font-medium"
                      >
                        🚀 Beta Feature
                      </button>
                      <button
                        onClick={() => makeExperimentalChange('Delete old configuration files')}
                        className="px-4 py-3 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors font-medium"
                      >
                        🗑️ Delete Files
                      </button>
                      <button
                        onClick={() => makeExperimentalChange('Updated notification settings')}
                        className="px-4 py-3 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors font-medium"
                      >
                        🔔 Notifications
                      </button>
                    </div>
                  </div>

                  {currentSession.changes.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="mr-2">📝</span>
                        Tracked Changes ({currentSession.changes.length})
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {currentSession.changes.map((change, index) => (
                          <div key={index} className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex items-start">
                            <span className="font-semibold text-gray-400 mr-3 flex-shrink-0">{index + 1}.</span>
                            <span>{change}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentSession.changes.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
                        <span className="text-3xl">🧪</span>
                      </div>
                      <p className="text-sm font-medium mb-1">No changes made yet</p>
                      <p className="text-xs">Click any button above to start experimenting safely</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Safety Guards - Primary Panel */}
          <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-2 border-yellow-400 rounded-lg shadow-lg overflow-hidden sticky top-6">
            <div className="bg-gradient-to-r from-yellow-200 to-amber-200 px-6 py-5 border-b-2 border-yellow-300">
              <h3 className="font-bold text-yellow-900 text-xl flex items-center">
                <span className="mr-3 text-3xl">🛡️</span>
                Safety Guards
              </h3>
              <p className="text-sm text-yellow-800 mt-2 font-medium">Your protection is always active</p>
            </div>
            <div className="p-6">
              {safetyGuards.length > 0 ? (
                <div className="space-y-4">
                  {safetyGuards.map(guard => (
                    <div
                      key={guard.id}
                      onClick={() => setExpandedGuard(expandedGuard === guard.id ? null : guard.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all active:scale-[0.98] ${getSafetyGuardColor(guard.level)} hover:shadow-lg hover:-translate-y-0.5`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl flex-shrink-0 mt-1">{getSafetyGuardIcon(guard.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">
                            {guard.type}
                          </p>
                          <p className="text-sm font-semibold leading-snug">{guard.message}</p>
                          {expandedGuard === guard.id && (
                            <div className="mt-3 pt-3 border-t text-xs opacity-80 font-medium">
                              <p>Protection Level: <span className="font-bold text-gray-700">{guard.level}</span></p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-base font-semibold text-yellow-900 mb-1">All Systems Protected</p>
                  <p className="text-sm text-yellow-800">Destructive actions will trigger guards</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}