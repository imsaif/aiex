'use client';

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PaperAirplaneIcon,
  MinusCircleIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { AnalysisResults, PatternResult } from '@/types/audit';
import { PatternModal } from './PatternModal';

// Designer-friendly analysis messages
const ANALYSIS_MESSAGES = [
  "Scanning your interface...",
  "Comparing against 50+ top AI products...",
  "Checking design patterns and best practices...",
  "Analyzing visual hierarchy...",
  "Evaluating user flow clarity...",
  "Consulting the design agent...",
  "Reviewing accessibility patterns...",
  "Checking for AI UX patterns...",
  "Polishing up the analysis...",
];

// Quick suggestion prompts for chat
const SUGGESTIONS = [
  "What should I fix first?",
  "Explain the top issue",
  "Show me examples",
];

interface ResultsPanelProps {
  results: AnalysisResults | null;
  onNewAudit: () => void;
  isAnalyzing?: boolean;
  isDemoMode?: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Simple markdown renderer for chat messages
function FormattedMessage({ content }: { content: string }) {
  // Split by double newlines for paragraphs/sections
  const sections = content.split(/\n\n+/);

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        // Check if it's a header (starts with **)
        const headerMatch = section.match(/^\*\*([^*]+)\*\*$/);
        if (headerMatch) {
          return (
            <p key={idx} className="font-semibold text-text-primary text-base uppercase tracking-wide pt-3 border-t border-border-primary/50 mt-3">
              {headerMatch[1]}
            </p>
          );
        }

        // Check if it contains bullet points
        if (section.includes('•')) {
          const lines = section.split('\n');
          return (
            <div key={idx} className="space-y-3">
              {lines.map((line, lineIdx) => {
                const trimmed = line.trim();
                if (trimmed.startsWith('•')) {
                  // Parse bold text within bullet - check if it has a pattern name (bold followed by dash)
                  const bulletContent = trimmed.substring(1).trim();
                  const patternMatch = bulletContent.match(/^\*\*([^*]+)\*\*\s*[-–—]\s*(.+)$/);

                  if (patternMatch) {
                    // Pattern name on its own line, description below
                    return (
                      <div key={lineIdx} className="pl-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent-primary flex-shrink-0" />
                          <span className="font-semibold text-lg text-text-primary">{patternMatch[1]}</span>
                        </div>
                        <p className="text-base text-text-secondary ml-4 mt-1 leading-relaxed">{patternMatch[2]}</p>
                      </div>
                    );
                  }

                  // Regular bullet without pattern name
                  const parts = bulletContent.split(/\*\*([^*]+)\*\*/);
                  return (
                    <div key={lineIdx} className="flex gap-3 text-lg pl-1 leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-accent-primary flex-shrink-0 mt-2.5" />
                      <span>
                        {parts.map((part, partIdx) =>
                          partIdx % 2 === 1
                            ? <strong key={partIdx} className="font-semibold">{part}</strong>
                            : <span key={partIdx}>{part}</span>
                        )}
                      </span>
                    </div>
                  );
                }
                // Non-bullet line in bullet section (probably header)
                if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                  return (
                    <p key={lineIdx} className="font-semibold text-text-primary text-base uppercase tracking-wide pt-3 border-t border-border-primary/50 mt-3">
                      {trimmed.slice(2, -2)}
                    </p>
                  );
                }
                return trimmed ? <p key={lineIdx} className="text-lg leading-relaxed">{trimmed}</p> : null;
              })}
            </div>
          );
        }

        // Regular text - parse for bold
        const parts = section.split(/\*\*([^*]+)\*\*/);
        return (
          <p key={idx} className="text-lg leading-relaxed">
            {parts.map((part, partIdx) =>
              partIdx % 2 === 1
                ? <strong key={partIdx} className="font-semibold">{part}</strong>
                : <span key={partIdx}>{part}</span>
            )}
          </p>
        );
      })}
    </div>
  );
}

// Compact score display (inline, not circle)
function CompactScoreInline({ score, total }: { score: number; total: number }) {
  const percentage = total > 0 ? (score / total) * 100 : 0;

  const getColor = () => {
    if (percentage >= 70) return 'text-status-success';
    if (percentage >= 40) return 'text-status-warning';
    return 'text-status-error';
  };

  return (
    <span className={`text-lg font-semibold ${getColor()}`}>
      {score}/{total}
    </span>
  );
}




// Get top 3 priority patterns to fix
function getTopPriorities(
  missingPatterns: (PatternResult & { id: string })[],
  weakPatterns: (PatternResult & { id: string })[]
): (PatternResult & { id: string })[] {
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2, none: 3 };

  // Combine missing and weak, prioritize missing first, then by priority level
  const combined = [
    ...missingPatterns.map(p => ({ ...p, isMissing: true })),
    ...weakPatterns.map(p => ({ ...p, isMissing: false })),
  ].sort((a, b) => {
    // Missing patterns first
    if (a.isMissing !== b.isMissing) return a.isMissing ? -1 : 1;
    // Then by priority
    return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
  });

  return combined.slice(0, 3);
}

// Generate copyable results summary
function generateResultsSummary(
  results: AnalysisResults,
  missingPatterns: (PatternResult & { id: string })[],
  weakPatterns: (PatternResult & { id: string })[],
  goodPatterns: (PatternResult & { id: string })[]
): string {
  const lines: string[] = [
    'AI UX Audit Results',
    `Score: ${results.score}/${results.maxScore || 28} patterns detected`,
    '',
  ];

  if (missingPatterns.length > 0) {
    lines.push('Missing Patterns:');
    missingPatterns.slice(0, 5).forEach(p => {
      lines.push(`• ${p.name}${p.improvement ? ` - ${p.improvement}` : ''}`);
    });
    lines.push('');
  }

  if (weakPatterns.length > 0) {
    lines.push('Needs Improvement:');
    weakPatterns.slice(0, 5).forEach(p => {
      lines.push(`• ${p.name}${p.improvement ? ` - ${p.improvement}` : ''}`);
    });
    lines.push('');
  }

  lines.push(`Well Implemented: ${goodPatterns.length} patterns`);
  lines.push('');
  lines.push('Run your own audit: aiuxdesign.guide/audit');

  return lines.join('\n');
}

export function ResultsPanel({ results, onNewAudit, isAnalyzing = false, isDemoMode = false }: ResultsPanelProps) {
  const [chatMode, setChatMode] = useState(false); // false = analysis view, true = chat view
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<(PatternResult & { id: string }) | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Rotate through analysis messages
  useEffect(() => {
    if (!isAnalyzing) {
      setMessageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % ANALYSIS_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Auto-scroll to bottom of messages (only after user sends a message)
  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send message to chat API
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading || !results) return;

    const userMessage: ChatMessage = { role: 'user', content: content.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/audit/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          messages: [...messages, userMessage],
          sessionId: results.id, // Use analysis ID as session ID for rate limiting
          analysisContext: {
            detectedComponent: results.detectedComponent,
            componentDescription: results.componentDescription,
            score: results.score,
            maxScore: results.maxScore,
            patterns: results.patterns,
            summary: results.summary,
            criticalMissing: results.criticalMissing,
          },
        }),
      });

      const data = await response.json();

      // Handle rate limit error
      if (response.status === 429) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `⚠️ ${data.message || "You've reached the chat limit for this session. Start a new analysis to continue chatting."}` },
        ]);
        return;
      }

      if (!response.ok) throw new Error('Chat failed');

      const assistantMessage: ChatMessage = { role: 'assistant', content: data.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, results, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  // Handle asking about a specific pattern - switches to chat and sends question
  const handleAskAboutPattern = useCallback((patternName: string) => {
    setChatMode(true);
    // Small delay to allow chat mode to render, then send message
    setTimeout(() => {
      sendMessage(`How do I implement ${patternName}? Give me specific, actionable steps.`);
    }, 100);
  }, [sendMessage]);

  // Handle copy results to clipboard
  const handleCopy = useCallback(async () => {
    if (!results) return;

    const allPatterns = Object.entries(results.patterns).map(([patternId, data]) => ({ ...data, id: patternId }));
    const missing = allPatterns.filter(p => p.status === 'missing');
    const weak = allPatterns.filter(p => p.status === 'weak');
    const good = allPatterns.filter(p => p.status === 'well-implemented');

    const summary = generateResultsSummary(results, missing, weak, good);

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [results]);

  // Show loading state if analyzing
  if (isAnalyzing || !results) {
    return (
      <aside className="w-full h-full flex-shrink-0 p-6 bg-background-primary/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border-primary/50 flex flex-col items-center justify-center">
        {/* Animated spinner */}
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-accent-primary/20 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
        </div>

        {/* Rotating message */}
        <p className="text-text-primary text-lg font-medium text-center px-4 mb-2">
          {ANALYSIS_MESSAGES[messageIndex]}
        </p>

        {/* Subtitle */}
        <p className="text-text-tertiary text-base text-center">
          This usually takes 10-15 seconds
        </p>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mt-6">
          {ANALYSIS_MESSAGES.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === messageIndex
                  ? 'bg-accent-primary scale-125'
                  : i < messageIndex
                  ? 'bg-accent-primary/60'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>
      </aside>
    );
  }

  // Convert patterns object to array (include all patterns)
  const allPatterns = Object.entries(results.patterns)
    .map(([patternId, data]) => ({
      ...data,
      id: patternId,
    }));

  // Group patterns by status
  const goodPatterns = allPatterns.filter((p) => p.status === 'well-implemented');
  const weakPatterns = allPatterns.filter((p) => p.status === 'weak');
  const missingPatterns = allPatterns.filter((p) => p.status === 'missing');
  const naPatterns = allPatterns.filter((p) => p.status === 'not-applicable');

  const maxScore = results.maxScore || 28;

  // CHAT MODE VIEW
  if (chatMode) {
    return (
      <aside className="w-full h-full flex-shrink-0 p-6 bg-background-primary/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border-primary/50 flex flex-col overflow-hidden">
        {/* Compact Header with Back Button */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-border-primary">
          <div className="flex items-center gap-3">
            <CheckBadgeIcon className="w-7 h-7 text-status-success" />
            <span className="text-lg font-semibold text-text-primary">Score:</span>
            <CompactScoreInline score={results.score} total={maxScore} />
          </div>
          <button
            type="button"
            onClick={() => setChatMode(false)}
            className="text-base font-medium text-accent-primary hover:text-accent-hover transition-colors"
          >
            ← Back to Analysis
          </button>
        </div>

        {/* Chat Section - Full Height */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-3 mb-5">
            <SparklesIcon className="w-6 h-6 text-accent-primary" />
            <h3 className="text-xl font-semibold text-text-primary">Chat with Design Mentor</h3>
          </div>

          {/* Suggestion Pills (show when no messages) */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-3 mb-5">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => sendMessage(suggestion)}
                  className="px-4 py-2.5 text-base bg-background-secondary hover:bg-background-tertiary text-text-secondary hover:text-text-primary rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-5 mb-5 min-h-0">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'user' ? (
                  <div className="max-w-[85%] px-5 py-3.5 rounded-2xl rounded-br-md text-lg bg-accent-primary text-white dark:text-gray-900 leading-relaxed">
                    {msg.content}
                  </div>
                ) : (
                  <div className="max-w-[95%] px-5 py-4 rounded-2xl rounded-bl-md bg-background-secondary text-text-primary">
                    <FormattedMessage content={msg.content} />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-background-secondary text-text-tertiary px-5 py-4 rounded-2xl rounded-bl-md text-lg">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              rows={1}
              className="flex-1 px-5 py-4 text-lg bg-background-secondary border border-border-primary rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
            />
            <button
              type="button"
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="p-4 bg-accent-primary text-white dark:text-gray-900 rounded-xl hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* New Audit Button */}
        <div className="pt-4 mt-4 border-t border-border-primary">
          <button
            type="button"
            onClick={onNewAudit}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-full transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Start New Audit
          </button>
        </div>
      </aside>
    );
  }

  // Get top 3 priorities for the hero section
  const topPriorities = getTopPriorities(missingPatterns, weakPatterns);
  const remainingPatternCount = allPatterns.length - topPriorities.length;

  // ANALYSIS VIEW (default) - SIMPLIFIED
  return (
    <aside className="w-full h-full flex-shrink-0 p-6 bg-background-primary/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border-primary/50 flex flex-col overflow-hidden">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CheckBadgeIcon className="w-6 h-6 text-status-success" />
          <span className="font-semibold text-text-primary">
            {isDemoMode ? 'Sample Analysis' : 'Analysis Complete'}
          </span>
          <span className="text-text-secondary">
            {results.score}/{maxScore}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 text-text-tertiary hover:text-text-primary hover:bg-background-secondary rounded-lg transition-colors"
            title={copied ? 'Copied!' : 'Copy results'}
          >
            {copied ? (
              <ClipboardDocumentCheckIcon className="w-5 h-5 text-status-success" />
            ) : (
              <ClipboardDocumentIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Demo mode subtle hint */}
      {isDemoMode && (
        <p className="text-xs text-text-tertiary text-center mb-4">
          Demo mode — Upload your own screenshot for a real analysis
        </p>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* TOP 3 PRIORITIES - Hero Section */}
        {topPriorities.length > 0 ? (
          <div className="mb-6">
            {/* Hero Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-accent-subtle">
                <SparklesIcon className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  Top {topPriorities.length} Priorities
                </h2>
                <p className="text-sm text-text-tertiary">Fix these first for maximum impact</p>
              </div>
            </div>

            {/* Priority Cards */}
            <div className="space-y-3">
              {topPriorities.map((pattern, index) => {
                const isMissing = pattern.status === 'missing';

                return (
                  <button
                    key={pattern.id}
                    type="button"
                    onClick={() => setSelectedPattern(pattern)}
                    className="w-full group p-4 rounded-xl border border-border-primary bg-background-secondary/50 hover:bg-background-secondary hover:border-accent-primary/50 transition-all text-left"
                  >
                    <div className="flex items-start gap-4">
                      {/* Rank Number */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-primary text-white dark:text-gray-900 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                            {pattern.name}
                          </span>
                          {/* Status Badge */}
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            isMissing
                              ? 'bg-status-error/10 text-status-error'
                              : 'bg-status-warning/10 text-status-warning'
                          }`}>
                            {isMissing ? (
                              <><XCircleIcon className="w-3 h-3" /> Missing</>
                            ) : (
                              <><ExclamationTriangleIcon className="w-3 h-3" /> Improve</>
                            )}
                          </span>
                        </div>
                        {pattern.improvement && (
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {pattern.improvement}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <ChevronRightIcon className="w-5 h-5 text-text-tertiary group-hover:text-accent-primary transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Primary CTA */}
            <button
              type="button"
              onClick={() => {
                setChatMode(true);
                setTimeout(() => sendMessage(`Help me fix ${topPriorities[0]?.name}. Give me specific steps.`), 100);
              }}
              className="w-full mt-5 flex items-center justify-center gap-2 px-5 py-4 bg-accent-primary text-white dark:text-gray-900 rounded-xl text-base font-semibold hover:bg-accent-hover transition-colors cursor-pointer"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              Get Help Fixing These
            </button>
          </div>
        ) : (
          /* All Good State */
          <div className="text-center py-8 mb-6">
            <CheckCircleIcon className="w-14 h-14 mx-auto mb-4 text-status-success" />
            <p className="text-lg font-medium text-text-primary">Great job!</p>
            <p className="text-base text-text-secondary">All applicable patterns are well implemented.</p>
          </div>
        )}

        {/* FULL REPORT - Collapsed Accordion */}
        {remainingPatternCount > 0 && (
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary hover:text-text-primary py-3 border-t border-border-primary">
              <ChevronDownIcon className="w-4 h-4 transition-transform group-open:rotate-180" />
              View Full Report ({remainingPatternCount} more patterns)
            </summary>

            <div className="pt-4 space-y-5">
              {/* Missing Patterns */}
              {missingPatterns.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-status-error mb-3 flex items-center gap-2">
                    <XCircleIcon className="w-4 h-4" />
                    Missing ({missingPatterns.length})
                  </h3>
                  <div className="space-y-2">
                    {missingPatterns.map(pattern => (
                      <button
                        key={pattern.id}
                        type="button"
                        onClick={() => setSelectedPattern(pattern)}
                        className="w-full p-3 rounded-lg border border-border-primary bg-background-secondary/30 hover:bg-background-secondary hover:border-accent-primary/30 transition-all text-left group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                            {pattern.name}
                          </span>
                          <ChevronRightIcon className="w-4 h-4 text-text-tertiary group-hover:text-accent-primary flex-shrink-0 mt-0.5" />
                        </div>
                        {pattern.evidence && (
                          <p className="text-xs text-text-tertiary mt-1 line-clamp-2">{pattern.evidence}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Weak Patterns */}
              {weakPatterns.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-status-warning mb-3 flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    Needs Improvement ({weakPatterns.length})
                  </h3>
                  <div className="space-y-2">
                    {weakPatterns.map(pattern => (
                      <button
                        key={pattern.id}
                        type="button"
                        onClick={() => setSelectedPattern(pattern)}
                        className="w-full p-3 rounded-lg border border-border-primary bg-background-secondary/30 hover:bg-background-secondary hover:border-accent-primary/30 transition-all text-left group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                            {pattern.name}
                          </span>
                          <ChevronRightIcon className="w-4 h-4 text-text-tertiary group-hover:text-accent-primary flex-shrink-0 mt-0.5" />
                        </div>
                        {pattern.evidence && (
                          <p className="text-xs text-text-tertiary mt-1 line-clamp-2">{pattern.evidence}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Good Patterns */}
              {goodPatterns.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-status-success mb-3 flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    Well Implemented ({goodPatterns.length})
                  </h3>
                  <div className="space-y-2">
                    {goodPatterns.map(pattern => (
                      <button
                        key={pattern.id}
                        type="button"
                        onClick={() => setSelectedPattern(pattern)}
                        className="w-full p-3 rounded-lg border border-border-primary bg-background-secondary/30 hover:bg-background-secondary hover:border-accent-primary/30 transition-all text-left group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                            {pattern.name}
                          </span>
                          <ChevronRightIcon className="w-4 h-4 text-text-tertiary group-hover:text-accent-primary flex-shrink-0 mt-0.5" />
                        </div>
                        {pattern.evidence && (
                          <p className="text-xs text-text-tertiary mt-1 line-clamp-2">{pattern.evidence}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* N/A Patterns */}
              {naPatterns.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-text-tertiary mb-3 flex items-center gap-2">
                    <MinusCircleIcon className="w-4 h-4" />
                    Not Applicable ({naPatterns.length})
                  </h3>
                  <div className="space-y-2">
                    {naPatterns.map(pattern => (
                      <button
                        key={pattern.id}
                        type="button"
                        onClick={() => setSelectedPattern(pattern)}
                        className="w-full p-3 rounded-lg border border-border-primary bg-background-secondary/30 hover:bg-background-secondary hover:border-accent-primary/30 transition-all text-left group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium text-text-secondary group-hover:text-accent-primary transition-colors">
                            {pattern.name}
                          </span>
                          <ChevronRightIcon className="w-4 h-4 text-text-tertiary group-hover:text-accent-primary flex-shrink-0 mt-0.5" />
                        </div>
                        {pattern.evidence && (
                          <p className="text-xs text-text-tertiary mt-1 line-clamp-2">{pattern.evidence}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </details>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 mt-4 border-t border-border-primary flex items-center justify-between">
        <button
          type="button"
          onClick={onNewAudit}
          className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-2 transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4" />
          New Audit
        </button>
        <button
          type="button"
          onClick={() => setChatMode(true)}
          className="text-sm text-accent-primary hover:underline flex items-center gap-2 cursor-pointer"
        >
          <ChatBubbleLeftRightIcon className="w-4 h-4" />
          Chat with AI Mentor
        </button>
      </div>

      {/* Pattern Detail Modal */}
      <PatternModal
        isOpen={!!selectedPattern}
        onClose={() => setSelectedPattern(null)}
        pattern={selectedPattern}
      />
    </aside>
  );
}
