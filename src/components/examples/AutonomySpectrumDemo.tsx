'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AUTONOMY_LEVELS = [
  { id: 0, label: 'Suggest Only', description: 'Agent observes and surfaces recommendations, but never acts.', color: 'bg-blue-500', risk: 'None' },
  { id: 1, label: 'Propose & Confirm', description: 'Agent drafts actions and presents them for your approval.', color: 'bg-green-500', risk: 'Low' },
  { id: 2, label: 'Act & Notify', description: 'Agent executes automatically and notifies you with undo option.', color: 'bg-amber-500', risk: 'Medium' },
  { id: 3, label: 'Full Autonomy', description: 'Agent acts silently. Results appear in activity log only.', color: 'bg-red-500', risk: 'High' },
];

interface TaskSetting {
  task: string;
  icon: string;
  level: number;
  example: string[];
}

export default function AutonomySpectrumDemo() {
  const [tasks, setTasks] = useState<TaskSetting[]>([
    { task: 'Sort Inbox', icon: '\u{1F4E5}', level: 2, example: ['Suggest sorting rules', 'Draft sort rules for review', 'Auto-sort and notify', 'Silently sort all email'] },
    { task: 'Draft Replies', icon: '\u{270D}\u{FE0F}', level: 1, example: ['Suggest reply points', 'Draft full reply for review', 'Send draft and notify', 'Auto-reply silently'] },
    { task: 'Send Emails', icon: '\u{1F4E8}', level: 0, example: ['Suggest send times', 'Queue sends for approval', 'Send and notify', 'Send without confirmation'] },
    { task: 'Manage Calendar', icon: '\u{1F4C5}', level: 1, example: ['Suggest meeting times', 'Propose reschedules', 'Reschedule and notify', 'Full calendar control'] },
  ]);

  const [expandedTask, setExpandedTask] = useState<number | null>(null);

  const updateLevel = (index: number, level: number) => {
    setTasks(prev => prev.map((t, i) => i === index ? { ...t, level } : t));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-primary">
          <h3 className="text-lg font-semibold text-text-primary">Agent Autonomy Settings</h3>
          <p className="text-sm text-text-secondary mt-1">Control how independently your email agent operates per task type.</p>
        </div>

        <div className="divide-y divide-primary">
          {tasks.map((task, index) => (
            <div key={task.task} className="px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{task.icon}</span>
                  <div>
                    <span className="font-medium text-text-primary">{task.task}</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      task.level === 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      task.level === 1 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      task.level === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>{AUTONOMY_LEVELS[task.level].label}</span>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedTask(expandedTask === index ? null : index)}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  {expandedTask === index ? 'Hide' : 'Details'}
                </button>
              </div>

              {/* Slider */}
              <div className="flex items-center gap-2">
                {AUTONOMY_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => updateLevel(index, level.id)}
                    className={`flex-1 h-2 rounded-full transition-all duration-200 cursor-pointer ${
                      level.id <= task.level ? AUTONOMY_LEVELS[task.level].color : 'bg-surface-secondary'
                    } ${level.id <= task.level ? 'opacity-100' : 'opacity-50'}`}
                    title={level.label}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-text-tertiary">Manual</span>
                <span className="text-[10px] text-text-tertiary">Autonomous</span>
              </div>

              <AnimatePresence>
                {expandedTask === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 p-3 bg-surface-secondary rounded-lg">
                      <p className="text-sm text-text-secondary mb-2">{AUTONOMY_LEVELS[task.level].description}</p>
                      <div className="text-sm text-text-secondary">
                        <span className="font-medium text-text-primary">At this level: </span>
                        {task.example[task.level]}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 bg-surface-secondary border-t border-primary">
          <p className="text-xs text-text-tertiary">Changes take effect immediately. You can adjust levels anytime.</p>
        </div>
      </div>
    </div>
  );
}
