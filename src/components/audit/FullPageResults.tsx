'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ArrowPathIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  LightBulbIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import type { AnalysisResults, TopGap, ProductContext } from '@/types/audit';
import { LetterGrade } from './LetterGrade';
import { GapCard } from './GapCard';
import { EmailReportModal } from './EmailReportModal';
import { trackAuditEvent } from '@/lib/audit/analytics';

interface ExtendedResults extends AnalysisResults {
  topGaps?: TopGap[];
  quickWins?: string[];
  chatContext?: string;
  productContext?: ProductContext;
  productTypeSummary?: string;
}

interface FullPageResultsProps {
  results: ExtendedResults | null;
  onNewAudit: () => void;
  isAnalyzing: boolean;
  isDemoMode: boolean;
  screenshotUrl?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const ANALYSIS_MESSAGES = [
  'Scanning your interface...',
  'Comparing against 50+ top AI products...',
  'Checking design patterns and best practices...',
  'Analyzing visual hierarchy...',
  'Evaluating user flow clarity...',
  'Consulting the design agent...',
  'Reviewing accessibility patterns...',
  'Checking for AI UX patterns...',
  'Polishing up the analysis...',
];

const SCAN_PATTERNS = [
  'Conversational UI', 'Error Recovery', 'Confidence Visualization',
  'Explainable AI', 'Progressive Disclosure', 'Human-in-the-Loop',
  'Feedback Loops', 'Graceful Handoff', 'Safe Exploration',
  'Privacy-First Design', 'Adaptive Interfaces', 'Contextual Assistance',
  'Augmented Creation', 'Responsible AI Design', 'Collaborative AI',
  'Ambient Intelligence', 'Predictive Anticipation', 'Multimodal Interaction',
  'Guided Learning', 'Selective Memory', 'Context Switching',
  'Universal Access Patterns', 'Trust Calibration', 'Intent Preview',
  'Autonomy Spectrum', 'Action Audit Trail', 'Escalation Pathways',
  'Agent Status & Monitoring', 'Crisis Detection', 'Anti-Manipulation',
];

const PRODUCT_LOGOS = [
  { src: '/images/logos/simple-icons/openai.svg', alt: 'OpenAI' },
  { src: '/images/logos/simple-icons/anthropic.svg', alt: 'Anthropic' },
  { src: '/images/logos/simple-icons/googlegemini.svg', alt: 'Gemini' },
  { src: '/images/logos/simple-icons/githubcopilot.svg', alt: 'GitHub Copilot' },
  { src: '/images/logos/simple-icons/perplexity.svg', alt: 'Perplexity' },
  { src: '/images/logos/simple-icons/notion.svg', alt: 'Notion' },
  { src: '/images/logos/simple-icons/figma.svg', alt: 'Figma' },
  { src: '/images/logos/simple-icons/cursor.svg', alt: 'Cursor' },
  { src: '/images/logos/simple-icons/midjourney.svg', alt: 'Midjourney' },
  { src: '/images/logos/simple-icons/grammarly.svg', alt: 'Grammarly' },
  { src: '/images/logos/simple-icons/duolingo.svg', alt: 'Duolingo' },
  { src: '/images/logos/simple-icons/huggingface.svg', alt: 'Hugging Face' },
];

const CHAT_SUGGESTIONS = [
  'What should I fix first?',
  'Explain the top issue',
  'Show me examples',
];

function FormattedChatMessage({ content }: { content: string }) {
  const sections = content.split(/\n\n+/);
  return (
    <div className="space-y-3">
      {sections.map((section, idx) => {
        const headerMatch = section.match(/^\*\*([^*]+)\*\*$/);
        if (headerMatch) {
          return (
            <p key={idx} className="font-semibold text-text-primary text-sm uppercase tracking-wide pt-2 border-t border-border-primary/50 mt-2">
              {headerMatch[1]}
            </p>
          );
        }
        if (section.includes('•') || section.includes('- ')) {
          const lines = section.split('\n');
          return (
            <div key={idx} className="space-y-2">
              {lines.map((line, lineIdx) => {
                const trimmed = line.trim();
                if (trimmed.startsWith('•') || trimmed.startsWith('- ')) {
                  const bulletContent = trimmed.replace(/^[•\-]\s*/, '');
                  const parts = bulletContent.split(/\*\*([^*]+)\*\*/);
                  return (
                    <div key={lineIdx} className="flex gap-2 text-sm pl-1 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-primary flex-shrink-0 mt-2" />
                      <span className="text-text-secondary">
                        {parts.map((part, partIdx) =>
                          partIdx % 2 === 1
                            ? <strong key={partIdx} className="font-semibold text-text-primary">{part}</strong>
                            : <span key={partIdx}>{part}</span>
                        )}
                      </span>
                    </div>
                  );
                }
                if (trimmed) {
                  return <p key={lineIdx} className="text-sm text-text-secondary leading-relaxed">{trimmed}</p>;
                }
                return null;
              })}
            </div>
          );
        }
        const parts = section.split(/\*\*([^*]+)\*\*/);
        return (
          <p key={idx} className="text-sm text-text-secondary leading-relaxed">
            {parts.map((part, partIdx) =>
              partIdx % 2 === 1
                ? <strong key={partIdx} className="font-semibold text-text-primary">{part}</strong>
                : <span key={partIdx}>{part}</span>
            )}
          </p>
        );
      })}
    </div>
  );
}

export function FullPageResults({ results, onNewAudit, isAnalyzing, isDemoMode, screenshotUrl }: FullPageResultsProps) {
  // Analysis loading state
  const [messageIndex, setMessageIndex] = useState(0);
  const [scanIndex, setScanIndex] = useState(0);

  // Tab + Chat state
  const [activeTab, setActiveTab] = useState<'issues' | 'chat'>('issues');
  const [hasSentOpener, setHasSentOpener] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Well-implemented collapsed state
  const [showWellImplemented, setShowWellImplemented] = useState(false);

  // Rotate analysis messages
  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % ANALYSIS_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Advance pattern scan checklist
  useEffect(() => {
    if (!isAnalyzing) { setScanIndex(0); return; }
    const interval = setInterval(() => {
      setScanIndex((i) => Math.min(i + 1, SCAN_PATTERNS.length));
    }, 400);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Chat send handler
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
          ...(results.productContext && {
            productContext: results.productContext,
            topGaps: results.topGaps,
            quickWins: results.quickWins,
          }),
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.message || "You've reached the chat limit for this session." },
        ]);
        return;
      }

      if (!response.ok) throw new Error('Chat failed');

      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      trackAuditEvent('audit_chat_message_sent', { messageCount: messages.length + 2 });
    } catch {
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

  // Analyzing state — screenshot overlay with pattern scanner
  if (isAnalyzing && !results) {
    // Show a fixed list of 8 patterns, update their state in place — no scrolling/jumping
    const displayPatterns = SCAN_PATTERNS.slice(0, 8);

    return (
      <div className="min-h-[70vh] relative overflow-hidden rounded-2xl mx-4 sm:mx-6 mt-6">
        {/* Screenshot background */}
        {screenshotUrl && (
          <img
            src={screenshotUrl}
            alt="Your interface being analyzed"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Scanning line animation */}
        <div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-60"
          style={{
            animation: 'scanLine 2.5s ease-in-out infinite',
            top: '0%',
          }}
        />
        <style>{`
          @keyframes scanLine {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { top: 100%; opacity: 0; }
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

        {/* Center overlay content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">

          {/* Pattern scanner card */}
          <div className="w-full max-w-sm rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-5 mb-8">
            <p className="text-[11px] font-medium uppercase tracking-widest text-white/50 mb-4">Checking patterns</p>
            <div className="space-y-2.5">
              {displayPatterns.map((pattern, i) => {
                // Each slot cycles through the full list: the pattern name shown
                // rotates based on scanIndex, while the state (checked/active/pending)
                // stays positionally stable
                const isChecked = i < (scanIndex % (displayPatterns.length + 1));
                const isActive = i === (scanIndex % (displayPatterns.length + 1));

                // Swap in new pattern names as scan progresses through batches
                const batch = Math.floor(scanIndex / displayPatterns.length);
                const patternIdx = (batch * displayPatterns.length + i) % SCAN_PATTERNS.length;
                const patternName = SCAN_PATTERNS[patternIdx];

                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 transition-all duration-300 ${
                      isActive ? 'opacity-100' : isChecked ? 'opacity-60' : 'opacity-30'
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircleIcon className="w-4 h-4 text-status-success flex-shrink-0" />
                    ) : isActive ? (
                      <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                      </div>
                    )}
                    <span className={`text-sm transition-all duration-200 ${
                      isActive ? 'text-white font-medium' : isChecked ? 'text-white/60' : 'text-white/30'
                    }`}>
                      {patternName}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-primary rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min((scanIndex / SCAN_PATTERNS.length) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Logo ticker */}
          <div className="w-full max-w-md mb-8 overflow-hidden">
            <p className="text-[10px] font-medium uppercase tracking-widest text-white/30 text-center mb-3">
              Comparing against top AI products
            </p>
            <div className="overflow-hidden">
              <div
                className="flex gap-6 items-center"
                style={{ animation: 'marquee 15s linear infinite', width: 'max-content' }}
              >
                {/* Double the logos for seamless loop */}
                {[...PRODUCT_LOGOS, ...PRODUCT_LOGOS].map((logo, i) => (
                  <img
                    key={`${logo.alt}-${i}`}
                    src={logo.src}
                    alt={logo.alt}
                    className="w-5 h-5 opacity-40 invert flex-shrink-0"
                    width={20}
                    height={20}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Status message */}
          <p className="text-base font-medium text-white mb-1.5">
            {ANALYSIS_MESSAGES[messageIndex]}
          </p>
          <p className="text-sm text-white/40">This usually takes 10-15 seconds</p>
        </div>
      </div>
    );
  }

  if (!results) return null;

  // Extract data
  const topGaps = results.topGaps || [];
  const quickWins = results.quickWins || [];
  const issues = topGaps.filter((g) => g.status === 'missing' || g.status === 'needs-improvement');
  const wellImplemented = topGaps.filter((g) => g.status === 'good');
  const productSummary = results.productTypeSummary || results.componentDescription || '';
  const topIssues = issues.slice(0, 3);
  const remainingIssues = issues.slice(3);

  return (
    <div className="pb-12 sm:pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">

        {/* Demo banner */}
        {isDemoMode && (
          <div className="mb-6 rounded-xl border border-accent-primary/30 bg-accent-primary/5 p-4 text-center">
            <p className="text-sm text-text-secondary">
              <span className="font-medium text-accent-primary">Demo mode</span> — upload your own screenshot for a real analysis
            </p>
          </div>
        )}

        {/* Split view: screenshot left, findings right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT — Screenshot + Score (sticky on desktop) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* Screenshot */}
              {screenshotUrl && (
                <div className="rounded-2xl border border-border-primary overflow-hidden bg-background-secondary shadow-sm">
                  <img
                    src={screenshotUrl}
                    alt="Your audited interface"
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Score card */}
              <div className="rounded-2xl border border-border-primary bg-background-primary p-6 text-center">
                <LetterGrade score={results.score} maxScore={results.maxScore} size="sm" />
                {productSummary && (
                  <p className="mt-4 text-sm text-text-secondary leading-relaxed">{productSummary}</p>
                )}
              </div>

              {/* CTAs — desktop only (below screenshot) */}
              <div className="hidden lg:flex flex-col gap-2.5">
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border-primary bg-background-primary text-text-primary text-sm font-medium hover:bg-background-secondary transition-colors cursor-pointer"
                >
                  <EnvelopeIcon className="w-4 h-4" />
                  Email Report
                </button>
                <button
                  onClick={onNewAudit}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary text-white dark:text-gray-900 text-sm font-medium hover:bg-accent-hover transition-colors cursor-pointer"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  Run Another Audit
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT — Tab toggle + content */}
          <div className="lg:col-span-7">

            {/* Tab bar */}
            <div className="flex items-center gap-1 mb-6 border-b border-border-primary">
              <button
                onClick={() => setActiveTab('issues')}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'issues'
                    ? 'border-accent-primary text-accent-primary'
                    : 'border-transparent text-text-tertiary hover:text-text-secondary'
                }`}
              >
                Issues{topGaps.length > 0 && ` (${issues.length})`}
              </button>
              <button
                onClick={() => {
                  setActiveTab('chat');
                  // Auto-send opening message on first chat open
                  if (!hasSentOpener && issues.length > 0) {
                    setHasSentOpener(true);
                    const topPatterns = issues.slice(0, 3).map(g => g.pattern).join(', ');
                    setTimeout(() => sendMessage(
                      `I found ${issues.length} issues in my interface. The top priorities are: ${topPatterns}. What should I fix first and how?`
                    ), 200);
                  }
                }}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === 'chat'
                    ? 'border-accent-primary text-accent-primary'
                    : 'border-transparent text-text-tertiary hover:text-text-secondary'
                }`}
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                Chat
                {messages.length > 0 && activeTab !== 'chat' && (
                  <span className="w-2 h-2 rounded-full bg-accent-primary" />
                )}
              </button>
            </div>

            {/* Issues tab */}
            {activeTab === 'issues' && (
              <div className="space-y-8">
                {/* Top Issues */}
                {issues.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                      Top Issues
                      <span className="text-sm font-normal text-text-tertiary">({issues.length})</span>
                    </h2>
                    <div className="space-y-3">
                      {topIssues.map((gap, i) => (
                        <GapCard key={gap.pattern} gap={gap} index={i + 1} />
                      ))}
                    </div>

                    {remainingIssues.length > 0 && (
                      <div className="mt-3">
                        <button
                          onClick={() => setShowWellImplemented(prev => !prev)}
                          className="flex items-center gap-1.5 text-sm font-medium text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                        >
                          <ChevronDownIcon className={`w-4 h-4 transition-transform ${showWellImplemented ? 'rotate-180' : ''}`} />
                          {showWellImplemented ? 'Show less' : `Show ${remainingIssues.length} more issues`}
                        </button>
                        {showWellImplemented && (
                          <div className="space-y-3 mt-3">
                            {remainingIssues.map((gap, i) => (
                              <GapCard key={gap.pattern} gap={gap} index={topIssues.length + i + 1} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                )}

                {/* All Good state */}
                {issues.length === 0 && topGaps.length > 0 && (
                  <div className="text-center py-8">
                    <CheckCircleIcon className="w-16 h-16 text-status-success mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-text-primary mb-2">Great job!</h2>
                    <p className="text-text-secondary">All applicable patterns are well implemented.</p>
                  </div>
                )}

                {/* Quick Wins */}
                {quickWins.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                      <LightBulbIcon className="w-5 h-5 text-amber-500" />
                      Quick Wins
                    </h2>
                    <div className="rounded-xl border border-border-primary bg-background-primary p-5">
                      <ul className="space-y-3">
                        {quickWins.map((win, i) => (
                          <li key={i} className="flex gap-3 text-sm">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xs font-semibold">
                              {i + 1}
                            </span>
                            <span className="text-text-secondary leading-relaxed">{win}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                )}

                {/* What You're Doing Well */}
                {wellImplemented.length > 0 && (
                  <section>
                    <details className="group">
                      <summary className="flex items-center gap-2 text-lg font-semibold text-text-primary cursor-pointer hover:text-accent-primary transition-colors list-none">
                        <CheckCircleIcon className="w-5 h-5 text-status-success" />
                        What You&apos;re Doing Well
                        <span className="text-sm font-normal text-text-tertiary">({wellImplemented.length})</span>
                        <ChevronDownIcon className="w-4 h-4 text-text-tertiary transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="space-y-3 mt-4">
                        {wellImplemented.map((gap) => (
                          <GapCard key={gap.pattern} gap={gap} />
                        ))}
                      </div>
                    </details>
                  </section>
                )}
              </div>
            )}

            {/* Chat tab */}
            {activeTab === 'chat' && (
              <div className="rounded-xl border border-border-primary bg-background-primary overflow-hidden flex flex-col" style={{ minHeight: '60vh' }}>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {messages.length === 0 && !isLoading && (
                    <div>
                      <p className="text-sm text-text-tertiary mb-4">Ask anything about your audit results:</p>
                      <div className="flex flex-wrap gap-2">
                        {CHAT_SUGGESTIONS.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => sendMessage(suggestion)}
                            className="px-3 py-1.5 rounded-full border border-border-primary text-sm text-text-secondary hover:bg-background-secondary hover:text-text-primary transition-colors cursor-pointer"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-accent-primary text-white dark:text-gray-900'
                          : 'bg-background-secondary'
                      }`}>
                        {msg.role === 'user' ? (
                          <p className="text-sm">{msg.content}</p>
                        ) : (
                          <FormattedChatMessage content={msg.content} />
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-background-secondary rounded-2xl px-4 py-3">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-border-primary p-3 flex gap-2">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about your results..."
                    rows={1}
                    className="flex-1 resize-none rounded-xl border border-border-primary bg-background-primary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary"
                  />
                  <button
                    onClick={() => sendMessage(inputValue)}
                    disabled={!inputValue.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-accent-primary text-white dark:text-gray-900 disabled:opacity-40 hover:bg-accent-hover transition-colors cursor-pointer"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* CTAs — mobile only (below findings) */}
            <div className="flex flex-col sm:flex-row gap-3 lg:hidden mt-8">
              <button
                onClick={() => setShowEmailModal(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border-primary bg-background-primary text-text-primary text-sm font-medium hover:bg-background-secondary transition-colors cursor-pointer"
              >
                <EnvelopeIcon className="w-4 h-4" />
                Email Report
              </button>
              <button
                onClick={onNewAudit}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent-primary text-white dark:text-gray-900 text-sm font-medium hover:bg-accent-hover transition-colors cursor-pointer"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Run Another Audit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Report Modal */}
      {showEmailModal && (
        <EmailReportModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          results={results}
          productContext={results.productContext}
        />
      )}
    </div>
  );
}
