'use client';

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PaperAirplaneIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { AnalysisResults, PatternResult } from '@/types/audit';

// Designer-friendly analysis messages
const ANALYSIS_MESSAGES = [
  "Scanning your interface...",
  "Comparing against 500+ top AI products...",
  "Checking design patterns and best practices...",
  "Analyzing visual hierarchy...",
  "Evaluating user flow clarity...",
  "Consulting the design agent...",
  "Reviewing accessibility patterns...",
  "Checking for AI UX patterns...",
  "Polishing up the analysis...",
];

interface ResultsPanelProps {
  results: AnalysisResults | null;
  onNewAudit: () => void;
  isAnalyzing?: boolean;
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

// Full score circle for expanded view
function CompactScore({ score, total }: { score: number; total: number }) {
  const percentage = total > 0 ? (score / total) * 100 : 0;
  const strokeWidth = 8;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 70) return 'text-status-success';
    if (percentage >= 40) return 'text-status-warning';
    return 'text-status-error';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="transform -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-border-primary"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${getColor()} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold text-text-primary">
          {score}
          <span className="text-lg text-text-tertiary">/{total}</span>
        </div>
      </div>
    </div>
  );
}

// Pattern Category Section Component
function PatternCategorySection({
  title,
  icon,
  patterns,
  status,
  defaultExpanded = false,
}: {
  title: string;
  icon: React.ReactNode;
  patterns: (PatternResult & { id: string })[];
  status: 'good' | 'weak' | 'missing' | 'na';
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (patterns.length === 0) return null;

  const getHeaderColor = () => {
    switch (status) {
      case 'good': return 'text-status-success';
      case 'weak': return 'text-status-warning';
      case 'missing': return 'text-status-error';
      case 'na': return 'text-text-tertiary';
    }
  };

  const getBgColor = () => {
    switch (status) {
      case 'good': return 'bg-green-50 dark:bg-green-900/10';
      case 'weak': return 'bg-yellow-50 dark:bg-yellow-900/10';
      case 'missing': return 'bg-red-50 dark:bg-red-900/10';
      case 'na': return 'bg-gray-50 dark:bg-gray-800/50';
    }
  };

  // Sort by priority for weak/missing
  const sortedPatterns = status === 'weak' || status === 'missing'
    ? [...patterns].sort((a, b) => {
        const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2, none: 3 };
        return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
      })
    : patterns;

  return (
    <div className={`rounded-xl overflow-hidden border border-border-primary ${getBgColor()}`}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-background-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={getHeaderColor()}>{icon}</span>
          <span className={`text-lg font-semibold ${getHeaderColor()}`}>{title}</span>
          <span className="text-base text-text-tertiary">({patterns.length})</span>
        </div>
        {expanded ? (
          <ChevronUpIcon className="w-5 h-5 text-text-tertiary" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-text-tertiary" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {sortedPatterns.map((pattern) => (
            <div key={pattern.id} className="bg-background-primary rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-medium text-text-primary">{pattern.name}</span>
                    {(status === 'weak' || status === 'missing') && pattern.priority !== 'none' && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        pattern.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        pattern.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {pattern.priority}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{pattern.evidence}</p>
                  {pattern.improvement && (status === 'weak' || status === 'missing') && (
                    <div className="mt-3 p-3 bg-accent-subtle rounded-lg">
                      <p className="text-sm text-accent-primary font-medium">💡 {pattern.improvement}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Suggestion pills for chat
const SUGGESTIONS = [
  'How do I fix the top issue?',
  'What should I prioritize?',
  'Explain this score',
];

export function ResultsPanel({ results, onNewAudit, isAnalyzing = false }: ResultsPanelProps) {
  const [chatMode, setChatMode] = useState(false); // false = analysis view, true = chat view
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
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
    .map(([id, data]) => ({
      id,
      ...data,
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
          <div className="flex-1 overflow-y-auto space-y-5 mb-5 min-h-[100px]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'user' ? (
                  <div className="max-w-[85%] px-5 py-3.5 rounded-2xl rounded-br-md text-lg bg-accent-primary text-white leading-relaxed">
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
              className="p-4 bg-accent-primary text-white rounded-xl hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

  // ANALYSIS VIEW (default)
  return (
    <aside className="w-full h-full flex-shrink-0 p-6 bg-background-primary/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border-primary/50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <CheckBadgeIcon className="w-7 h-7 text-status-success" />
        <span className="text-lg font-semibold text-text-primary">Analysis Complete</span>
        <CompactScoreInline score={results.score} total={maxScore} />
      </div>

      {/* Trust Header */}
      <div className="flex items-center justify-center gap-2 mb-4 py-2 px-4 bg-background-secondary rounded-full">
        <ShieldCheckIcon className="w-4 h-4 text-accent-primary" />
        <p className="text-sm text-text-secondary">
          Checked against <span className="font-semibold text-text-primary">28 AI patterns</span> from{' '}
          <span className="font-semibold text-text-primary">500+ products</span>
        </p>
      </div>

      {/* Detected component badge */}
      {results.componentDescription && (
        <p className="text-base text-text-secondary mb-4 px-4 py-2.5 bg-background-secondary rounded-full text-center">
          {results.componentDescription}
        </p>
      )}

      {/* Full Analysis Results - Scrollable */}
      <div className="flex-1 overflow-y-auto mb-5">
        {/* Score Circle */}
        <div className="text-center mb-6">
          <CompactScore score={results.score} total={maxScore} />
          <p className="text-lg text-text-secondary mt-4 leading-relaxed">
            {results.summary}
          </p>
        </div>

        {/* Pattern Category Sections */}
        <div className="space-y-3">
          {/* Missing Patterns - Expanded by default, shown first for urgency */}
          <PatternCategorySection
            title="Missing Patterns"
            icon={<XCircleIcon className="w-6 h-6" />}
            patterns={missingPatterns}
            status="missing"
            defaultExpanded={true}
          />

          {/* Weak Patterns - Expanded by default */}
          <PatternCategorySection
            title="Needs Improvement"
            icon={<ExclamationTriangleIcon className="w-6 h-6" />}
            patterns={weakPatterns}
            status="weak"
            defaultExpanded={true}
          />

          {/* Good Patterns - Collapsed by default */}
          <PatternCategorySection
            title="Well Implemented"
            icon={<CheckCircleIcon className="w-6 h-6" />}
            patterns={goodPatterns}
            status="good"
            defaultExpanded={false}
          />

          {/* Not Applicable - Collapsed by default */}
          <PatternCategorySection
            title="Not Applicable"
            icon={<MinusCircleIcon className="w-6 h-6" />}
            patterns={naPatterns}
            status="na"
            defaultExpanded={false}
          />
        </div>

        {/* All Good Message - Only if no issues */}
        {missingPatterns.length === 0 && weakPatterns.length === 0 && (
          <div className="text-center py-8">
            <CheckCircleIcon className="w-14 h-14 mx-auto mb-4 text-status-success" />
            <p className="text-lg font-medium text-text-primary">Great job!</p>
            <p className="text-base text-text-secondary">All applicable patterns are well implemented.</p>
          </div>
        )}
      </div>

      {/* Chat with Design Mentor CTA */}
      <div className="pt-4 border-t border-border-primary">
        <button
          type="button"
          onClick={() => setChatMode(true)}
          className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-accent-primary text-white rounded-full text-lg font-medium hover:bg-accent-hover transition-colors"
        >
          <SparklesIcon className="w-6 h-6" />
          Chat with Design Mentor
        </button>
      </div>

      {/* New Audit Button */}
      <div className="pt-3">
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
