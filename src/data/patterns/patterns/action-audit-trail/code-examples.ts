import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Agent Action Audit Trail Timeline",
    description: "An interactive timeline showing agent actions grouped by task, with reversibility badges, timestamps, undo controls, and diff views.",
    language: "tsx",
    componentId: "action-audit-trail-demo",
    code: `'use client';

import React, { useState } from 'react';
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
  { id: 1, title: 'Sorted 47 emails into folders', detail: 'Moved newsletters to Promotions, receipts to Finance, team updates to Projects', timestamp: '9:02 AM', reversible: 'full', group: 'Inbox Organization', diff: { before: '47 emails in Inbox', after: '12 in Promotions, 8 in Finance, 27 in Projects' } },
  { id: 2, title: 'Archived 12 read newsletters', detail: 'Newsletters older than 7 days with no user interaction', timestamp: '9:03 AM', reversible: 'full', group: 'Inbox Organization' },
  { id: 3, title: 'Drafted reply to Sarah Chen', detail: 'Re: Q3 Planning  -  confirmed Thursday 2pm meeting', timestamp: '9:15 AM', reversible: 'full', group: 'Email Responses' },
  { id: 4, title: 'Drafted reply to Mike Johnson', detail: 'Re: Budget Review  -  attached updated spreadsheet', timestamp: '9:18 AM', reversible: 'full', group: 'Email Responses' },
  { id: 5, title: 'Sent meeting confirmation to Sarah', detail: 'Confirmed Thursday 2pm, Building A Room 301', timestamp: '9:20 AM', reversible: 'none', group: 'Email Responses' },
  { id: 6, title: 'Rescheduled standup to 10:30am', detail: 'Moved from 10:00am due to conflict with client call', timestamp: '9:25 AM', reversible: 'partial', group: 'Calendar Updates' },
  { id: 7, title: 'Added Q3 review to Friday', detail: 'Blocked 2-3pm for quarterly review prep', timestamp: '9:26 AM', reversible: 'full', group: 'Calendar Updates' },
  { id: 8, title: 'Updated project status spreadsheet', detail: 'Marked 3 tasks complete, updated timeline estimates', timestamp: '9:30 AM', reversible: 'partial', group: 'Document Updates', diff: { before: 'Tasks: 8 pending, 4 complete', after: 'Tasks: 5 pending, 7 complete' } },
];

export default function ActionAuditTrailDemo() {
  const [actions, setActions] = useState(MOCK_ACTIONS);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const groups = [...new Set(actions.map(a => a.group))];
  const filteredActions = filter === 'all' ? actions : actions.filter(a => a.group === filter);
  const groupedActions = groups.filter(g => filter === 'all' || g === filter).map(g => ({
    group: g,
    actions: filteredActions.filter(a => a.group === g),
  })).filter(g => g.actions.length > 0);

  const undoAction = (id: number) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, undone: true } : a));
  };

  const getBadge = (level: string) => {
    switch (level) {
      case 'full': return { label: 'Reversible', cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
      case 'partial': return { label: 'Partial', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
      case 'none': return { label: 'Sent', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
      default: return { label: '', cls: '' };
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-primary">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Action Audit Trail</h3>
              <p className="text-sm text-text-secondary">8 actions completed this morning</p>
            </div>
            <span className="text-xs text-text-tertiary">Today, 9:02 – 9:30 AM</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilter('all')} className={\`text-xs px-3 py-1 rounded-full transition-colors \${filter === 'all' ? 'bg-text-primary text-white' : 'bg-surface-secondary text-text-secondary hover:text-text-primary'}\`}>All</button>
            {groups.map(g => (
              <button key={g} onClick={() => setFilter(g)} className={\`text-xs px-3 py-1 rounded-full transition-colors \${filter === g ? 'bg-text-primary text-white' : 'bg-surface-secondary text-text-secondary hover:text-text-primary'}\`}>{g}</button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-primary">
          {groupedActions.map(({ group, actions: groupActions }) => (
            <div key={group}>
              <div className="px-6 py-2 bg-surface-secondary">
                <span className="text-xs font-medium text-text-tertiary uppercase tracking-wide">{group}</span>
              </div>
              {groupActions.map(action => {
                const badge = getBadge(action.reversible);
                return (
                  <div key={action.id} className={\`px-6 py-3 \${action.undone ? 'opacity-50' : ''}\`}>
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-text-tertiary mt-1 w-16 flex-shrink-0">{action.timestamp}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className={\`text-sm font-medium \${action.undone ? 'line-through text-text-tertiary' : 'text-text-primary'}\`}>{action.title}</span>
                          <span className={\`text-[10px] px-1.5 py-0.5 rounded-full \${badge.cls}\`}>{badge.label}</span>
                          {action.undone && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">Undone</span>}
                        </div>
                        <p className="text-xs text-text-secondary">{action.detail}</p>
                        {action.diff && expandedId === action.id && (
                          <AnimatePresence>
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 text-xs rounded overflow-hidden">
                              <div className="bg-red-50 dark:bg-red-900/20 px-3 py-1.5 text-red-700 dark:text-red-400">- {action.diff.before}</div>
                              <div className="bg-green-50 dark:bg-green-900/20 px-3 py-1.5 text-green-700 dark:text-green-400">+ {action.diff.after}</div>
                            </motion.div>
                          </AnimatePresence>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {action.diff && (
                          <button onClick={() => setExpandedId(expandedId === action.id ? null : action.id)} className="text-xs text-text-tertiary hover:text-text-primary transition-colors">
                            {expandedId === action.id ? 'Hide' : 'Diff'}
                          </button>
                        )}
                        {action.reversible !== 'none' && !action.undone && (
                          <button onClick={() => undoAction(action.id)} className="text-xs text-text-tertiary hover:text-red-500 transition-colors">Undo</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`
  }
];
