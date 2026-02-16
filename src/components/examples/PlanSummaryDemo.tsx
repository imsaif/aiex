'use client';

import React, { useState, useEffect, useRef } from 'react';
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

export default function PlanSummaryDemo() {
  const [subtasks, setSubtasks] = useState<Subtask[]>([
    { id: 1, title: 'Check public SEC filings for Q3 revenue data', status: 'completed', detail: 'Found 3 relevant filings' },
    { id: 2, title: 'Review analyst reports from major firms', status: 'in-progress', detail: 'Checking Goldman, Morgan Stanley, JPMorgan' },
    { id: 3, title: 'Compare pricing tiers across 5 competitors', status: 'pending' },
    { id: 4, title: 'Compile findings into summary report', status: 'pending' },
  ]);

  const [assumptions, setAssumptions] = useState<Assumption[]>([
    { id: 1, text: 'US-market pricing only', editing: false },
    { id: 2, text: 'Enterprise tier comparisons (not consumer)', editing: false },
    { id: 3, text: 'Current quarter data preferred over historical', editing: false },
  ]);

  const [showStrategy, setShowStrategy] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSubtasks(prev => {
        const inProgress = prev.findIndex(t => t.status === 'in-progress');
        if (inProgress === -1) return prev;
        const next = prev.map((t, i) => {
          if (i === inProgress) return { ...t, status: 'completed' as const, detail: t.detail || 'Done' };
          if (i === inProgress + 1) return { ...t, status: 'in-progress' as const };
          return t;
        });
        return next;
      });
    }, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const completedCount = subtasks.filter(t => t.status === 'completed').length;
  const progress = (completedCount / subtasks.length) * 100;

  const toggleEditAssumption = (id: number) => {
    setAssumptions(prev => prev.map(a => a.id === id ? { ...a, editing: !a.editing } : a));
  };

  const updateAssumption = (id: number, text: string) => {
    setAssumptions(prev => prev.map(a => a.id === id ? { ...a, text, editing: false } : a));
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
        {/* Goal interpretation */}
        <div className="px-6 py-4 border-b border-primary">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-1">Goal</p>
          <h3 className="text-lg font-semibold text-text-primary">Research competitor pricing for Q3 report</h3>
          <p className="text-sm text-text-secondary mt-1">Analyzing pricing data across 5 SaaS competitors in the US enterprise market.</p>
        </div>

        {/* Strategy (collapsible) */}
        <div className="px-6 py-3 border-b border-primary">
          <button onClick={() => setShowStrategy(!showStrategy)} className="flex items-center gap-2 text-sm font-medium text-text-primary w-full">
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
        <div className="px-6 py-4">
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
                  <button onClick={() => toggleEditAssumption(a.id)} className="text-sm text-text-secondary hover:text-text-primary transition-colors text-left">
                    {a.text}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
