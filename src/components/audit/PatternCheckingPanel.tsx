'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

export type PatternStatus = 'ready' | 'checking' | 'success' | 'warning' | 'error';

interface PatternCheckingPanelProps {
  patternStatuses: Record<string, PatternStatus>;
  checkingPatternIndex: number;
  isAnalyzing: boolean;
}

// All 28 AI UX patterns grouped by category
const patternsByCategory = [
  {
    category: 'Trustworthy AI',
    patterns: [
      { id: 'confidence-visualization', name: 'Confidence Visualization' },
      { id: 'error-recovery', name: 'Error Recovery' },
      { id: 'explainable-ai', name: 'Explainable AI' },
      { id: 'responsible-ai', name: 'Responsible AI Design' },
      { id: 'safe-exploration', name: 'Safe Exploration' },
    ],
  },
  {
    category: 'Human Collaboration',
    patterns: [
      { id: 'augmented-creation', name: 'Augmented Creation' },
      { id: 'collaborative-ai', name: 'Collaborative AI' },
      { id: 'contextual-assistance', name: 'Contextual Assistance' },
      { id: 'feedback-loops', name: 'Feedback Loops' },
      { id: 'graceful-handoff', name: 'Graceful Handoff' },
      { id: 'human-in-the-loop', name: 'Human-in-the-Loop' },
    ],
  },
  {
    category: 'Natural Interaction',
    patterns: [
      { id: 'context-switching', name: 'Context Switching' },
      { id: 'conversational-ui', name: 'Conversational UI' },
      { id: 'multimodal-interaction', name: 'Multimodal Interaction' },
      { id: 'progressive-disclosure', name: 'Progressive Disclosure' },
    ],
  },
  {
    category: 'Safety & Prevention',
    patterns: [
      { id: 'anti-manipulation', name: 'Anti-Manipulation' },
      { id: 'crisis-detection', name: 'Crisis Detection' },
      { id: 'session-degradation', name: 'Session Degradation' },
      { id: 'vulnerable-user-protection', name: 'Vulnerable User Protection' },
    ],
  },
  {
    category: 'Adaptive Systems',
    patterns: [
      { id: 'adaptive-interfaces', name: 'Adaptive Interfaces' },
      { id: 'ambient-intelligence', name: 'Ambient Intelligence' },
      { id: 'guided-learning', name: 'Guided Learning' },
      { id: 'predictive-anticipation', name: 'Predictive Anticipation' },
    ],
  },
  {
    category: 'Privacy & Control',
    patterns: [
      { id: 'privacy-first', name: 'Privacy-First Design' },
      { id: 'selective-memory', name: 'Selective Memory' },
    ],
  },
  {
    category: 'Performance',
    patterns: [
      { id: 'intelligent-caching', name: 'Intelligent Caching' },
      { id: 'progressive-enhancement', name: 'Progressive Enhancement' },
    ],
  },
  {
    category: 'Accessibility',
    patterns: [
      { id: 'universal-access', name: 'Universal Access' },
    ],
  },
];

function StatusIcon({ status }: { status: PatternStatus }) {
  if (status === 'ready') {
    return <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />;
  }

  if (status === 'checking') {
    return (
      <motion.div
        className="w-4 h-4 rounded-full border-2 border-t-blue-600 dark:border-t-blue-400 border-r-blue-600 dark:border-r-blue-400 border-b-transparent border-l-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
    );
  }

  if (status === 'success') {
    return <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-500" />;
  }

  if (status === 'warning') {
    return <ExclamationTriangleIcon className="w-4 h-4 text-amber-600 dark:text-amber-500" />;
  }

  if (status === 'error') {
    return <XCircleIcon className="w-4 h-4 text-red-600 dark:text-red-500" />;
  }

  return null;
}

export function PatternCheckingPanel({ patternStatuses, checkingPatternIndex, isAnalyzing }: PatternCheckingPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Auto-expand when analysis starts
  useEffect(() => {
    if (isAnalyzing) {
      setIsCollapsed(false);
    }
  }, [isAnalyzing]);

  return (
    <div className="flex flex-col bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="px-4 py-4 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between gap-2 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors w-full text-left"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Pattern Analysis
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            28 patterns ready to evaluate
          </p>
        </div>

        <div className="flex-shrink-0">
          {isCollapsed ? (
            <ChevronDownIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          ) : (
            <ChevronUpIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          )}
        </div>
      </button>

      {/* Patterns List */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 py-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
              <div className="space-y-5">
                {patternsByCategory.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 px-1">
                      {category.category}
                    </h3>
                    <div className="space-y-0.5">
                      {category.patterns.map((pattern) => {
                        const status = patternStatuses[pattern.id] || 'ready';
                        return (
                          <motion.div
                            key={pattern.id}
                            className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors"
                            initial={{ opacity: 0.7 }}
                            animate={{ opacity: status === 'checking' ? 1 : 0.7 }}
                          >
                            <StatusIcon status={status} />
                            <span className="text-xs text-slate-900 dark:text-slate-100 truncate flex-1 font-medium">
                              {pattern.name}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
