import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Coding Agent Autonomy Controls",
    description: "A permissions panel for a coding agent where each tool has its own autonomy level. Adjust the sliders and watch the live activity feed show exactly how the agent would behave at each setting.",
    language: "tsx",
    componentId: "autonomy-spectrum-demo",
    code: `'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LEVELS = [
  { id: 0, label: 'Ask', desc: 'Agent asks permission before every action.' },
  { id: 1, label: 'Suggest', desc: 'Agent proposes changes for your review.' },
  { id: 2, label: 'Auto + Notify', desc: 'Agent acts immediately, notifies you after.' },
  { id: 3, label: 'Full Auto', desc: 'Agent acts silently. Check the log to review.' },
];

const TOOLS = [
  {
    name: 'Read Files', icon: '\u{1F4C4}', level: 2,
    actions: [
      { agent: 'Can I read src/utils/auth.ts?', type: 'ask' },
      { agent: "I'd like to read 3 files in src/utils/", type: 'suggest' },
      { agent: 'Read src/utils/auth.ts (42 lines)', type: 'notify' },
      { agent: 'Read src/utils/auth.ts', type: 'silent' },
    ],
  },
  {
    name: 'Edit Files', icon: '\u{270F}\u{FE0F}', level: 1,
    actions: [
      { agent: 'Can I edit line 15 of auth.ts?', type: 'ask' },
      { agent: 'Proposed: fix null check in auth.ts:15', type: 'suggest' },
      { agent: 'Edited auth.ts:15 \u2014 added null check', type: 'notify' },
      { agent: 'Edited auth.ts:15', type: 'silent' },
    ],
  },
  {
    name: 'Run Tests', icon: '\u{1F9EA}', level: 2,
    actions: [
      { agent: 'Can I run npm test?', type: 'ask' },
      { agent: 'Suggest running: npm test -- auth.test.ts', type: 'suggest' },
      { agent: 'Ran npm test \u2014 12 passed, 0 failed', type: 'notify' },
      { agent: 'Ran npm test (all passed)', type: 'silent' },
    ],
  },
  {
    name: 'Git Push', icon: '\u{1F680}', level: 0,
    actions: [
      { agent: 'Ready to push to main. Approve?', type: 'ask' },
      { agent: 'Proposed: git push origin main (3 commits)', type: 'suggest' },
      { agent: 'Pushed 3 commits to main', type: 'notify' },
      { agent: 'Pushed to main', type: 'silent' },
    ],
  },
];

interface LogEntry {
  id: number; tool: string; icon: string;
  message: string; type: string; timestamp: string;
}

export default function AutonomySpectrumDemo() {
  const [tools, setTools] = useState(TOOLS.map(t => ({ ...t })));
  const [log, setLog] = useState<LogEntry[]>([]);
  const [nextId, setNextId] = useState(0);

  const updateLevel = (index: number, level: number) => {
    setTools(prev => prev.map((t, i) => i === index ? { ...t, level } : t));
    const tool = tools[index];
    const action = tool.actions[level];
    const ts = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    setLog(prev => [{ id: nextId, tool: tool.name, icon: tool.icon,
      message: action.agent, type: action.type, timestamp: ts,
    }, ...prev].slice(0, 8));
    setNextId(prev => prev + 1);
  };

  const autoCount = tools.filter(t => t.level >= 2).length;
  const manualCount = tools.filter(t => t.level <= 1).length;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-primary flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Agent Permissions</h3>
              <p className="text-sm text-text-secondary mt-0.5">Set autonomy per tool</p>
            </div>
            <div className="text-xs text-text-tertiary">{manualCount} manual / {autoCount} auto</div>
          </div>
          <div className="divide-y divide-primary">
            {tools.map((tool, index) => (
              <div key={tool.name} className="px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{tool.icon}</span>
                    <span className="font-medium text-text-primary">{tool.name}</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-surface-secondary
                    text-text-secondary border border-primary">
                    {LEVELS[tool.level].label}
                  </span>
                </div>
                <div className="flex rounded-lg border border-primary overflow-hidden">
                  {LEVELS.map((level, i) => (
                    <button key={level.id} onClick={() => updateLevel(index, level.id)}
                      className={\`flex-1 py-2 text-xs font-medium transition-all duration-150
                        \${i < LEVELS.length - 1 ? 'border-r border-primary' : ''}
                        \${tool.level === level.id
                          ? 'bg-accent-primary text-white dark:text-black'
                          : 'bg-surface-primary text-text-tertiary hover:bg-surface-secondary'
                        }\`}>
                      {level.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-text-tertiary mt-2">{LEVELS[tool.level].desc}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Activity Feed */}
        <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-primary">
            <h3 className="text-lg font-semibold text-text-primary">Activity Feed</h3>
            <p className="text-sm text-text-secondary mt-0.5">How the agent behaves at each level</p>
          </div>
          <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[480px]">
            {log.length === 0 ? (
              <div className="flex items-center justify-center h-full p-6">
                <p className="text-sm text-text-tertiary text-center">
                  Adjust a permission level to see how the agent behaves.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-primary">
                <AnimatePresence initial={false}>
                  {log.map((entry) => (
                    <motion.div key={entry.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="px-6 py-3">
                      <div className="flex items-start gap-3">
                        <span className="text-lg mt-0.5">{entry.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-text-primary">{entry.tool}</span>
                            <span className="text-xs text-text-tertiary">{entry.timestamp}</span>
                          </div>
                          <p className="text-sm text-text-secondary mt-0.5">{entry.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
          {log.length > 0 && (
            <div className="px-6 py-3 border-t border-primary">
              <button onClick={() => setLog([])}
                className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">
                Clear log
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`
  }
];
