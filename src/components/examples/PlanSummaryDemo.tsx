'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Subtask {
  id: number;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  detail?: string;
}

interface Assumption {
  id: number;
  text: string;
  editing: boolean;
}

const INITIAL_SUBTASKS: Subtask[] = [
  { id: 1, title: 'Check public SEC filings for Q3 revenue data', status: 'pending', detail: 'Found 3 relevant filings' },
  { id: 2, title: 'Review analyst reports from major firms', status: 'pending', detail: 'Checking Goldman, Morgan Stanley, JPMorgan' },
  { id: 3, title: 'Compare pricing tiers across 5 competitors', status: 'pending', detail: 'Done' },
  { id: 4, title: 'Compile findings into summary report', status: 'pending', detail: 'Done' },
];

const INITIAL_ASSUMPTIONS: Assumption[] = [
  { id: 1, text: 'US-market pricing only', editing: false },
  { id: 2, text: 'Enterprise tier comparisons (not consumer)', editing: false },
  { id: 3, text: 'Current quarter data preferred over historical', editing: false },
];

type Phase = 'idle' | 'running' | 'done';

export default function PlanSummaryDemo() {
  const [subtasks, setSubtasks] = useState<Subtask[]>(INITIAL_SUBTASKS);
  const [assumptions, setAssumptions] = useState<Assumption[]>(INITIAL_ASSUMPTIONS);
  const [showStrategy, setShowStrategy] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Step through subtasks one at a time
  useEffect(() => {
    if (phase !== 'running') return;

    const inProgressIndex = subtasks.findIndex(t => t.status === 'in-progress');
    const firstPending = subtasks.findIndex(t => t.status === 'pending');

    if (inProgressIndex === -1 && firstPending === -1) {
      // All done
      setPhase('done');
      return;
    }

    if (inProgressIndex === -1 && firstPending !== -1) {
      // Start the first pending task
      timerRef.current = setTimeout(() => {
        setSubtasks(prev => prev.map((t, i) =>
          i === firstPending ? { ...t, status: 'in-progress' as const } : t
        ));
      }, 400);
    } else if (inProgressIndex !== -1) {
      // Complete current, start next
      timerRef.current = setTimeout(() => {
        setSubtasks(prev => prev.map((t, i) => {
          if (i === inProgressIndex) return { ...t, status: 'completed' as const };
          if (i === inProgressIndex + 1 && t.status === 'pending') return { ...t, status: 'in-progress' as const };
          return t;
        }));
      }, 1500);
    }

    return () => clearTimer();
  }, [phase, subtasks, clearTimer]);

  const startDemo = useCallback(() => {
    clearTimer();
    setSubtasks(INITIAL_SUBTASKS.map(t => ({ ...t, status: 'pending' as const })));
    setAssumptions(INITIAL_ASSUMPTIONS.map(a => ({ ...a, editing: false })));
    setShowStrategy(false);
    setPhase('running');
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setSubtasks(INITIAL_SUBTASKS.map(t => ({ ...t, status: 'pending' as const })));
    setAssumptions(INITIAL_ASSUMPTIONS.map(a => ({ ...a, editing: false })));
    setShowStrategy(false);
    setPhase('idle');
  }, [clearTimer]);

  const completedCount = subtasks.filter(t => t.status === 'completed').length;
  const progress = (completedCount / subtasks.length) * 100;

  const toggleEditAssumption = (id: number) => {
    setAssumptions(prev => prev.map(a => a.id === id ? { ...a, editing: !a.editing } : a));
  };

  const updateAssumption = (id: number, text: string) => {
    setAssumptions(prev => prev.map(a => a.id === id ? { ...a, text, editing: false } : a));
  };

  if (phase === 'idle') {
    return (
      <div className="max-w-xl mx-auto" data-clarity-region="demo-interactive">
        <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
          <div className="px-6 py-10 flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center">
              <svg className="w-6 h-6 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Agent task:</p>
              <p className="text-text-primary font-medium">&ldquo;Research competitor pricing for Q3 report&rdquo;</p>
            </div>
            <button
              onClick={startDemo}
              className="mt-2 px-5 py-2.5 text-sm font-medium bg-text-primary text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              Start Research
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto" data-clarity-region="demo-interactive">
      <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
        {/* Goal interpretation */}
        <div className="px-6 py-4 border-b border-primary">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-1">Goal</p>
          <h3 className="text-lg font-semibold text-text-primary">Research competitor pricing for Q3 report</h3>
          <p className="text-sm text-text-secondary mt-1">Analyzing pricing data across 5 SaaS competitors in the US enterprise market.</p>
        </div>

        {/* Strategy (collapsible) */}
        <div className="px-6 py-3 border-b border-primary">
          <button onClick={() => setShowStrategy(!showStrategy)} className="flex items-center gap-2 text-sm font-medium text-text-primary w-full cursor-pointer rounded-lg py-1 -my-1 hover:bg-surface-secondary active:bg-surface-tertiary transition-colors">
            <svg className={`w-4 h-4 transition-transform ${showStrategy ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            Strategy
          </button>
          {showStrategy && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-text-secondary mt-2 ml-6">
              Checking public SEC filings first because they are the most reliable source, then supplementing with analyst reports for commentary and competitor website pricing pages for current tiers.
            </motion.p>
          )}
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b border-primary">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Progress</span>
            <span className="text-sm text-text-secondary">{completedCount}/{subtasks.length} steps</span>
          </div>
          <div className="w-full bg-surface-secondary rounded-full h-1.5 mb-4">
            <motion.div
              className="bg-green-500 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="space-y-3">
            {subtasks.map(task => (
              <div key={task.id} className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                  task.status === 'completed' ? 'bg-green-500' :
                  task.status === 'in-progress' ? 'bg-blue-500 animate-pulse' :
                  'bg-surface-secondary'
                }`}>
                  {task.status === 'completed' && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div>
                  <span className={`text-sm ${task.status === 'completed' ? 'text-text-tertiary line-through' : 'text-text-primary'}`}>{task.title}</span>
                  {task.detail && task.status !== 'pending' && <p className="text-xs text-text-tertiary mt-0.5">{task.detail}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assumptions */}
        <div className="px-6 py-4 border-b border-primary">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">Assumptions (click to edit)</p>
          <div className="space-y-2">
            {assumptions.map(a => (
              <div key={a.id} className="flex items-center gap-2">
                <span className="text-amber-500 text-xs">*</span>
                {a.editing ? (
                  <input
                    type="text"
                    defaultValue={a.text}
                    onBlur={(e) => updateAssumption(a.id, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && updateAssumption(a.id, (e.target as HTMLInputElement).value)}
                    className="text-sm bg-surface-secondary border border-primary rounded px-2 py-1 flex-1 text-text-primary focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <button onClick={() => toggleEditAssumption(a.id)} className="text-sm text-text-secondary hover:text-text-primary transition-colors text-left cursor-pointer">
                    {a.text}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 text-sm font-medium border border-primary rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
            Replay Demo
          </button>
        </div>
      </div>
    </div>
  );
}
