'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PatternCard } from '@/components/audit/PatternCard';
import type { AnalysisResults, PatternStatus } from '@/types/audit';

type FilterType = 'all' | PatternStatus;

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

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

  const wellImplemented = patternArray.filter((p) => p.status === 'well-implemented');
  const weak = patternArray.filter((p) => p.status === 'weak');
  const missing = patternArray.filter((p) => p.status === 'missing');

  const filteredPatterns =
    filter === 'all'
      ? patternArray
      : patternArray.filter((p) => p.status === filter);

  const sortedPatterns = filteredPatterns.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const getInterfaceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      chatbot: 'Chatbot/Conversational',
      content: 'Content Generator',
      code: 'Code Assistant',
      image: 'Image/Creative AI',
      analytics: 'Analytics/Insights',
      other: 'AI Interface',
    };
    return labels[type] || type;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background-primary py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Critical Alert Banner */}
        {results.criticalMissing.length > 0 && (
          <div className="mb-8 bg-accent-subtle border-2 border-text-primary text-text-primary p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg mb-2">
                  ⚠️ Critical Finding for {getInterfaceTypeLabel(results.context.interfaceType)}
                </div>
                <div className="text-text-secondary">
                  Your interface lacks {results.criticalMissing.length} essential pattern
                  {results.criticalMissing.length > 1 ? 's' : ''}. These are critical for {results.context.mainConcern} concerns.
                </div>
              </div>
              <button
                onClick={() => setFilter('missing')}
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:scale-[1.02] transition-transform whitespace-nowrap shadow-card"
              >
                Show Missing →
              </button>
            </div>
          </div>
        )}

        {/* Header with Score */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b-2 border-border-primary">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-semibold mb-3 text-text-primary tracking-tight">
              Pattern Audit Results
            </h1>
            <p className="text-lg text-text-secondary">
              Analyzed: {getInterfaceTypeLabel(results.context.interfaceType)} •
              Focus: {results.context.mainConcern.replace('-', ' ')}
            </p>
          </div>

          {/* Score Card */}
          <div className="bg-black dark:bg-white text-white dark:text-black px-8 py-6 rounded-2xl text-center min-w-[200px] shadow-card">
            <div className="text-5xl font-semibold mb-2">{results.score}/28</div>
            <div className="text-sm opacity-90 mb-2">Patterns Detected</div>
            {results.criticalMissing.length > 0 && (
              <div className="text-xs opacity-80">
                {results.criticalMissing.length} Critical Missing
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8 p-6 bg-background-secondary rounded-2xl border-2 border-border-primary">
          <h2 className="text-xl font-semibold mb-3 text-text-primary">Summary</h2>
          <p className="text-text-secondary leading-relaxed">{results.summary}</p>
        </div>

        {/* Filter Sidebar + Patterns Grid */}
        <div className="grid lg:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status Filters */}
            <div className="bg-background-secondary p-5 rounded-2xl border-2 border-border-primary">
              <h3 className="font-semibold mb-4 text-text-primary">Filter by Status</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    filter === 'all'
                      ? 'bg-accent-subtle border-2 border-black dark:border-white'
                      : 'hover:bg-accent-subtle border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ChartBarIcon className="w-5 h-5 text-text-primary" />
                    <span className="font-semibold text-text-primary">All Patterns</span>
                  </div>
                  <span className="px-2 py-1 bg-background-tertiary border border-border-primary rounded-lg text-xs font-semibold text-text-primary">
                    {patternArray.length}
                  </span>
                </button>

                <button
                  onClick={() => setFilter('well-implemented')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    filter === 'well-implemented'
                      ? 'bg-accent-subtle border-2 border-black dark:border-white'
                      : 'hover:bg-accent-subtle border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-text-primary" />
                    <span className="font-semibold text-text-primary">✓ Well Implemented</span>
                  </div>
                  <span className="px-2 py-1 bg-background-tertiary border border-border-primary rounded-lg text-xs font-semibold text-text-primary">
                    {wellImplemented.length}
                  </span>
                </button>

                <button
                  onClick={() => setFilter('weak')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    filter === 'weak'
                      ? 'bg-accent-subtle border-2 border-black dark:border-white'
                      : 'hover:bg-accent-subtle border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-text-primary" />
                    <span className="font-semibold text-text-primary">⚠ Needs Work</span>
                  </div>
                  <span className="px-2 py-1 bg-background-tertiary border border-border-primary rounded-lg text-xs font-semibold text-text-primary">
                    {weak.length}
                  </span>
                </button>

                <button
                  onClick={() => setFilter('missing')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    filter === 'missing'
                      ? 'bg-accent-subtle border-2 border-black dark:border-white'
                      : 'hover:bg-accent-subtle border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <XCircleIcon className="w-5 h-5 text-text-primary" />
                    <span className="font-semibold text-text-primary">✗ Missing</span>
                  </div>
                  <span className="px-2 py-1 bg-background-tertiary border border-border-primary rounded-lg text-xs font-semibold text-text-primary">
                    {missing.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-background-secondary p-5 rounded-2xl border-2 border-border-primary">
              <h3 className="font-semibold mb-4 text-text-primary">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  aria-label="Export audit results as PDF"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-surface-primary border-2 border-border-primary rounded-xl font-semibold text-text-primary hover:border-border-secondary transition-colors text-sm"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  Export PDF
                </button>
                <button
                  aria-label="Download audit results as JSON"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-surface-primary border-2 border-border-primary rounded-xl font-semibold text-text-primary hover:border-border-secondary transition-colors text-sm"
                >
                  <DocumentTextIcon className="w-4 h-4" />
                  Download JSON
                </button>
                <button
                  aria-label="Share audit results via link"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-surface-primary border-2 border-border-primary rounded-xl font-semibold text-text-primary hover:border-border-secondary transition-colors text-sm"
                >
                  <ShareIcon className="w-4 h-4" />
                  Share Link
                </button>
              </div>
            </div>
          </div>

          {/* Pattern Cards */}
          <div className="space-y-6">
            {sortedPatterns.length === 0 ? (
              <div className="text-center py-12 text-text-tertiary">
                No patterns match this filter
              </div>
            ) : (
              sortedPatterns.map((pattern) => (
                <PatternCard
                  key={pattern.id}
                  pattern={pattern}
                  context={results.context}
                  onImplementationClick={() => setSelectedPattern(pattern.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 flex justify-center gap-4">
          <Link
            href="/audit"
            className="px-6 py-3 border-2 border-border-primary rounded-2xl font-semibold text-text-primary hover:border-border-secondary transition-colors"
          >
            ← Start New Audit
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-semibold hover:scale-[1.02] transition-transform shadow-card"
          >
            Explore All 28 Patterns →
          </Link>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
