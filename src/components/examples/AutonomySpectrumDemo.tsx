'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  PencilSquareIcon,
  BeakerIcon,
  ArrowUpTrayIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

const LEVELS = [
  { id: 0, label: 'Ask', desc: 'Agent asks permission before every action.' },
  { id: 1, label: 'Suggest', desc: 'Agent proposes changes for your review.' },
  { id: 2, label: 'Auto + Notify', desc: 'Agent acts immediately, notifies you after.' },
  { id: 3, label: 'Full Auto', desc: 'Agent acts silently. Check the log to review.' },
];

const TOOL_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  'Browse Designs': DocumentTextIcon,
  'Edit Layouts': PencilSquareIcon,
  'Check Accessibility': BeakerIcon,
  'Publish Changes': ArrowUpTrayIcon,
};

const TOOLS = [
  {
    name: 'Browse Designs',
    level: 2,
    actions: [
      { agent: 'Can I review the onboarding screens?', type: 'ask' as const },
      { agent: 'I\'d like to review 3 screens in the signup flow', type: 'suggest' as const },
      { agent: 'Reviewed onboarding screens (5 screens)', type: 'notify' as const },
      { agent: 'Reviewed onboarding screens', type: 'silent' as const },
    ],
  },
  {
    name: 'Edit Layouts',
    level: 1,
    actions: [
      { agent: 'Can I adjust the spacing on the hero section?', type: 'ask' as const },
      { agent: 'Proposed: increase CTA button padding to 16px', type: 'suggest' as const },
      { agent: 'Updated hero section — increased CTA padding', type: 'notify' as const },
      { agent: 'Updated hero section spacing', type: 'silent' as const },
    ],
  },
  {
    name: 'Check Accessibility',
    level: 2,
    actions: [
      { agent: 'Can I run a contrast check on the color palette?', type: 'ask' as const },
      { agent: 'Suggest checking: WCAG AA contrast on 4 text styles', type: 'suggest' as const },
      { agent: 'Contrast check — 3 passed, 1 warning on muted text', type: 'notify' as const },
      { agent: 'Contrast check complete (1 warning)', type: 'silent' as const },
    ],
  },
  {
    name: 'Publish Changes',
    level: 0,
    actions: [
      { agent: 'Ready to publish to the live design system. Approve?', type: 'ask' as const },
      { agent: 'Proposed: publish 5 updated components to the library', type: 'suggest' as const },
      { agent: 'Published 5 components to the design system', type: 'notify' as const },
      { agent: 'Published to design system', type: 'silent' as const },
    ],
  },
];

interface LogEntry {
  id: number;
  tool: string;
  message: string;
  type: 'ask' | 'suggest' | 'notify' | 'silent';
  timestamp: string;
}

function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = TOOL_ICONS[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}

export default function AutonomySpectrumDemo() {
  const [tools, setTools] = useState(TOOLS.map(t => ({ ...t })));
  const [log, setLog] = useState<LogEntry[]>([]);
  const nextIdRef = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeToolIndex, setActiveToolIndex] = useState<number | null>(null);
  const simulationRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearSimulation = useCallback(() => {
    simulationRef.current.forEach(t => clearTimeout(t));
    simulationRef.current = [];
  }, []);

  const addLogEntry = useCallback((tool: typeof TOOLS[0], level: number) => {
    const action = tool.actions[level];
    const now = new Date();
    const ts = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const id = nextIdRef.current++;

    setLog(prev => [...prev, {
      id,
      tool: tool.name,
      message: action.agent,
      type: action.type,
      timestamp: ts,
    }].slice(-12));
  }, []);

  const simulateRun = useCallback((currentTools: typeof TOOLS) => {
    clearSimulation();
    setIsSimulating(true);
    setLog([]);

    currentTools.forEach((tool, i) => {
      const timer = setTimeout(() => {
        setActiveToolIndex(i);
        addLogEntry(tool, tool.level);

        if (i === currentTools.length - 1) {
          const endTimer = setTimeout(() => {
            setIsSimulating(false);
            setActiveToolIndex(null);
          }, 600);
          simulationRef.current.push(endTimer);
        }
      }, i * 700);
      simulationRef.current.push(timer);
    });
  }, [clearSimulation, addLogEntry]);

  useEffect(() => {
    return () => clearSimulation();
  }, [clearSimulation]);

  const updateLevel = (index: number, level: number) => {
    if (tools[index].level === level) return;
    if (isSimulating) return;

    const updated = tools.map((t, i) => i === index ? { ...t, level } : t);
    setTools(updated);
    addLogEntry(tools[index], level);
  };

  const handleRunAgent = () => {
    if (isSimulating) return;
    simulateRun(tools);
  };

  const autoCount = tools.filter(t => t.level >= 2).length;
  const manualCount = tools.filter(t => t.level <= 1).length;

  const typeStyles = (type: string) => {
    switch (type) {
      case 'ask': return { label: 'Awaiting approval', dot: 'bg-amber-500' };
      case 'suggest': return { label: 'Suggestion', dot: 'bg-blue-500' };
      case 'notify': return { label: 'Auto-completed', dot: 'bg-green-500' };
      case 'silent': return { label: 'Background', dot: 'bg-text-tertiary' };
      default: return { label: '', dot: 'bg-text-tertiary' };
    }
  };

  return (
    <div className="w-full" data-clarity-region="demo-interactive">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-primary flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Agent Permissions</h3>
              <p className="text-sm text-text-secondary mt-0.5">Set autonomy per tool</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-text-tertiary">
              <span>{manualCount} manual</span>
              <span className="text-text-tertiary">/</span>
              <span>{autoCount} auto</span>
            </div>
          </div>

          <div className="divide-y divide-primary">
            {tools.map((tool, index) => (
              <div
                key={tool.name}
                className={`px-6 py-4 transition-colors duration-300 ${
                  activeToolIndex === index ? 'bg-surface-secondary' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <ToolIcon name={tool.name} className="w-5 h-5 text-text-secondary" />
                    <span className="font-medium text-text-primary">{tool.name}</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-surface-secondary text-text-secondary border border-primary">
                    {LEVELS[tool.level].label}
                  </span>
                </div>

                {/* Level selector — segmented control */}
                <div className="flex rounded-lg border border-primary overflow-hidden">
                  {LEVELS.map((level, i) => (
                    <button
                      key={level.id}
                      onClick={() => updateLevel(index, level.id)}
                      disabled={isSimulating}
                      className={`flex-1 py-2 text-xs font-medium transition-all duration-150 cursor-pointer ${
                        i < LEVELS.length - 1 ? 'border-r border-primary' : ''
                      } ${
                        tool.level === level.id
                          ? 'bg-surface-secondary text-text-primary font-semibold'
                          : 'bg-surface-primary text-text-tertiary hover:bg-surface-secondary hover:text-text-secondary'
                      } ${isSimulating ? 'opacity-60' : ''}`}
                    >
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
          <div className="px-6 py-4 border-b border-primary flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Activity Feed</h3>
              <p className="text-sm text-text-secondary mt-0.5">How the agent behaves at each level</p>
            </div>
            <button
              onClick={handleRunAgent}
              disabled={isSimulating}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                isSimulating
                  ? 'bg-surface-secondary text-text-tertiary opacity-60'
                  : 'bg-text-primary text-white hover:opacity-90'
              }`}
            >
              <PlayIcon className="w-3.5 h-3.5" />
              {isSimulating ? 'Running...' : 'Run Agent'}
            </button>
          </div>

          <div ref={logRef} className="flex-1 overflow-y-auto min-h-[300px] max-h-[480px]">
            {log.length === 0 && !isSimulating ? (
              <div className="flex items-center justify-center h-full p-6">
                <p className="text-sm text-text-tertiary text-center">Adjust a permission level or press Run Agent to see how the agent behaves.</p>
              </div>
            ) : (
              <div className="divide-y divide-primary">
                <AnimatePresence initial={false}>
                  {log.map((entry) => {
                    const style = typeStyles(entry.type);
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="px-6 py-3"
                      >
                        <div className="flex items-start gap-3">
                          <ToolIcon name={entry.tool} className="w-4 h-4 text-text-tertiary mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-text-primary">{entry.tool}</span>
                              <span className="text-xs text-text-tertiary">{entry.timestamp}</span>
                            </div>
                            <p className="text-sm text-text-secondary mt-0.5">{entry.message}</p>
                            <span className="flex items-center gap-1.5 text-xs text-text-tertiary mt-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                              {style.label}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {log.length > 0 && !isSimulating && (
            <div className="px-6 py-3 border-t border-primary">
              <button
                onClick={() => setLog([])}
                className="text-xs text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
              >
                Clear log
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
