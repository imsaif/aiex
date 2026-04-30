'use client';

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PaperAirplaneIcon,
  MinusCircleIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { AnalysisResults, PatternResult, TopGap, ProductContext } from '@/types/audit';
import { PatternModal } from './PatternModal';
import { EmailReportModal } from './EmailReportModal';
import { trackAuditEvent } from '@/lib/audit/analytics';
import { ANALYSIS_MESSAGES, CHAT_SUGGESTIONS } from './shared';

// Extended results type that includes context-first fields when available
interface ExtendedResults extends AnalysisResults {
  topGaps?: TopGap[];
  quickWins?: string[];
  chatContext?: string;
  productContext?: ProductContext;
  productTypeSummary?: string;
}

interface ResultsPanelProps {
  results: ExtendedResults | null;
  onNewAudit: () => void;
  isAnalyzing?: boolean;
  isDemoMode?: boolean;
  /** Increment to trigger chat mode from outside */
  chatTrigger?: number;
  /** Increment to trigger email report modal from outside */
  emailReportTrigger?: number;
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




export function ResultsPanel({ results, onNewAudit, isAnalyzing = false, isDemoMode = false, chatTrigger = 0, emailReportTrigger = 0 }: ResultsPanelProps) {
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<(PatternResult & { id: string }) | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Switch to chat mode when triggered externally
  useEffect(() => {
    if (chatTrigger > 0) setChatMode(true);
  }, [chatTrigger]);

  // Open email report modal when triggered externally
  useEffect(() => {
    if (emailReportTrigger > 0) setShowEmailModal(true);
  }, [emailReportTrigger]);

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
          sessionId: results.id,
          analysisContext: {
            detectedComponent: results.detectedComponent,
            componentDescription: results.componentDescription,
            score: results.score,
            maxScore: results.maxScore,
            patterns: results.patterns,
            summary: results.summary,
            criticalMissing: results.criticalMissing,
          },
          // Context-first fields (when available)
          ...(results.productContext && {
            productContext: results.productContext,
            topGaps: results.topGaps,
            quickWins: results.quickWins,
          }),
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
      trackAuditEvent('audit_chat_message_sent', { messageCount: messages.length + 2 });
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

  const maxScore = results.maxScore || 36;

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
              {CHAT_SUGGESTIONS.map((suggestion) => (
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

      </aside>
    );
  }

  const hasContextFirstData = !!(results.topGaps && results.topGaps.length > 0);

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
      </div>

      {/* Product Summary (context-first) */}
      {results.productTypeSummary && (
        <p className="text-sm text-text-secondary mb-4 -mt-2">{results.productTypeSummary}</p>
      )}

      {/* Demo mode subtle hint */}
      {isDemoMode && (
        <p className="text-xs text-text-tertiary text-center mb-4">
          Demo mode — Upload your own screenshot for a real analysis
        </p>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">

        {/* CONTEXT-FIRST: Top Gaps Section */}
        {hasContextFirstData ? (
          <div className="mb-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-accent-subtle">
                <SparklesIcon className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Top Gaps Found</h2>
                <p className="text-sm text-text-tertiary">
                  {results.topGaps!.filter(g => g.status === 'missing').length} missing,{' '}
                  {results.topGaps!.filter(g => g.status === 'needs-improvement').length} need improvement
                </p>
              </div>
            </div>

            {/* Gap Cards */}
            <div className="space-y-3">
              {results.topGaps!
                .filter(g => g.status !== 'good')
                .slice(0, 5)
                .map((gap, index) => (
                <div
                  key={gap.pattern}
                  className="p-4 rounded-xl border border-border-primary bg-background-secondary/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-primary text-white dark:text-gray-900 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="font-semibold text-text-primary">{gap.pattern}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          gap.status === 'missing'
                            ? 'bg-status-error/10 text-status-error'
                            : 'bg-status-warning/10 text-status-warning'
                        }`}>
                          {gap.status === 'missing' ? (
                            <><XCircleIcon className="w-3 h-3" /> Missing</>
                          ) : (
                            <><ExclamationTriangleIcon className="w-3 h-3" /> Improve</>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed mb-2">{gap.finding}</p>
                      <p className="text-sm text-text-primary leading-relaxed">
                        <strong>Fix:</strong> {gap.recommendation}
                      </p>
                      {gap.resource && (
                        <a
                          href={gap.resource.startsWith('http') ? gap.resource : `https://${gap.resource}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-xs text-accent-primary hover:underline"
                          onClick={() => trackAuditEvent('audit_resource_clicked', { resource: gap.resource, pattern: gap.pattern })}
                        >
                          Learn more &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Wins */}
            {results.quickWins && results.quickWins.length > 0 && (
              <div className="mt-5 p-4 rounded-xl border border-border-primary bg-status-success/5">
                <h3 className="text-sm font-semibold text-status-success mb-2 flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4" />
                  Quick Wins
                </h3>
                <ul className="space-y-1.5">
                  {results.quickWins.map((win, i) => (
                    <li key={i} className="text-sm text-text-secondary flex gap-2">
                      <span className="text-status-success mt-0.5">•</span>
                      {win}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Primary CTA */}
            <button
              type="button"
              onClick={() => {
                setChatMode(true);
                const firstGap = results.topGaps!.find(g => g.status === 'missing') || results.topGaps![0];
                setTimeout(() => sendMessage(`Help me fix ${firstGap.pattern}. Give me specific steps for my ${results.productContext?.productDescription || 'product'}.`), 100);
              }}
              className="w-full mt-5 flex items-center justify-center gap-2 px-5 py-4 bg-accent-primary text-white dark:text-gray-900 rounded-xl text-base font-semibold hover:bg-accent-hover transition-colors cursor-pointer"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              Get Help Fixing These
            </button>

            {/* Email Report Button */}
            <button
              type="button"
              onClick={() => setShowEmailModal(true)}
              className="w-full mt-3 flex items-center justify-center gap-2 px-5 py-3 border border-border-primary text-text-secondary rounded-xl text-base font-medium hover:bg-background-secondary hover:text-text-primary transition-colors"
            >
              <EnvelopeIcon className="w-5 h-5" />
              Email This Report
            </button>

            {/* Good patterns collapsed */}
            {results.topGaps!.filter(g => g.status === 'good').length > 0 && (
              <details className="mt-4 group">
                <summary className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary hover:text-text-primary py-2">
                  <ChevronDownIcon className="w-4 h-4 transition-transform group-open:rotate-180" />
                  Well Implemented ({results.topGaps!.filter(g => g.status === 'good').length} patterns)
                </summary>
                <div className="pt-3 space-y-2">
                  {results.topGaps!.filter(g => g.status === 'good').map(gap => (
                    <div key={gap.pattern} className="p-3 rounded-lg border border-border-primary bg-background-secondary/30">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircleIcon className="w-4 h-4 text-status-success" />
                        <span className="text-sm font-medium text-text-primary">{gap.pattern}</span>
                      </div>
                      <p className="text-xs text-text-tertiary ml-6">{gap.finding}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        ) : (
          /* All Good State */
          <div className="text-center py-8 mb-6">
            <CheckCircleIcon className="w-14 h-14 mx-auto mb-4 text-status-success" />
            <p className="text-lg font-medium text-text-primary">Great job!</p>
            <p className="text-base text-text-secondary mb-5">All applicable patterns are well implemented.</p>

            {/* Email Report Button for All Good State */}
            <button
              type="button"
              onClick={() => setShowEmailModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-border-primary text-text-secondary rounded-xl text-base font-medium hover:bg-background-secondary hover:text-text-primary transition-colors"
            >
              <EnvelopeIcon className="w-5 h-5" />
              Email This Report
            </button>
          </div>
        )}

        {/* FULL REPORT - Collapsed Accordion */}
        {allPatterns.length > 0 && (
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary hover:text-text-primary py-3 border-t border-border-primary">
              <ChevronDownIcon className="w-4 h-4 transition-transform group-open:rotate-180" />
              View Full Report ({allPatterns.length} patterns)
            </summary>

            <div className="pt-4 space-y-5">
              {[
                { patterns: missingPatterns, label: 'Missing', headerClass: 'text-status-error', Icon: XCircleIcon, dim: false },
                { patterns: weakPatterns, label: 'Needs Improvement', headerClass: 'text-status-warning', Icon: ExclamationTriangleIcon, dim: false },
                { patterns: goodPatterns, label: 'Well Implemented', headerClass: 'text-status-success', Icon: CheckCircleIcon, dim: false },
                { patterns: naPatterns, label: 'Not Applicable', headerClass: 'text-text-tertiary', Icon: MinusCircleIcon, dim: true },
              ].map(({ patterns, label, headerClass, Icon, dim }) =>
                patterns.length === 0 ? null : (
                  <div key={label}>
                    <h3 className={`text-sm font-semibold ${headerClass} mb-3 flex items-center gap-2`}>
                      <Icon className="w-4 h-4" />
                      {label} ({patterns.length})
                    </h3>
                    <div className="space-y-2">
                      {patterns.map(pattern => (
                        <button
                          key={pattern.id}
                          type="button"
                          onClick={() => setSelectedPattern(pattern)}
                          className="w-full p-3 rounded-lg border border-border-primary bg-background-secondary/30 hover:bg-background-secondary hover:border-accent-primary/30 transition-all text-left group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-sm font-medium ${dim ? 'text-text-secondary' : 'text-text-primary'} group-hover:text-accent-primary transition-colors`}>
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
                )
              )}
            </div>
          </details>
        )}
      </div>


      {/* Pattern Detail Modal */}
      <PatternModal
        isOpen={!!selectedPattern}
        onClose={() => setSelectedPattern(null)}
        pattern={selectedPattern}
      />

      {/* Email Report Modal */}
      <EmailReportModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        results={results}
        productContext={results.productContext}
      />
    </aside>
  );
}
