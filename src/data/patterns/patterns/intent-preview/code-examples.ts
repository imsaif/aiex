import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Agent Action Plan Preview",
    description: "An interactive preview of planned agent actions with reversibility badges, edit controls, and approve/reject flow.",
    language: "tsx",
    componentId: "intent-preview-demo",
    code: `'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlannedAction {
  id: number;
  title: string;
  description: string;
  reversible: 'full' | 'partial' | 'none';
  estimatedTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'removed';
}

export default function IntentPreviewDemo() {
  const [actions, setActions] = useState<PlannedAction[]>([
    { id: 1, title: 'Draft reply to Sarah', description: 'Compose a response to Sarah\\'s project update email with status summary.', reversible: 'full', estimatedTime: '10s', status: 'pending' },
    { id: 2, title: 'Attach Q3 report', description: 'Find and attach the Q3 financial report PDF from your documents.', reversible: 'full', estimatedTime: '5s', status: 'pending' },
    { id: 3, title: 'CC the design team', description: 'Add design-team@company.com to the CC field.', reversible: 'partial', estimatedTime: '2s', status: 'pending' },
    { id: 4, title: 'Send at 9am tomorrow', description: 'Schedule the email for delivery at 9:00 AM PST.', reversible: 'none', estimatedTime: '1s', status: 'pending' },
  ]);
  const [allApproved, setAllApproved] = useState(false);

  const getReversibilityBadge = (level: string) => {
    switch (level) {
      case 'full': return { label: 'Reversible', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
      case 'partial': return { label: 'Partially reversible', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
      case 'none': return { label: 'Irreversible', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
      default: return { label: 'Unknown', className: 'bg-gray-100 text-gray-700' };
    }
  };

  const removeAction = (id: number) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'removed' } : a));
  };

  const approveAll = () => {
    setActions(prev => prev.map(a => a.status === 'pending' ? { ...a, status: 'approved' } : a));
    setAllApproved(true);
  };

  const rejectAll = () => {
    setActions(prev => prev.map(a => a.status === 'pending' ? { ...a, status: 'rejected' } : a));
  };

  const reset = () => {
    setActions(prev => prev.map(a => ({ ...a, status: 'pending' })));
    setAllApproved(false);
  };

  const pendingActions = actions.filter(a => a.status === 'pending');
  const visibleActions = actions.filter(a => a.status !== 'removed');

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-primary">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Planned Actions</h3>
              <p className="text-sm text-text-secondary mt-1">Review what the agent will do before approving.</p>
            </div>
            <span className="text-sm text-text-tertiary">{visibleActions.length} steps ~ 18s</span>
          </div>
        </div>

        <div className="divide-y divide-primary">
          <AnimatePresence>
            {visibleActions.map((action, index) => {
              const badge = getReversibilityBadge(action.reversible);
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 py-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-surface-secondary flex items-center justify-center text-xs font-medium text-text-secondary mt-0.5">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-text-primary">{action.title}</span>
                        <span className={\`text-[10px] px-1.5 py-0.5 rounded-full \${badge.className}\`}>{badge.label}</span>
                        {action.status !== 'pending' && (
                          <span className={\`text-[10px] px-1.5 py-0.5 rounded-full \${
                            action.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }\`}>{action.status}</span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary">{action.description}</p>
                    </div>
                    {action.status === 'pending' && (
                      <button
                        onClick={() => removeAction(action.id)}
                        className="text-text-tertiary hover:text-red-500 transition-colors flex-shrink-0"
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
        </div>

        <div className="px-6 py-4 border-t border-primary flex items-center justify-between">
          {allApproved ? (
            <button onClick={reset} className="text-sm text-text-secondary hover:text-text-primary transition-colors">Reset demo</button>
          ) : (
            <>
              <button onClick={rejectAll} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-red-600 transition-colors" disabled={pendingActions.length === 0}>
                Reject All
              </button>
              <button onClick={approveAll} className="px-4 py-2 text-sm font-medium bg-text-primary text-white rounded-lg hover:opacity-90 transition-opacity" disabled={pendingActions.length === 0}>
                Approve {pendingActions.length} Actions
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}`
  }
];
