'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DomainTrust {
  domain: string;
  icon: string;
  accuracy: number;
  tasksCompleted: number;
  currentLevel: number;
  trend: 'up' | 'stable' | 'down';
  canUpgrade: boolean;
}

export default function TrustCalibrationDemo() {
  const [domains, setDomains] = useState<DomainTrust[]>([
    { domain: 'Email Sorting', icon: '\u{1F4E7}', accuracy: 96, tasksCompleted: 234, currentLevel: 3, trend: 'up', canUpgrade: true },
    { domain: 'Calendar Management', icon: '\u{1F4C5}', accuracy: 89, tasksCompleted: 87, currentLevel: 2, trend: 'stable', canUpgrade: false },
    { domain: 'Document Editing', icon: '\u{1F4DD}', accuracy: 78, tasksCompleted: 45, currentLevel: 1, trend: 'up', canUpgrade: false },
    { domain: 'Financial Reports', icon: '\u{1F4B0}', accuracy: 72, tasksCompleted: 12, currentLevel: 0, trend: 'down', canUpgrade: false },
  ]);

  const [showMilestone, setShowMilestone] = useState(true);
  const LEVELS = ['Suggest Only', 'Propose & Confirm', 'Act & Notify', 'Full Autonomy'];

  const upgradeLevel = (domain: string) => {
    setDomains(prev => prev.map(d =>
      d.domain === domain ? { ...d, currentLevel: Math.min(3, d.currentLevel + 1), canUpgrade: false } : d
    ));
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'bg-green-500';
    if (accuracy >= 80) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return { icon: '\u2191', color: 'text-green-500' };
      case 'down': return { icon: '\u2193', color: 'text-red-500' };
      default: return { icon: '\u2192', color: 'text-text-tertiary' };
    }
  };

  const totalTasks = domains.reduce((sum, d) => sum + d.tasksCompleted, 0);
  const avgAccuracy = Math.round(domains.reduce((sum, d) => sum + d.accuracy, 0) / domains.length);

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Milestone card */}
      {showMilestone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-primary border border-primary rounded-xl p-5 relative"
        >
          <button onClick={() => setShowMilestone(false)} className="absolute top-3 right-3 text-text-tertiary hover:text-text-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-2xl">{'\u{1F3C6}'}</div>
            <div>
              <p className="font-semibold text-text-primary">Milestone Reached!</p>
              <p className="text-sm text-text-secondary">{totalTasks} tasks completed with {avgAccuracy}% average accuracy</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Trust dashboard */}
      <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-primary">
          <h3 className="text-lg font-semibold text-text-primary">Trust Dashboard</h3>
          <p className="text-sm text-text-secondary">Performance by domain</p>
        </div>

        <div className="divide-y divide-primary">
          {domains.map(d => {
            const trend = getTrendIcon(d.trend);
            return (
              <div key={d.domain} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{d.icon}</span>
                    <span className="font-medium text-text-primary">{d.domain}</span>
                    <span className={`text-xs ${trend.color}`}>{trend.icon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{d.accuracy}%</span>
                    <span className="text-xs text-text-tertiary">({d.tasksCompleted} tasks)</span>
                  </div>
                </div>

                {/* Accuracy bar */}
                <div className="w-full bg-surface-secondary rounded-full h-2 mb-2">
                  <motion.div
                    className={`h-2 rounded-full ${getAccuracyColor(d.accuracy)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${d.accuracy}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-tertiary">Level: {LEVELS[d.currentLevel]}</span>
                  {d.canUpgrade && (
                    <button
                      onClick={() => upgradeLevel(d.domain)}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    >
                      Upgrade to {LEVELS[d.currentLevel + 1]}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
