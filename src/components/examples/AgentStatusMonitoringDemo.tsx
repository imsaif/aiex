'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentTask {
  id: number;
  title: string;
  status: 'running' | 'paused' | 'completed';
  progress: number;
  estimatedTime: string;
  detail: string;
}

export default function AgentStatusMonitoringDemo() {
  const [expanded, setExpanded] = useState(false);
  const [tasks, setTasks] = useState<AgentTask[]>([
    { id: 1, title: 'Analyzing Q3 reports', status: 'running', progress: 67, estimatedTime: '~2 min left', detail: 'Scanning 12 documents for revenue data' },
    { id: 2, title: 'Scheduling team syncs', status: 'paused', progress: 40, estimatedTime: 'Waiting for input', detail: 'Need confirmation on Thursday 2pm slot' },
    { id: 3, title: 'Email digest compiled', status: 'completed', progress: 100, estimatedTime: 'Done', detail: '47 emails summarized, 3 flagged for review' },
  ]);

  const [showNotification, setShowNotification] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate progress
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTasks(prev => prev.map(t => {
        if (t.status === 'running' && t.progress < 100) {
          const newProgress = Math.min(100, t.progress + 2);
          return {
            ...t,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' as const : 'running' as const,
            estimatedTime: newProgress >= 100 ? 'Done' : `~${Math.ceil((100 - newProgress) / 10)} min left`,
          };
        }
        return t;
      }));
    }, 500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Show notification after 3s
  useEffect(() => {
    const timer = setTimeout(() => setShowNotification(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const activeCount = tasks.filter(t => t.status === 'running').length;
  const pausedCount = tasks.filter(t => t.status === 'paused').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return { icon: '\u{25B6}', color: 'text-status-success', bg: 'bg-status-success/10' };
      case 'paused': return { icon: '\u{23F8}', color: 'text-status-warning', bg: 'bg-status-warning/10' };
      case 'completed': return { icon: '\u{2713}', color: 'text-accent-primary', bg: 'bg-accent-subtle' };
      default: return { icon: '?', color: 'text-text-secondary', bg: 'bg-surface-secondary' };
    }
  };

  const dismissNotification = () => setShowNotification(false);

  const resolveTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'running' as const } : t));
    setShowNotification(false);
  };

  const resetDemo = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTasks([
      { id: 1, title: 'Analyzing Q3 reports', status: 'running', progress: 67, estimatedTime: '~2 min left', detail: 'Scanning 12 documents for revenue data' },
      { id: 2, title: 'Scheduling team syncs', status: 'paused', progress: 40, estimatedTime: 'Waiting for input', detail: 'Need confirmation on Thursday 2pm slot' },
      { id: 3, title: 'Email digest compiled', status: 'completed', progress: 100, estimatedTime: 'Done', detail: '47 emails summarized, 3 flagged for review' },
    ]);
    setExpanded(false);
    setShowNotification(false);
    setTimeout(() => setShowNotification(true), 3000);
    intervalRef.current = setInterval(() => {
      setTasks(prev => prev.map(t => {
        if (t.status === 'running' && t.progress < 100) {
          const newProgress = Math.min(100, t.progress + 2);
          return {
            ...t,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' as const : 'running' as const,
            estimatedTime: newProgress >= 100 ? 'Done' : `~${Math.ceil((100 - newProgress) / 10)} min left`,
          };
        }
        return t;
      }));
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Reset button */}
      <div className="flex justify-end">
        <button onClick={resetDemo} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
          Reset Demo
        </button>
      </div>
      {/* Attention notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-surface-primary border border-warning rounded-xl p-4 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-status-warning/10 flex items-center justify-center text-text-primary font-semibold">!</span>
              <div className="flex-1">
                <p className="font-medium text-text-primary text-sm">Agent needs your input</p>
                <p className="text-xs text-text-secondary mt-1">Scheduling team syncs: Need confirmation on Thursday 2pm slot</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => resolveTask(2)} className="text-xs px-3 py-1.5 bg-accent-primary text-white rounded-lg">Confirm 2pm</button>
                  <button onClick={dismissNotification} className="text-xs px-3 py-1.5 bg-surface-secondary text-text-secondary rounded-lg">Later</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient badge + expandable panel */}
      <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
        {/* Badge / header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-secondary active:bg-surface-tertiary transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center">
                <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              {activeCount > 0 && (
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-accent-primary rounded-full flex items-center justify-center text-[9px] text-white font-bold"
                >
                  {activeCount}
                </motion.span>
              )}
            </div>
            <div className="text-left">
              <span className="text-sm font-medium text-text-primary">Agent Tasks</span>
              <span className="text-xs text-text-secondary ml-2">
                {activeCount} running{pausedCount > 0 ? `, ${pausedCount} paused` : ''}
              </span>
            </div>
          </div>
          <svg className={`w-4 h-4 text-text-tertiary transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t border-primary"
            >
              <div className="divide-y divide-primary">
                {tasks.map(task => {
                  const statusInfo = getStatusIcon(task.status);
                  return (
                    <div key={task.id} className="px-4 py-3">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${statusInfo.bg} ${statusInfo.color}`}>
                          {statusInfo.icon}
                        </span>
                        <span className="text-sm font-medium text-text-primary flex-1">{task.title}</span>
                        <span className="text-xs text-text-tertiary">{task.estimatedTime}</span>
                      </div>
                      {task.status !== 'completed' && (
                        <div className="ml-8">
                          <div className="w-full bg-surface-secondary rounded-full h-1.5 mb-1">
                            <motion.div
                              className={`h-1.5 rounded-full ${task.status === 'running' ? 'bg-accent-primary' : 'bg-status-warning'}`}
                              animate={{ width: `${task.progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <p className="text-[10px] text-text-tertiary">{task.detail}</p>
                        </div>
                      )}
                      {task.status === 'completed' && (
                        <p className="text-[10px] text-text-tertiary ml-8">{task.detail}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
