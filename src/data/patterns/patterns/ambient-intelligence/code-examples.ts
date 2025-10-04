import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Ambient Intelligence - Smart Workspace",
    description: "AI quietly monitors your context and provides helpful suggestions without being intrusive.",
    language: "tsx",
    componentId: "ambient-intelligence-demo",
    code: `'use client';

import React, { useState, useEffect } from 'react';

interface Suggestion {
  id: string;
  text: string;
}

export default function AmbientIntelligenceDemo() {
  const [focusLevel, setFocusLevel] = useState(80);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);

  useEffect(() => {
    // AI quietly monitors focus and suggests breaks when needed
    if (focusLevel < 50 && !suggestion) {
      const timer = setTimeout(() => {
        setSuggestion({
          id: '1',
          text: 'Your focus seems low. Time for a quick break?'
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [focusLevel, suggestion]);

  // Simulate focus decreasing over time
  useEffect(() => {
    const interval = setInterval(() => {
      setFocusLevel(prev => Math.max(0, prev - 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const takeBreak = () => {
    setFocusLevel(100);
    setSuggestion(null);
  };

  const dismiss = () => {
    setSuggestion(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Smart Workspace</h2>
        <p className="text-gray-600">AI quietly monitors and assists in the background</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>How it works:</strong> Watch as your focus level decreases over time.
          When it drops below 50%, the AI will quietly suggest taking a break - demonstrating
          ambient intelligence that assists without being intrusive.
        </p>
      </div>

      <div className="bg-gray-50 border rounded-lg p-4">
        <label className="block text-sm font-medium mb-2">
          Focus Level: {focusLevel}%
        </label>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={\`h-3 rounded-full transition-all \${
              focusLevel >= 70 ? 'bg-green-500' :
              focusLevel >= 40 ? 'bg-yellow-500' : 'bg-red-500'
            }\`}
            style={{ width: \`\${focusLevel}%\` }}
          />
        </div>
      </div>

      {suggestion && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-3">{suggestion.text}</p>
              <div className="flex gap-2">
                <button
                  onClick={takeBreak}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Take Break
                </button>
                <button
                  onClick={dismiss}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-500">
        {suggestion ? (
          <p>✨ AI noticed your focus is low and suggested a break</p>
        ) : (
          <p>🤖 AI is quietly monitoring your work context...</p>
        )}
      </div>
    </div>
  );
}`
  }
];
