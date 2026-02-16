import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Collaborative Document Editor",
    description: "A collaborative document interface showing human and agent cursors, parallel editing zones, and a handoff mechanism for seamless mixed-initiative control.",
    language: "tsx",
    componentId: "mixed-initiative-control-demo",
    code: `'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Section {
  id: number;
  title: string;
  content: string;
  owner: 'human' | 'agent' | 'none';
  agentTyping?: boolean;
}

export default function MixedInitiativeControlDemo() {
  const [sections, setSections] = useState<Section[]>([
    { id: 1, title: 'Introduction', content: 'Our Q3 results demonstrate strong growth across all key metrics.', owner: 'human', agentTyping: false },
    { id: 2, title: 'Key Findings', content: '', owner: 'agent', agentTyping: true },
    { id: 3, title: 'Recommendations', content: '', owner: 'none', agentTyping: false },
  ]);

  const agentText = 'Revenue increased 23% year-over-year, driven primarily by enterprise adoption. Customer retention rate improved to 94%, up from 89% in Q2. New market expansion in APAC contributed 15% of total growth.';
  const charIndexRef = useRef(0);

  useEffect(() => {
    const agentSection = sections.find(s => s.owner === 'agent' && s.agentTyping);
    if (!agentSection) return;

    const interval = setInterval(() => {
      charIndexRef.current += 1;
      if (charIndexRef.current > agentText.length) {
        clearInterval(interval);
        setSections(prev => prev.map(s =>
          s.id === agentSection.id ? { ...s, agentTyping: false } : s
        ));
        return;
      }
      setSections(prev => prev.map(s =>
        s.id === agentSection.id ? { ...s, content: agentText.slice(0, charIndexRef.current) } : s
      ));
    }, 30);

    return () => clearInterval(interval);
  }, [sections]);

  const handoff = (id: number, to: 'human' | 'agent') => {
    setSections(prev => prev.map(s =>
      s.id === id ? { ...s, owner: to, agentTyping: to === 'agent' } : s
    ));
    if (to === 'agent') charIndexRef.current = 0;
  };

  const updateContent = (id: number, content: string) => {
    setSections(prev => prev.map(s =>
      s.id === id ? { ...s, content, owner: 'human', agentTyping: false } : s
    ));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-primary flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Q3 Performance Report</h3>
            <p className="text-sm text-text-secondary">Collaborative editing with AI agent</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              You
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Agent
            </span>
          </div>
        </div>

        <div className="divide-y divide-primary">
          {sections.map(section => (
            <div key={section.id} className="relative">
              {/* Owner indicator bar */}
              <div className={\`absolute left-0 top-0 bottom-0 w-1 \${
                section.owner === 'human' ? 'bg-blue-500' :
                section.owner === 'agent' ? 'bg-purple-500' :
                'bg-transparent'
              }\`} />

              <div className="px-6 py-4 pl-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-text-primary">{section.title}</h4>
                    {section.agentTyping && (
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                      >
                        Agent writing...
                      </motion.span>
                    )}
                  </div>

                  {/* Handoff controls */}
                  <div className="flex gap-1">
                    {section.owner !== 'human' && !section.agentTyping && (
                      <button
                        onClick={() => handoff(section.id, 'human')}
                        className="text-[10px] px-2 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        Edit myself
                      </button>
                    )}
                    {section.owner !== 'agent' && (
                      <button
                        onClick={() => handoff(section.id, 'agent')}
                        className="text-[10px] px-2 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                      >
                        Hand to agent
                      </button>
                    )}
                  </div>
                </div>

                {section.owner === 'human' ? (
                  <textarea
                    value={section.content}
                    onChange={(e) => updateContent(section.id, e.target.value)}
                    placeholder="Start typing..."
                    className="w-full text-sm text-text-primary bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                  />
                ) : (
                  <div className={\`text-sm rounded-lg p-3 min-h-[80px] \${
                    section.owner === 'agent'
                      ? 'bg-purple-50/50 dark:bg-purple-900/10 text-text-primary'
                      : 'bg-surface-secondary text-text-tertiary'
                  }\`}>
                    {section.content || (section.owner === 'none' ? 'Click "Hand to agent" or "Edit myself" to start' : '')}
                    {section.agentTyping && <span className="inline-block w-0.5 h-4 bg-purple-500 animate-pulse ml-0.5 align-middle" />}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 bg-surface-secondary border-t border-primary">
          <p className="text-xs text-text-tertiary">Click any section to edit. Use handoff buttons to delegate to the agent.</p>
        </div>
      </div>
    </div>
  );
}`
  }
];
