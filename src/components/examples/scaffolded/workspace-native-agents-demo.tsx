'use client';
// @ts-nocheck

import React, { useState } from 'react';

const INITIAL_DOC = `Q3 Marketing Campaign Brief

Objective: Increase brand awareness among enterprise buyers in the financial services vertical.

Target audience: VP-level and above at companies with 500+ employees.

Key messages:
- Security and compliance as differentiators
- ROI within 90 days
- Dedicated onboarding support

Budget: $240,000 across digital and event channels.

Timeline: Campaign launches September 1, runs through November 30.`;

const INITIAL_SUGGESTIONS = [
  { id: 1, label: 'Summarize', applied: false },
  { id: 2, label: 'Identify gaps', applied: false },
  { id: 3, label: 'Suggest KPIs', applied: false },
];

const RESPONSES: Record<string, string> = {
  Summarize:
    'A Q3 campaign targeting enterprise financial services buyers (VP+, 500+ employees) with a $240K budget running Sept 1 to Nov 30. Core value props: security, fast ROI, and onboarding support.',
  'Identify gaps':
    'Missing: success metrics, channel breakdown, competitive positioning, and approval owners. Consider adding a measurement framework before launch.',
  'Suggest KPIs':
    'Recommended KPIs: pipeline influenced ($), MQL volume, event attendance rate, content engagement rate, and 90-day trial conversion rate.',
};

function WorkspaceNativeAgentsDemo() {
  const INITIAL_STATE = { doc: INITIAL_DOC, suggestions: INITIAL_SUGGESTIONS, activeId: null as number | null, result: '' };

  const [doc, setDoc] = useState(INITIAL_STATE.doc);
  const [suggestions, setSuggestions] = useState(INITIAL_STATE.suggestions);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [result, setResult] = useState('');

  const reset = () => {
    setDoc(INITIAL_DOC);
    setSuggestions(INITIAL_SUGGESTIONS.map(s => ({ ...s, applied: false })));
    setActiveId(null);
    setResult('');
  };

  const apply = (id: number, label: string) => {
    setActiveId(id);
    setResult(RESPONSES[label]);
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, applied: true } : s));
  };

  const appliedSuggestion = suggestions.find(s => s.id === activeId);

  return (
    <div className="bg-surface-primary border border-border-primary rounded-xl p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-text-tertiary uppercase tracking-wide mb-0.5">Pattern</p>
          <h2 className="text-lg font-semibold text-text-primary">Workspace-Native Agent Integration</h2>
        </div>
        <button onClick={reset} className="text-xs text-text-tertiary hover:text-text-primary transition-colors">Reset</button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-tertiary uppercase tracking-wide">Document Editor</span>
            <span className="text-xs text-text-tertiary">campaign-brief.doc</span>
          </div>
          <div className="relative">
            <textarea
              className="w-full h-64 bg-background-primary border border-border-primary rounded-lg p-4 text-sm text-text-primary resize-none focus:outline-none focus:border-border-secondary font-mono leading-relaxed"
              value={doc}
              onChange={e => setDoc(e.target.value)}
            />
            <div className="absolute bottom-3 right-3 flex gap-1.5">
              {suggestions.map(s => (
                <button
                  key={s.id}
                  onClick={() => apply(s.id, s.label)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                    s.applied
                      ? 'bg-accent-primary text-white border-transparent'
                      : 'bg-surface-primary border-border-primary text-text-secondary hover:text-text-primary hover:border-border-secondary'
                  }`}
                >
                  {s.applied ? '✓ ' : ''}{s.label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-text-tertiary">AI actions surface inline, inside the editor you already use.</p>
        </div>

        <div className="col-span-2 flex flex-col gap-3">
          <span className="text-xs text-text-tertiary uppercase tracking-wide">Agent Response</span>
          <div className="flex-1 bg-background-secondary border border-border-primary rounded-lg p-4 min-h-64 flex flex-col justify-between">
            {result ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent-primary flex items-center justify-center text-white text-xs">A</span>
                  <span className="text-xs font-medium text-text-primary">{appliedSuggestion?.label}</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{result}</p>
                <button
                  onClick={() => {
                    setDoc(prev => prev + '\n\n---\nAgent note: ' + result);
                    setResult('');
                    setActiveId(null);
                  }}
                  className="mt-auto text-xs text-accent-primary hover:text-text-primary transition-colors text-left"
                >
                  Insert into document
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                <span className="text-text-tertiary text-2xl">&#9998;</span>
                <p className="text-xs text-text-tertiary">Select an action above to see the agent respond in context, without leaving the editor.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceNativeAgentsDemo;
