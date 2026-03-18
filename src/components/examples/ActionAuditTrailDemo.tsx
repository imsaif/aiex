'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuditAction {
  id: number;
  title: string;
  detail: string;
  timestamp: string;
  reversible: 'full' | 'partial' | 'none';
  group: string;
  undone?: boolean;
  diff?: { before: string; after: string };
}

const MOCK_ACTIONS: AuditAction[] = [
  { id: 1, title: 'Reviewed brand guidelines', detail: 'Scanned color palette, typography, and spacing tokens', timestamp: '2:01 PM', reversible: 'full', group: 'Research' },
  { id: 2, title: 'Audited dashboard screens', detail: 'Found 3 inconsistent button styles across 8 screens', timestamp: '2:01 PM', reversible: 'full', group: 'Research' },
  { id: 3, title: 'Standardized button styles', detail: 'Updated secondary buttons to use consistent border radius and padding', timestamp: '2:02 PM', reversible: 'full', group: 'Design Updates', diff: { before: 'Mixed: 4px, 8px, 12px border radius', after: 'Unified: 8px border radius, 12px/24px padding' } },
  { id: 4, title: 'Updated color tokens', detail: 'Replaced 2 hardcoded hex values with design system tokens', timestamp: '2:03 PM', reversible: 'full', group: 'Design Updates', diff: { before: '#6B7280 and #1F2937 (hardcoded)', after: 'text-secondary and text-primary (tokens)' } },
  { id: 5, title: 'Ran accessibility check', detail: 'WCAG AA contrast — 7 passed, 1 warning on muted text', timestamp: '2:04 PM', reversible: 'partial', group: 'Verification' },
  { id: 6, title: 'Exported updated components', detail: 'Saved 5 components to the shared design library', timestamp: '2:05 PM', reversible: 'full', group: 'Publishing' },
  { id: 7, title: 'Published to design system', detail: 'Pushed updates live — visible to all team members', timestamp: '2:05 PM', reversible: 'none', group: 'Publishing' },
];

type Phase = 'idle' | 'running' | 'done';

export default function ActionAuditTrailDemo() {
  const [actions, setActions] = useState<AuditAction[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [revealedCount, setRevealedCount] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startDemo = useCallback(() => {
    clearTimer();
    setActions(MOCK_ACTIONS.map(a => ({ ...a, undone: false })));
    setRevealedCount(0);
    setExpandedId(null);
    setFilter('all');
    setPhase('running');
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setActions([]);
    setRevealedCount(0);
    setExpandedId(null);
    setFilter('all');
    setPhase('idle');
  }, [clearTimer]);

  // Reveal actions one by one
  useEffect(() => {
    if (phase !== 'running') return;

    if (revealedCount < MOCK_ACTIONS.length) {
      timerRef.current = setTimeout(() => {
        setRevealedCount(prev => prev + 1);
      }, 700);
    } else {
      timerRef.current = setTimeout(() => {
        setPhase('done');
      }, 400);
    }

    return () => clearTimer();
  }, [phase, revealedCount, clearTimer]);

  const undoAction = (id: number) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, undone: true } : a));
  };

  const getBadge = (level: string) => {
    switch (level) {
      case 'full': return { label: 'Reversible', cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
      case 'partial': return { label: 'Partial', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
      case 'none': return { label: 'Irreversible', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
      default: return { label: '', cls: '' };
    }
  };

  const getGroupIcon = (group: string) => {
    switch (group) {
      case 'Research': return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      );
      case 'Design Updates': return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
      );
      case 'Verification': return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      );
      case 'Publishing': return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
      );
      default: return null;
    }
  };

  const visibleActions = actions.slice(0, revealedCount);
  const groups = Array.from(new Set(MOCK_ACTIONS.map(a => a.group)));
  const filteredActions = filter === 'all' ? visibleActions : visibleActions.filter(a => a.group === filter);

  if (phase === 'idle') {
    return (
      <div className="max-w-2xl mx-auto" data-clarity-region="demo-interactive">
        <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
          <div className="px-6 py-10 flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center">
              <svg className="w-6 h-6 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Agent task:</p>
              <p className="text-text-primary font-medium">&ldquo;Audit the dashboard screens and fix design inconsistencies&rdquo;</p>
            </div>
            <button
              onClick={startDemo}
              className="mt-2 px-5 py-2.5 text-sm font-medium bg-text-primary text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              Run Agent
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto" data-clarity-region="demo-interactive">
      <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-primary">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-text-primary">Audit Trail</h3>
                {phase === 'running' && (
                  <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                    <motion.span
                      className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    Agent working
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary mt-0.5">
                {phase === 'running'
                  ? `${revealedCount} action${revealedCount !== 1 ? 's' : ''} recorded`
                  : `${visibleActions.length} actions completed`}
              </p>
            </div>
            <span className="text-xs text-text-tertiary">2:01 – 2:05 PM</span>
          </div>

          {/* Filter pills — only show when done */}
          {phase === 'done' && (
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setFilter('all')} className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${filter === 'all' ? 'bg-surface-secondary text-text-primary font-semibold' : 'bg-surface-secondary text-text-tertiary hover:text-text-secondary'}`}>All</button>
              {groups.map(g => (
                <button key={g} onClick={() => setFilter(g)} className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${filter === g ? 'bg-surface-secondary text-text-primary font-semibold' : 'bg-surface-secondary text-text-tertiary hover:text-text-secondary'}`}>{g}</button>
              ))}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[39px] top-0 bottom-0 w-px bg-primary" />

          <AnimatePresence mode="popLayout">
            {filteredActions.map((action) => {
              const badge = getBadge(action.reversible);
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`relative ${action.undone ? 'opacity-50' : ''}`}
                >
                  <div className="px-6 py-3 flex items-start gap-3">
                    {/* Timeline dot */}
                    <div className="relative z-10 flex-shrink-0 w-5 h-5 rounded-full bg-surface-primary border-2 border-primary flex items-center justify-center mt-0.5 text-text-tertiary">
                      {getGroupIcon(action.group)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className={`text-sm font-medium ${action.undone ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>{action.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                        {action.undone && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-secondary text-text-secondary">Reverted</span>}
                      </div>
                      <p className="text-xs text-text-secondary">{action.detail}</p>

                      {/* Diff view */}
                      {action.diff && expandedId === action.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 text-xs rounded-lg overflow-hidden border border-primary"
                        >
                          <div className="bg-red-50 dark:bg-red-900/20 px-3 py-1.5 text-red-700 dark:text-red-400 font-mono whitespace-pre-wrap">- {action.diff.before}</div>
                          <div className="bg-green-50 dark:bg-green-900/20 px-3 py-1.5 text-green-700 dark:text-green-400 font-mono whitespace-pre-wrap">+ {action.diff.after}</div>
                        </motion.div>
                      )}
                    </div>

                    {/* Actions + timestamp */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        {action.diff && phase === 'done' && (
                          <button onClick={() => setExpandedId(expandedId === action.id ? null : action.id)} className="text-xs text-text-tertiary hover:text-text-primary transition-colors cursor-pointer">
                            {expandedId === action.id ? 'Hide' : 'Diff'}
                          </button>
                        )}
                        {action.reversible !== 'none' && !action.undone && phase === 'done' && (
                          <button onClick={() => undoAction(action.id)} className="text-xs text-text-tertiary hover:text-red-500 transition-colors cursor-pointer">Undo</button>
                        )}
                      </div>
                      <span className="text-xs text-text-tertiary w-14 text-right">{action.timestamp}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Loading indicator during run */}
          {phase === 'running' && revealedCount < MOCK_ACTIONS.length && (
            <div className="px-6 py-3 flex items-start gap-3">
              <div className="relative z-10 flex-shrink-0 w-5 h-5 rounded-full bg-surface-primary border-2 border-primary mt-0.5 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-40 bg-surface-secondary rounded animate-pulse" />
                <div className="h-3 w-64 bg-surface-secondary rounded animate-pulse opacity-60" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-primary flex items-center justify-center">
          {phase === 'running' ? (
            <div className="flex items-center gap-2 text-sm text-text-tertiary">
              <motion.div
                className="flex gap-1"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                <span className="w-1 h-1 rounded-full bg-text-tertiary" />
              </motion.div>
              <span>Recording actions</span>
            </div>
          ) : (
            <button
              onClick={reset}
              className="px-4 py-2 text-sm font-medium border border-primary rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
              Replay Demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
