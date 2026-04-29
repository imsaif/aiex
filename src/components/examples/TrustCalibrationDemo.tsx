'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Band = 'cautious' | 'moderate' | 'confident' | 'bold';

interface Suggestion {
  id: string;
  band: Band;
  rationale: string;
  before: string;
  after: string;
  scope: 'word' | 'sentence' | 'paragraph' | 'structure';
}

const SUGGESTIONS: Suggestion[] = [
  {
    id: 's1',
    band: 'cautious',
    scope: 'word',
    rationale: "Tighten phrasing",
    before: "lots of",
    after: "many",
  },
  {
    id: 's2',
    band: 'cautious',
    scope: 'word',
    rationale: "Capitalize acronym",
    before: "ai-powered",
    after: "AI-powered",
  },
  {
    id: 's3',
    band: 'moderate',
    scope: 'sentence',
    rationale: "Lead with the benefit, not the feature",
    before: "Our tool uses AI to scan screenshots and find issues.",
    after: "Catch UX issues in seconds — paste a screenshot, get a prioritized list.",
  },
  {
    id: 's4',
    band: 'moderate',
    scope: 'sentence',
    rationale: "Action-oriented CTA",
    before: "Click here to start",
    after: "Run my first audit",
  },
  {
    id: 's5',
    band: 'confident',
    scope: 'paragraph',
    rationale: "Cut redundant framing — 4 sentences → 2",
    before: "We help designers ship better AI products. We do this by giving them patterns. The patterns are based on real shipped products. You can use them in your own work.",
    after: "We help designers ship better AI products with patterns drawn from real shipped tools. Use them in your own work.",
  },
  {
    id: 's6',
    band: 'confident',
    scope: 'paragraph',
    rationale: "Reorder for stronger hook — outcome before method",
    before: "By analyzing 50+ products, we extracted 36 patterns covering trust, safety, and collaboration.",
    after: "36 patterns covering trust, safety, and collaboration — extracted from 50+ shipped AI products.",
  },
  {
    id: 's7',
    band: 'bold',
    scope: 'structure',
    rationale: "This 'About' section weakens the hero. Move it below the CTA?",
    before: "[About section, 3 paragraphs]",
    after: "[About section moved to below CTA]",
  },
  {
    id: 's8',
    band: 'bold',
    scope: 'structure',
    rationale: "Brief reads context-first; objectives buried. Lift Objectives to top?",
    before: "Context → Objectives → Constraints → Deliverables",
    after: "Objectives → Context → Constraints → Deliverables",
  },
];

function bandFromTrust(trust: number): Band {
  if (trust < 30) return 'cautious';
  if (trust < 60) return 'moderate';
  if (trust < 85) return 'confident';
  return 'bold';
}

function modeFromTrust(trust: number): { label: string; sub: string; pill: string } {
  if (trust < 50) return { label: 'Suggest only', sub: 'AI shows changes inline. You approve each one.', pill: 'bg-gray-100 dark:bg-gray-800 text-text-secondary' };
  if (trust < 80) return { label: 'Auto-apply with undo', sub: 'AI applies after 3s. Undo within the window.', pill: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
  return { label: 'Apply silently', sub: 'AI applies immediately. Decision shown in history.', pill: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
}

export default function TrustCalibrationDemo() {
  const [trust, setTrust] = useState(20);
  const [history, setHistory] = useState<{ id: string; action: 'accept' | 'reject'; auto?: boolean }[]>([]);
  const [autoCountdown, setAutoCountdown] = useState<number | null>(null);

  const band = bandFromTrust(trust);
  const mode = modeFromTrust(trust);

  // Pick the next suggestion: matches current band, not yet seen, prefer scope variety
  const current: Suggestion | null = useMemo(() => {
    const seen = new Set(history.map((h) => h.id));
    const pool = SUGGESTIONS.filter((s) => !seen.has(s.id) && s.band === band);
    if (pool.length > 0) return pool[0];
    // Fall back: any unseen suggestion (so the demo keeps moving even if exact band is exhausted)
    const fallback = SUGGESTIONS.filter((s) => !seen.has(s.id));
    return fallback[0] ?? null;
  }, [trust, history, band]);

  // Auto-apply timer for moderate/high trust
  useEffect(() => {
    if (!current) return;
    if (mode.label === 'Suggest only') {
      setAutoCountdown(null);
      return;
    }
    const total = mode.label === 'Apply silently' ? 1 : 3;
    setAutoCountdown(total);
    const interval = setInterval(() => {
      setAutoCountdown((c) => (c === null ? null : Math.max(0, c - 1)));
    }, 1000);
    const timeout = setTimeout(() => {
      setHistory((h) => [...h, { id: current.id, action: 'accept', auto: true }]);
      setTrust((t) => Math.min(100, t + 4));
    }, total * 1000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [current?.id, mode.label]);

  const accept = () => {
    if (!current) return;
    setHistory((h) => [...h, { id: current.id, action: 'accept' }]);
    setTrust((t) => Math.min(100, t + 8));
  };

  const reject = () => {
    if (!current) return;
    setHistory((h) => [...h, { id: current.id, action: 'reject' }]);
    setTrust((t) => Math.max(0, t - 12));
  };

  const reset = () => {
    setHistory([]);
    setTrust(20);
  };

  const trustColor = trust < 30 ? 'bg-red-500' : trust < 60 ? 'bg-amber-500' : trust < 85 ? 'bg-blue-500' : 'bg-green-500';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
        {/* Header — trust meter + mode */}
        <div className="px-5 py-4 border-b border-primary">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-text-primary">Notion AI · Brief draft</p>
              <p className="text-xs text-text-tertiary">{history.length} suggestion{history.length === 1 ? '' : 's'} reviewed</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${mode.pill}`}>{mode.label}</span>
          </div>

          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs text-text-tertiary w-12">Trust</span>
            <div className="flex-1 bg-surface-secondary rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-2 ${trustColor}`}
                animate={{ width: `${trust}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
            </div>
            <span className="text-xs font-medium text-text-primary w-10 text-right">{trust}%</span>
          </div>
          <p className="text-xs text-text-tertiary">{mode.sub}</p>
        </div>

        {/* Suggestion card */}
        <div className="p-5 min-h-[260px]">
          <AnimatePresence mode="wait">
            {current ? (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-primary" />
                  <span className="text-xs uppercase tracking-wide text-text-tertiary font-semibold">
                    {current.scope === 'word' && 'Word edit'}
                    {current.scope === 'sentence' && 'Sentence rewrite'}
                    {current.scope === 'paragraph' && 'Paragraph rewrite'}
                    {current.scope === 'structure' && 'Structural change'}
                  </span>
                </div>

                <p className="text-sm text-text-secondary mb-3">{current.rationale}</p>

                <div className="space-y-2 mb-4">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-lg p-3">
                    <p className="text-[10px] uppercase tracking-wide text-red-700 dark:text-red-400 font-semibold mb-1">Before</p>
                    <p className="text-sm text-text-primary line-through decoration-red-400/60">{current.before}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/40 rounded-lg p-3">
                    <p className="text-[10px] uppercase tracking-wide text-green-700 dark:text-green-400 font-semibold mb-1">After</p>
                    <p className="text-sm text-text-primary">{current.after}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={accept}
                    className="flex-1 px-4 py-2 bg-accent-primary text-background-primary rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Accept
                  </button>
                  <button
                    onClick={reject}
                    className="flex-1 px-4 py-2 border border-primary rounded-lg text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors"
                  >
                    Reject
                  </button>
                  {autoCountdown !== null && autoCountdown > 0 && (
                    <span className="text-xs text-text-tertiary tabular-nums w-20 text-right shrink-0">auto in {autoCountdown}s</span>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-sm text-text-secondary mb-3">No more suggestions in this session.</p>
                <button onClick={reset} className="text-xs px-3 py-1.5 border border-primary rounded-full text-text-primary hover:bg-surface-secondary transition-colors">
                  Start over
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer — recent history */}
        {history.length > 0 && (
          <div className="px-5 py-3 border-t border-primary bg-surface-secondary/40">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-text-tertiary">Recent:</span>
              {history.slice(-8).map((h, i) => (
                <span
                  key={`${h.id}-${i}`}
                  className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${
                    h.action === 'accept'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {h.action === 'accept' ? '✓' : '✗'} {h.auto ? 'auto' : ''}
                </span>
              ))}
              <button onClick={reset} className="ml-auto text-[10px] text-text-tertiary hover:text-text-primary underline-offset-2 hover:underline">
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-text-tertiary text-center mt-3 max-w-md mx-auto leading-relaxed">
        Accept or reject suggestions to see Notion AI&apos;s confidence calibrate in real time.
        Reject several in a row and watch trust collapse — the AI regresses to small, cautious edits.
      </p>
    </div>
  );
}
