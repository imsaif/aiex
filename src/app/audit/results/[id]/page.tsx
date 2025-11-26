'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScoreCircle } from '@/components/audit/ScoreCircle';
import { IssueCard } from '@/components/audit/IssueCard';
import { PatternCard } from '@/components/audit/PatternCard';
import type { AnalysisResults } from '@/types/audit';

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [showFullReport, setShowFullReport] = useState(false);

  useEffect(() => {
    const savedResults = sessionStorage.getItem('auditResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    } else {
      router.push('/audit');
    }
  }, [router]);

  if (!results) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-text-secondary">Loading results...</div>
      </div>
    );
  }

  const patternArray = Object.entries(results.patterns).map(([id, data]) => ({
    id,
    ...data,
  }));

  // Get top 3 issues (weak or missing patterns, sorted by priority)
  const issues = patternArray
    .filter((p) => p.status === 'weak' || p.status === 'missing')
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background-primary py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with Score */}
          <div className="text-center mb-12">
            <ScoreCircle score={results.score} total={28} />
            <h1 className="text-3xl font-semibold mt-6 mb-3 text-text-primary">
              Pattern Audit Complete
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {results.summary}
            </p>
          </div>

          {/* Top 3 Issues */}
          {issues.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-text-primary">
                🔧 Top {issues.length} Issues to Fix
              </h2>
              <div className="space-y-4">
                {issues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    patternId={issue.id}
                    patternName={patterns.find(p => p.id === issue.id)?.name || issue.id}
                    status={issue.status as 'weak' | 'missing'}
                    improvementPrompt={issue.improvement || 'No specific improvement suggestion available.'}
                    priority={issue.priority}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/audit"
              className="px-8 py-3 bg-accent-primary dark:bg-white text-white dark:text-black rounded-2xl font-semibold hover:scale-[1.02] transition-transform shadow-card text-center"
            >
              Start New Audit
            </Link>
            <Link
              href="/"
              className="px-8 py-3 border-2 border-border-primary rounded-2xl font-semibold text-text-primary hover:border-border-secondary transition-colors text-center"
            >
              Explore All Patterns
            </Link>
          </div>

          {/* Full Report (Collapsible) */}
          <div className="border-2 border-border-primary rounded-2xl p-6 bg-background-secondary">
            <button
              onClick={() => setShowFullReport(!showFullReport)}
              className="w-full flex items-center justify-between text-left"
            >
              <div>
                <h3 className="text-xl font-semibold text-text-primary">
                  Full Pattern Report
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  View all 28 patterns analyzed
                </p>
              </div>
              {showFullReport ? (
                <ChevronUpIcon className="w-6 h-6 text-text-primary" />
              ) : (
                <ChevronDownIcon className="w-6 h-6 text-text-primary" />
              )}
            </button>

            {showFullReport && (
              <div className="mt-6 pt-6 border-t-2 border-border-primary space-y-6">
                {patternArray
                  .sort((a, b) => {
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                  })
                  .map((pattern) => (
                    <PatternCard
                      key={pattern.id}
                      pattern={pattern}
                      context={results.context}
                      onImplementationClick={() => {}}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

// Pattern names mapping
const patterns = [
  { id: 'adaptive-interfaces', name: 'Adaptive Interfaces' },
  { id: 'ambient-intelligence', name: 'Ambient Intelligence' },
  { id: 'anti-manipulation', name: 'Anti-Manipulation Safeguards' },
  { id: 'augmented-creation', name: 'Augmented Creation' },
  { id: 'collaborative-ai', name: 'Collaborative AI' },
  { id: 'confidence-visualization', name: 'Confidence Visualization' },
  { id: 'context-switching', name: 'Context Switching' },
  { id: 'contextual-assistance', name: 'Contextual Assistance' },
  { id: 'conversational-ui', name: 'Conversational UI' },
  { id: 'crisis-detection', name: 'Crisis Detection & Escalation' },
  { id: 'error-recovery', name: 'Error Recovery' },
  { id: 'explainable-ai', name: 'Explainable AI' },
  { id: 'feedback-loops', name: 'Feedback Loops' },
  { id: 'graceful-handoff', name: 'Graceful Handoff' },
  { id: 'guided-learning', name: 'Guided Learning' },
  { id: 'human-in-the-loop', name: 'Human-in-the-Loop' },
  { id: 'intelligent-caching', name: 'Intelligent Caching' },
  { id: 'multimodal-interaction', name: 'Multimodal Interaction' },
  { id: 'predictive-anticipation', name: 'Predictive Anticipation' },
  { id: 'privacy-first', name: 'Privacy-First Design' },
  { id: 'progressive-disclosure', name: 'Progressive Disclosure' },
  { id: 'progressive-enhancement', name: 'Progressive Enhancement' },
  { id: 'responsible-ai', name: 'Responsible AI Design' },
  { id: 'safe-exploration', name: 'Safe Exploration' },
  { id: 'selective-memory', name: 'Selective Memory' },
  { id: 'session-degradation', name: 'Session Degradation Prevention' },
  { id: 'universal-access', name: 'Universal Access Patterns' },
  { id: 'vulnerable-user-protection', name: 'Vulnerable User Protection' },
];
