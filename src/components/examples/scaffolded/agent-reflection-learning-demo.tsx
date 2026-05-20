'use client';
// @ts-nocheck

import React, { useState } from 'react';

const INITIAL_CORRECTIONS = [
  { id: 1, original: 'Scheduled meeting for 9am', correction: 'Prefers meetings after 10am', applied: true, date: '3 days ago' },
  { id: 2, original: 'Used formal tone in Slack', correction: 'Keep Slack messages casual', applied: true, date: '1 week ago' },
  { id: 3, original: 'CC\'d entire team on update', correction: 'Only CC direct stakeholders', applied: true, date: '2 weeks ago' },
];

const INITIAL_INSIGHTS = [
  { id: 1, label: 'Meeting preference', value: 'After 10am', confidence: 92 },
  { id: 2, label: 'Tone in Slack', value: 'Casual', confidence: 88 },
  { id: 3, label: 'Email recipients', value: 'Stakeholders only', confidence: 75 },
];

const INITIAL_PENDING = { id: 4, action: 'Drafting weekly summary for full team distribution', suggestion: 'Based on past corrections, send only to direct stakeholders?' };

function AgentReflectionLearningDemo() {
  const [corrections, setCorrections] = useState(INITIAL_CORRECTIONS);
  const [insights, setInsights] = useState(INITIAL_INSIGHTS);
  const [pending, setPending] = useState(INITIAL_PENDING);
  const [accepted, setAccepted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [newCorrection, setNewCorrection] = useState(null);

  const reset = () => {
    setCorrections(INITIAL_CORRECTIONS);
    setInsights(INITIAL_INSIGHTS);
    setPending(INITIAL_PENDING);
    setAccepted(false);
    setDismissed(false);
    setNewCorrection(null);
  };

  const handleAccept = () => {
    setAccepted(true);
    setNewCorrection({ id: 4, original: 'Sent summary to full team', correction: 'Send summary to stakeholders only', applied: true, date: 'just now' });
    setInsights(prev => prev.map(i => i.id === 3 ? { ...i, confidence: 91 } : i));
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  const allCorrections = newCorrection ? [newCorrection, ...corrections] : corrections;

  return (
    <div className="bg-background-primary min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface-primary border border-border-primary rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-text-tertiary uppercase tracking-wide mb-1">Pattern Demo</p>
              <h2 className="text-lg font-semibold text-text-primary">Agent Reflection & Learning</h2>
            </div>
            <button onClick={reset} className="text-xs text-text-tertiary hover:text-text-primary transition-colors">Reset</button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {insights.map(insight => (
              <div key={insight.id} className="bg-surface-secondary border border-border-primary rounded-lg p-4">
                <p className="text-xs text-text-tertiary mb-1">{insight.label}</p>
                <p className="text-sm font-medium text-text-primary mb-3">{insight.value}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-border-primary rounded-full overflow-hidden">
                    <div className="h-full bg-accent-primary rounded-full transition-all duration-700" style={{ width: `${insight.confidence}%` }} />
                  </div>
                  <span className="text-xs text-text-tertiary">{insight.confidence}%</span>
                </div>
                <p className="text-xs text-text-tertiary mt-1">confidence</p>
              </div>
            ))}
          </div>

          {!accepted && !dismissed && (
            <div className="border border-border-secondary bg-surface-secondary rounded-lg p-4 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs text-text-tertiary mb-1">Applying learned preference</p>
                  <p className="text-sm text-text-primary mb-1">{pending.action}</p>
                  <p className="text-sm text-accent-primary">{pending.suggestion}</p>
                </div>
                <div className="flex gap-2 shrink-0 mt-1">
                  <button onClick={handleAccept} className="text-xs px-3 py-1.5 bg-accent-primary text-white rounded-md hover:opacity-90 transition-opacity">Apply</button>
                  <button onClick={handleDismiss} className="text-xs px-3 py-1.5 border border-border-primary text-text-secondary rounded-md hover:text-text-primary transition-colors">Dismiss</button>
                </div>
              </div>
            </div>
          )}

          {accepted && (
            <div className="border border-border-primary rounded-lg p-4 mb-6 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-status-success shrink-0" />
              <p className="text-sm text-text-secondary">Preference applied. Confidence updated to 91%.</p>
            </div>
          )}

          {dismissed && (
            <div className="border border-border-primary rounded-lg p-4 mb-6 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-status-warning shrink-0" />
              <p className="text-sm text-text-secondary">Noted. The agent will reconsider this preference.</p>
            </div>
          )}

          <div>
            <p className="text-xs text-text-tertiary uppercase tracking-wide mb-3">Correction history</p>
            <div className="flex flex-col gap-2">
              {allCorrections.map(c => (
                <div key={c.id} className="flex items-start gap-3 py-3 border-b border-border-primary last:border-0">
                  <div className="w-2 h-2 rounded-full bg-status-success mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-tertiary mb-0.5">{c.original}</p>
                    <p className="text-sm text-text-primary">{c.correction}</p>
                  </div>
                  <span className="text-xs text-text-tertiary shrink-0">{c.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentReflectionLearningDemo;
