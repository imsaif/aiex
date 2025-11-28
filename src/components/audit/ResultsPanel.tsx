'use client';

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { AnalysisResults, PatternResult } from '@/types/audit';

interface ResultsPanelProps {
  results: AnalysisResults;
  onNewAudit: () => void;
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
    <div className="space-y-3">
      {sections.map((section, idx) => {
        // Check if it's a header (starts with **)
        const headerMatch = section.match(/^\*\*([^*]+)\*\*$/);
        if (headerMatch) {
          return (
            <p key={idx} className="font-semibold text-text-primary text-xs uppercase tracking-wide pt-2 border-t border-border-primary/50 mt-2">
              {headerMatch[1]}
            </p>
          );
        }

        // Check if it contains bullet points
        if (section.includes('•')) {
          const lines = section.split('\n');
          return (
            <div key={idx} className="space-y-2">
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
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-primary flex-shrink-0" />
                          <span className="font-semibold text-sm text-text-primary">{patternMatch[1]}</span>
                        </div>
                        <p className="text-xs text-text-secondary ml-3.5 mt-0.5">{patternMatch[2]}</p>
                      </div>
                    );
                  }

                  // Regular bullet without pattern name
                  const parts = bulletContent.split(/\*\*([^*]+)\*\*/);
                  return (
                    <div key={lineIdx} className="flex gap-2 text-sm pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-primary flex-shrink-0 mt-1.5" />
                      <span>
                        {parts.map((part, partIdx) =>
                          partIdx % 2 === 1
                            ? <strong key={partIdx} className="font-medium">{part}</strong>
                            : <span key={partIdx}>{part}</span>
                        )}
                      </span>
                    </div>
                  );
                }
                // Non-bullet line in bullet section (probably header)
                if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                  return (
                    <p key={lineIdx} className="font-semibold text-text-primary text-xs uppercase tracking-wide pt-2 border-t border-border-primary/50 mt-2">
                      {trimmed.slice(2, -2)}
                    </p>
                  );
                }
                return trimmed ? <p key={lineIdx} className="text-sm">{trimmed}</p> : null;
              })}
            </div>
          );
        }

        // Regular text - parse for bold
        const parts = section.split(/\*\*([^*]+)\*\*/);
        return (
          <p key={idx} className="text-sm leading-relaxed">
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
    <span className={`font-semibold ${getColor()}`}>
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

// Issue item component
function IssueItem({ pattern, index }: { pattern: PatternResult & { id: string }; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusIcon = () => {
    if (pattern.status === 'missing') {
      return <XCircleIcon className="w-5 h-5 text-status-error" />;
    }
    return <ExclamationTriangleIcon className="w-5 h-5 text-status-warning" />;
  };

  const getPriorityBadge = () => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[pattern.priority] || colors.low}`}>
        {pattern.priority}
      </span>
    );
  };

  return (
    <div className="border border-border-primary rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-3 hover:bg-background-secondary transition-colors text-left"
      >
        <span className="text-sm font-medium text-text-tertiary mt-0.5">{index + 1}.</span>
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-text-primary truncate">{pattern.name}</span>
            {getPriorityBadge()}
          </div>
          <p className="text-xs text-text-secondary line-clamp-1">{pattern.evidence}</p>
        </div>
        {expanded ? (
          <ChevronUpIcon className="w-4 h-4 text-text-tertiary flex-shrink-0" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 text-text-tertiary flex-shrink-0" />
        )}
      </button>

      {expanded && pattern.improvement && (
        <div className="px-3 pb-3 pt-0">
          <div className="p-3 bg-accent-subtle rounded-lg">
            <p className="text-xs font-medium text-accent-primary mb-1">Fix suggestion:</p>
            <p className="text-sm text-text-primary">{pattern.improvement}</p>
          </div>
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

export function ResultsPanel({ results, onNewAudit }: ResultsPanelProps) {
  const [collapsed, setCollapsed] = useState(true); // Start collapsed
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Convert patterns object to array, excluding non-applicable patterns
  const patternArray = Object.entries(results.patterns)
    .map(([id, data]) => ({
      id,
      ...data,
    }))
    .filter((p) => p.status !== 'not-applicable');

  const issues = patternArray
    .filter((p) => p.status === 'weak' || p.status === 'missing')
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2, none: 3 };
      return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
    })
    .slice(0, 5);

  const wellImplemented = patternArray.filter((p) => p.status === 'well-implemented').length;
  const maxScore = results.maxScore || 28;

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to chat API
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

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

      if (!response.ok) throw new Error('Chat failed');

      const data = await response.json();
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

  return (
    <aside className="w-[360px] h-full flex-shrink-0 p-4 bg-background-primary/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border-primary/50 flex flex-col overflow-hidden">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between w-full p-2 -m-2 mb-2 hover:bg-background-secondary rounded-xl transition-colors"
      >
        <div className="flex items-center gap-2">
          <CheckBadgeIcon className="w-5 h-5 text-status-success" />
          <span className="text-sm font-semibold text-text-primary">Analysis Complete</span>
          <CompactScoreInline score={results.score} total={maxScore} />
        </div>
        {collapsed ? (
          <ChevronDownIcon className="w-4 h-4 text-text-tertiary" />
        ) : (
          <ChevronUpIcon className="w-4 h-4 text-text-tertiary" />
        )}
      </button>

      {/* Detected component badge */}
      {results.componentDescription && (
        <p className="text-xs text-text-tertiary mb-3 px-3 py-1.5 bg-background-secondary rounded-full text-center">
          {results.componentDescription}
        </p>
      )}

      {/* Collapsible Results Section */}
      {!collapsed && (
        <div className="mb-4 pb-4 border-b border-border-primary overflow-y-auto max-h-[40vh]">
          {/* Score Circle */}
          <div className="text-center mb-4">
            <CompactScore score={results.score} total={maxScore} />
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              {results.summary}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 mb-4 py-3 border-y border-border-primary">
            <div className="text-center">
              <div className="text-lg font-semibold text-status-success">{wellImplemented}</div>
              <div className="text-xs text-text-tertiary">Good</div>
            </div>
            <div className="w-px h-8 bg-border-primary" />
            <div className="text-center">
              <div className="text-lg font-semibold text-status-warning">
                {patternArray.filter((p) => p.status === 'weak').length}
              </div>
              <div className="text-xs text-text-tertiary">Weak</div>
            </div>
            <div className="w-px h-8 bg-border-primary" />
            <div className="text-center">
              <div className="text-lg font-semibold text-status-error">
                {patternArray.filter((p) => p.status === 'missing').length}
              </div>
              <div className="text-xs text-text-tertiary">Missing</div>
            </div>
          </div>

          {/* Top Issues */}
          {issues.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                Top Issues
              </h3>
              <div className="space-y-2">
                {issues.map((issue, index) => (
                  <IssueItem key={issue.id} pattern={issue} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* All Good Message */}
          {issues.length === 0 && (
            <div className="text-center py-4">
              <CheckCircleIcon className="w-10 h-10 mx-auto mb-2 text-status-success" />
              <p className="text-sm font-medium text-text-primary">Great job!</p>
              <p className="text-xs text-text-secondary">All patterns are well implemented.</p>
            </div>
          )}
        </div>
      )}

      {/* Chat Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-3">
          <SparklesIcon className="w-4 h-4 text-accent-primary" />
          <h3 className="text-sm font-semibold text-text-primary">Ask about this analysis</h3>
        </div>

        {/* Suggestion Pills (show when no messages) */}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                className="px-3 py-1.5 text-xs bg-background-secondary hover:bg-background-tertiary text-text-secondary hover:text-text-primary rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-3 min-h-[100px]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-br-md text-sm bg-accent-primary text-white">
                  {msg.content}
                </div>
              ) : (
                <div className="max-w-[95%] px-3 py-2 rounded-2xl rounded-bl-md bg-background-secondary text-text-primary">
                  <FormattedMessage content={msg.content} />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-background-secondary text-text-tertiary px-3 py-2 rounded-2xl rounded-bl-md text-sm">
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
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            rows={1}
            className="flex-1 px-3 py-2 text-sm bg-background-secondary border border-border-primary rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          />
          <button
            type="button"
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            className="p-2 bg-accent-primary text-white rounded-xl hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* New Audit Button */}
      <div className="pt-3 mt-3 border-t border-border-primary">
        <button
          type="button"
          onClick={onNewAudit}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-full transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Start New Audit
        </button>
      </div>
    </aside>
  );
}
