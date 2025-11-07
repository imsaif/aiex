'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  privacyLevel: 'high' | 'medium' | 'low';
  dataUsed: string[];
  tradeoff: string;
}

interface DataCategory {
  category: string;
  items: string[];
  stored: boolean;
  shared: boolean;
}

export default function PrivacyFirstDesignDemo() {
  const [settings, setSettings] = useState<PrivacySetting[]>([
    {
      id: 'local-processing',
      name: 'Local AI Processing',
      description: 'Process AI tasks on your device without sending data to cloud',
      enabled: true,
      privacyLevel: 'high',
      dataUsed: ['Device data only'],
      tradeoff: 'Slower processing for complex tasks'
    },
    {
      id: 'conversation-history',
      name: 'Conversation History',
      description: 'Save conversation history for context across sessions',
      enabled: false,
      privacyLevel: 'medium',
      dataUsed: ['Chat messages', 'Timestamps'],
      tradeoff: 'AI cannot remember previous conversations'
    },
    {
      id: 'personalization',
      name: 'AI Personalization',
      description: 'Learn from your usage to provide personalized suggestions',
      enabled: false,
      privacyLevel: 'medium',
      dataUsed: ['Usage patterns', 'Preferences', 'Interaction history'],
      tradeoff: 'Generic responses, no personalized recommendations'
    },
    {
      id: 'cloud-sync',
      name: 'Cloud Synchronization',
      description: 'Sync AI data across your devices using encrypted cloud storage',
      enabled: false,
      privacyLevel: 'low',
      dataUsed: ['All AI interactions', 'Settings', 'User preferences'],
      tradeoff: 'Data not available across devices'
    }
  ]);

  const [dataCategories] = useState<DataCategory[]>([
    {
      category: 'Conversation Data',
      items: ['Messages', 'Timestamps', 'Topics'],
      stored: false,
      shared: false
    },
    {
      category: 'Usage Analytics',
      items: ['Feature usage', 'Error reports'],
      stored: false,
      shared: false
    },
    {
      category: 'Device Information',
      items: ['OS version', 'App version'],
      stored: true,
      shared: false
    }
  ]);

  const [showDataFlow, setShowDataFlow] = useState(false);

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(setting =>
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const getPrivacyLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const exportData = () => {
    alert('Your data would be exported as JSON file. In a real app, this would trigger a download.');
  };

  const deleteAllData = () => {
    if (confirm('Are you sure you want to delete all AI data? This cannot be undone.')) {
      setSettings(prev => prev.map(s => ({ ...s, enabled: false })));
      alert('All data deleted. AI features reset to privacy-first defaults.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Try this:</strong> Toggle privacy settings and see clear explanations of trade-offs. Privacy-first means transparency!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 space-y-3">
          <h3 className="font-semibold text-lg mb-3">Privacy Controls</h3>

          {settings.map(setting => (
            <motion.div
              key={setting.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
              layout
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{setting.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded ${getPrivacyLevelColor(setting.privacyLevel)}`}>
                      {setting.privacyLevel} privacy
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{setting.description}</p>
                </div>
                <button
                  onClick={() => toggleSetting(setting.id)}
                  className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    setting.enabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      setting.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <AnimatePresence>
                {setting.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-gray-200"
                  >
                    <div className="text-xs space-y-2">
                      <div>
                        <span className="font-medium text-gray-700">Data used:</span>
                        <span className="text-gray-600 ml-1">{setting.dataUsed.join(', ')}</span>
                      </div>
                      {!setting.enabled && (
                        <div className="text-yellow-600">
                          <span className="font-medium">Trade-off:</span>
                          <span className="ml-1">{setting.tradeoff}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Data Categories</h3>
            <div className="space-y-3">
              {dataCategories.map((category, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-medium text-gray-700 mb-1">{category.category}</div>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    {category.items.map((item, i) => (
                      <div key={i}>• {item}</div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2 text-xs">
                    <span className={category.stored ? 'text-blue-600' : 'text-gray-400'}>
                      {category.stored ? '✓ Stored' : '✗ Not stored'}
                    </span>
                    <span className={category.shared ? 'text-red-600' : 'text-green-600'}>
                      {category.shared ? '✗ Shared' : '✓ Private'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowDataFlow(!showDataFlow)}
            className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
          >
            {showDataFlow ? 'Hide' : 'Show'} Data Flow Diagram
          </button>

          <div className="space-y-2">
            <button
              onClick={exportData}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Export My Data
            </button>
            <button
              onClick={deleteAllData}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Delete All Data
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDataFlow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
          >
            <h4 className="font-semibold mb-3">Data Flow</h4>
            <div className="flex items-center justify-around text-sm">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">📱</span>
                </div>
                <div className="font-medium">Your Device</div>
                <div className="text-xs text-gray-600">Local processing</div>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🔒</span>
                </div>
                <div className="font-medium">Encrypted</div>
                <div className="text-xs text-gray-600">End-to-end</div>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="text-center opacity-50">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">☁️</span>
                </div>
                <div className="font-medium">Cloud (Optional)</div>
                <div className="text-xs text-gray-600">Only if enabled</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
