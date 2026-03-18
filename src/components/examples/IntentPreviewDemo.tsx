'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlannedAction {
  id: number;
  title: string;
  description: string;
  reversible: 'full' | 'partial' | 'none';
  estimatedTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'removed';
}

const INITIAL_ACTIONS: PlannedAction[] = [
  { id: 1, title: 'Draft reply to Sarah', description: 'Compose a response to Sarah\'s project update email with status summary.', reversible: 'full', estimatedTime: '10s', status: 'pending' },
  { id: 2, title: 'Attach Q3 report', description: 'Find and attach the Q3 financial report PDF from your documents.', reversible: 'full', estimatedTime: '5s', status: 'pending' },
  { id: 3, title: 'CC the design team', description: 'Add design-team@company.com to the CC field.', reversible: 'partial', estimatedTime: '2s', status: 'pending' },
  { id: 4, title: 'Send at 9am tomorrow', description: 'Schedule the email for delivery at 9:00 AM PST.', reversible: 'none', estimatedTime: '1s', status: 'pending' },
];

type Phase = 'idle' | 'planning' | 'review' | 'resolved';

export default function IntentPreviewDemo() {
  const [actions, setActions] = useState<PlannedAction[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [revealedCount, setRevealedCount] = useState(0);
  const [planningText, setPlanningText] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startPlanning = useCallback(() => {
    clearTimers();
    setActions(INITIAL_ACTIONS.map(a => ({ ...a, status: 'pending' })));
    setRevealedCount(0);
    setPhase('planning');
    setPlanningText('Analyzing request');
  }, [clearTimers]);

  // Planning phase: reveal actions one by one
  useEffect(() => {
    if (phase !== 'planning') return;

    const planningTexts = [
      'Analyzing request',
      'Identifying required actions',
      'Checking dependencies',
      'Estimating time',
      'Finalizing plan',
    ];

    if (revealedCount < INITIAL_ACTIONS.length) {
      timerRef.current = setTimeout(() => {
        setRevealedCount(prev => prev + 1);
        setPlanningText(planningTexts[Math.min(revealedCount + 1, planningTexts.length - 1)]);
      }, 800);
    } else {
      // All revealed, short pause then move to review
      timerRef.current = setTimeout(() => {
        setPhase('review');
      }, 600);
    }

    return () => clearTimers();
  }, [phase, revealedCount, clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setActions([]);
    setRevealedCount(0);
    setPhase('idle');
    setPlanningText('');
  }, [clearTimers]);

  const getReversibilityBadge = (level: string) => {
    switch (level) {
      case 'full': return { label: 'Reversible', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
      case 'partial': return { label: 'Partially reversible', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
      case 'none': return { label: 'Irreversible', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
      default: return { label: 'Unknown', className: 'bg-surface-secondary text-text-secondary' };
    }
  };

  const removeAction = (id: number) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'removed' } : a));
  };

  const approveAll = () => {
    setActions(prev => prev.map(a => a.status === 'pending' ? { ...a, status: 'approved' } : a));
    setPhase('resolved');
  };

  const rejectAll = () => {
    setActions(prev => prev.map(a => a.status === 'pending' ? { ...a, status: 'rejected' } : a));
    setPhase('resolved');
  };

  const pendingActions = actions.filter(a => a.status === 'pending');
  const visibleActions = actions.filter(a => a.status !== 'removed');
  const revealedActions = visibleActions.slice(0, revealedCount);
  const totalTime = visibleActions.reduce((sum, a) => sum + parseInt(a.estimatedTime), 0);

  // Idle state — prompt to start
  if (phase === 'idle') {
    return (
      <div className="max-w-xl mx-auto" data-clarity-region="demo-interactive">
        <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
          <div className="px-6 py-10 flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center">
              <svg className="w-6 h-6 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">You said:</p>
              <p className="text-text-primary font-medium">&ldquo;Reply to Sarah&rsquo;s email with the Q3 report and loop in design&rdquo;</p>
            </div>
            <button
              onClick={startPlanning}
              className="mt-2 px-5 py-2.5 text-sm font-medium bg-text-primary text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              Plan Actions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto" data-clarity-region="demo-interactive">
      <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-primary">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-text-primary">Planned Actions</h3>
                {phase === 'planning' && (
                  <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                    <motion.span
                      className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    {planningText}
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary mt-1">
                {phase === 'planning'
                  ? 'Agent is building an action plan...'
                  : phase === 'review'
                    ? 'Review what the agent will do before approving.'
                    : 'Actions have been processed.'}
              </p>
            </div>
            {revealedCount > 0 && (
              <span className="text-sm text-text-tertiary">
                {phase === 'planning'
                  ? `${revealedCount}/${INITIAL_ACTIONS.length} steps`
                  : `${visibleActions.length} steps ~ ${totalTime}s`}
              </span>
            )}
          </div>
        </div>

        {/* Action list */}
        <div className="divide-y divide-primary">
          <AnimatePresence mode="popLayout">
            {(phase === 'planning' ? revealedActions : visibleActions).map((action, index) => {
              const badge = getReversibilityBadge(action.reversible);
              const isJustRevealed = phase === 'planning' && index === revealedCount - 1;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="px-6 py-4"
                >
                  <div className="flex items-start gap-3">
                    <motion.span
                      className="flex-shrink-0 w-6 h-6 rounded-full bg-surface-secondary flex items-center justify-center text-xs font-medium text-text-secondary mt-0.5"
                      initial={isJustRevealed ? { scale: 0.5 } : false}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      {index + 1}
                    </motion.span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-text-primary">{action.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${badge.className}`}>{badge.label}</span>
                        {action.status !== 'pending' && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              action.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}
                          >
                            {action.status}
                          </motion.span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary">{action.description}</p>
                    </div>
                    {action.status === 'pending' && phase === 'review' && (
                      <button
                        onClick={() => removeAction(action.id)}
                        className="text-text-tertiary hover:text-red-500 transition-colors flex-shrink-0 cursor-pointer"
                        title="Remove step"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Skeleton placeholder during planning */}
          {phase === 'planning' && revealedCount < INITIAL_ACTIONS.length && (
            <div className="px-6 py-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-surface-secondary mt-0.5 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-36 bg-surface-secondary rounded animate-pulse" />
                  <div className="h-3 w-56 bg-surface-secondary rounded animate-pulse opacity-60" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-primary flex items-center justify-between">
          {phase === 'planning' ? (
            <div className="flex items-center gap-2 text-sm text-text-tertiary w-full justify-center">
              <motion.div
                className="flex gap-1"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                <span className="w-1 h-1 rounded-full bg-text-tertiary" />
              </motion.div>
              <span>Building plan</span>
            </div>
          ) : phase === 'resolved' ? (
            <button onClick={reset} className="px-4 py-2 text-sm font-medium border border-primary rounded-lg text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer flex items-center gap-1.5 mx-auto">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
              Replay Demo
            </button>
          ) : (
            <>
              <button onClick={reset} className="px-3 py-2 text-sm font-medium border border-primary rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
                Replay
              </button>
              <div className="flex items-center gap-2">
                <button onClick={rejectAll} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-red-600 transition-colors cursor-pointer" disabled={pendingActions.length === 0}>
                  Reject All
                </button>
                <button onClick={approveAll} className="px-4 py-2 text-sm font-medium bg-text-primary text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer" disabled={pendingActions.length === 0}>
                  Approve {pendingActions.length} Actions
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
