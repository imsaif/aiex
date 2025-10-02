import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "AI-Human Mode Switcher",
    description: "A component that demonstrates smooth transitions between AI automation and manual control with context preservation.",
    language: "tsx",
    componentId: "graceful-handoff-demo",
    code: `'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GracefulHandoffDemo() {
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [progress, setProgress] = useState(0);
  const [context, setContext] = useState({ task: 'Processing document', step: 1 });

  useEffect(() => {
    if (mode === 'ai' && progress < 100) {
      const interval = setInterval(() => {
        setProgress(p => Math.min(p + 10, 100));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode, progress]);

  const handleHandoff = (newMode: 'ai' | 'manual') => {
    setMode(newMode);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Task Manager</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleHandoff('ai')}
              className={\`px-4 py-2 rounded \${
                mode === 'ai'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }\`}
            >
              AI Mode
            </button>
            <button
              onClick={() => handleHandoff('manual')}
              className={\`px-4 py-2 rounded \${
                mode === 'manual'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }\`}
            >
              Manual Mode
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Current Mode:</span>
            <span className={\`px-2 py-1 rounded text-sm \${
              mode === 'ai' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
            }\`}>
              {mode === 'ai' ? '🤖 AI Automation' : '👤 Manual Control'}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm mb-1">Task: {context.task}</p>
            <p className="text-sm mb-2">Step: {context.step}/5</p>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: \`\${progress}%\` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">{progress}% complete</p>
          </div>
        </div>

        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            {mode === 'ai'
              ? '✓ AI is handling the task. You can take over anytime.'
              : '⚠️ You are in control. Click AI Mode to resume automation.'}
          </p>
        </div>
      </div>
    </div>
  );
}`
  }
];
