'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EscalationItem {
  id: number;
  type: 'confidence' | 'permission' | 'conflict';
  context: string;
  question: string;
  recommendation: string;
  confidence: number;
  options: string[];
  resolved: boolean;
  response?: string;
  taskProgress: number;
}

const INITIAL_ESCALATIONS: EscalationItem[] = [
  {
    id: 1,
    type: 'confidence',
    context: 'While updating the card component, I noticed the shadow style differs from the design system. The current shadow is softer than the token value.',
    question: 'Should I update all card shadows to match the design system token?',
    recommendation: 'Update to match design system',
    confidence: 62,
    options: ['Update all shadows', 'Keep current style', 'Let me compare first'],
    resolved: false,
    taskProgress: 65,
  },
  {
    id: 2,
    type: 'permission',
    context: 'Applying the new spacing scale would change layouts across 14 screens. Some components may shift position.',
    question: 'Apply updated spacing tokens to all screens? This affects 14 layouts.',
    recommendation: 'Apply to new screens only',
    confidence: 85,
    options: ['Apply to all 14 screens', 'New screens only', 'Show me a preview first'],
    resolved: false,
    taskProgress: 40,
  },
  {
    id: 3,
    type: 'conflict',
    context: 'The brand guidelines specify #2563EB for primary buttons, but the WCAG contrast check flags it as insufficient on light gray backgrounds.',
    question: 'The brand color fails accessibility on some backgrounds. How should I handle this?',
    recommendation: 'Darken to #1D4ED8 for those backgrounds',
    confidence: 45,
    options: ['Darken the color', 'Keep brand color', 'Use different background instead'],
    resolved: false,
    taskProgress: 80,
  },
];

type Phase = 'idle' | 'running' | 'review' | 'done';

export default function EscalationPathwaysDemo() {
  const [escalations, setEscalations] = useState<EscalationItem[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [revealedCount, setRevealedCount] = useState(0);
  const [dontAskAgain, setDontAskAgain] = useState<Record<number, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startDemo = useCallback(() => {
    clearTimer();
    setEscalations(INITIAL_ESCALATIONS.map(e => ({ ...e, resolved: false, response: undefined })));
    setRevealedCount(0);
    setDontAskAgain({});
    setPhase('running');
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setEscalations([]);
    setRevealedCount(0);
    setDontAskAgain({});
    setPhase('idle');
  }, [clearTimer]);

  useEffect(() => {
    if (phase !== 'running') return;

    if (revealedCount < INITIAL_ESCALATIONS.length) {
      timerRef.current = setTimeout(() => {
        setRevealedCount(prev => prev + 1);
      }, 900);
    } else {
      timerRef.current = setTimeout(() => {
        setPhase('review');
      }, 400);
    }

    return () => clearTimer();
  }, [phase, revealedCount, clearTimer]);

  const resolveEscalation = (id: number, response: string) => {
    setEscalations(prev => prev.map(e => e.id === id ? { ...e, resolved: true, response } : e));
  };

  useEffect(() => {
    if (phase !== 'review') return;
    if (escalations.length > 0 && escalations.every(e => e.resolved)) {
      setPhase('done');
    }
  }, [escalations, phase]);

  const unresolvedCount = escalations.filter(e => !e.resolved).length;
  const visibleEscalations = escalations.slice(0, revealedCount);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'confidence': return 'Low Confidence';
      case 'permission': return 'Needs Permission';
      case 'conflict': return 'Conflict Detected';
      default: return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'confidence': return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
      );
      case 'permission': return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
      );
      case 'conflict': return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
      );
      default: return null;
    }
  };

  if (phase === 'idle') {
    return (
      <div className="max-w-xl mx-auto" data-clarity-region="demo-interactive">
        <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
          <div className="px-6 py-10 flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center">
              <svg className="w-6 h-6 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Agent task:</p>
              <p className="text-text-primary font-medium">&ldquo;Update the design system and apply new tokens across all screens&rdquo;</p>
            </div>
            <button
              onClick={startDemo}
              className="mt-2 px-5 py-2.5 text-sm font-medium bg-text-primary text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              Run Agent
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-4" data-clarity-region="demo-interactive">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-text-primary">
              {phase === 'running' ? 'Agent Working' : phase === 'done' ? 'All Resolved' : 'Agent Paused'}
            </h3>
            {phase === 'running' && (
              <motion.span
                className="inline-block w-1.5 h-1.5 rounded-full bg-text-tertiary"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
          <p className="text-sm text-text-secondary">
            {phase === 'running'
              ? `Encountered ${revealedCount} escalation${revealedCount !== 1 ? 's' : ''}...`
              : phase === 'done'
                ? 'Agent will continue with your decisions.'
                : `${unresolvedCount} decision${unresolvedCount > 1 ? 's' : ''} needed to continue`}
          </p>
        </div>
        {(phase === 'review' || phase === 'done') && (
          <button
            onClick={reset}
            className="px-3 py-2 text-sm font-medium border border-primary rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
            Replay
          </button>
        )}
      </div>

      {/* Escalation cards */}
      <AnimatePresence mode="popLayout">
        {visibleEscalations.map(esc => (
          <motion.div
            key={esc.id}
            layout
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`bg-surface-primary border border-primary rounded-xl overflow-hidden ${esc.resolved ? 'opacity-60' : ''}`}
          >
            {/* Progress indicator */}
            <div className="h-1 bg-surface-secondary">
              <div className="h-1 bg-text-tertiary transition-all" style={{ width: `${esc.taskProgress}%` }} />
            </div>

            <div className="px-5 py-4">
              {/* Type badge + context */}
              <div className="flex items-start gap-3 mb-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-surface-secondary text-text-secondary flex items-center justify-center">
                  {getTypeIcon(esc.type)}
                </span>
                <div className="flex-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-surface-secondary text-text-secondary">{getTypeLabel(esc.type)}</span>
                  <p className="text-sm text-text-secondary mt-1">{esc.context}</p>
                </div>
              </div>

              {/* Question */}
              <p className="font-medium text-text-primary mb-3">{esc.question}</p>

              {/* Recommendation */}
              <div className="flex items-center gap-2 mb-4 p-2 bg-surface-secondary rounded-lg">
                <span className="text-xs text-text-tertiary">Suggested:</span>
                <span className="text-sm text-text-primary font-medium">{esc.recommendation}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full ml-auto bg-surface-secondary text-text-secondary border border-primary">{esc.confidence}%</span>
              </div>

              {/* Actions */}
              {esc.resolved ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-sm text-text-secondary">{esc.response}</span>
                </motion.div>
              ) : phase === 'review' ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {esc.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => resolveEscalation(esc.id, opt)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${
                          i === 0 ? 'bg-text-primary text-white hover:opacity-90' : 'bg-surface-secondary text-text-primary hover:opacity-80'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 text-xs text-text-tertiary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dontAskAgain[esc.id] || false}
                      onChange={(e) => setDontAskAgain(prev => ({ ...prev, [esc.id]: e.target.checked }))}
                      className="rounded border-primary"
                    />
                    Don&apos;t ask again for this type
                  </label>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <motion.div
                    className="flex gap-0.5"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                    <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                    <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                  </motion.div>
                  <span>Waiting for decisions above</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Skeleton during reveal */}
      {phase === 'running' && revealedCount < INITIAL_ESCALATIONS.length && (
        <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-surface-secondary animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-surface-secondary rounded animate-pulse" />
              <div className="h-3 w-56 bg-surface-secondary rounded animate-pulse opacity-60" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
