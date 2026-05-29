'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LightBulbIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
  SparklesIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
import { composeHandoffPrompt } from '@/lib/audit/handoff';
import type { AnalysisResults, TopGap, ProductContext } from '@/types/audit';
import { GapCard } from './GapCard';
import { EmailReportModal } from './EmailReportModal';
import { DemoProductMockup, DEMO_PINS } from './DemoProductMockup';
import { LaptopFrame } from './LaptopFrame';
import { PhoneFrame } from './PhoneFrame';
import { DemoChatMockup } from './DemoChatMockup';
import { trackAuditEvent } from '@/lib/audit/analytics';
import { ANALYSIS_MESSAGES, CHAT_SUGGESTIONS } from './shared';
import { PaywallInlineCapture } from './PaywallInlineCapture';
import CompanyLogoCarousel from '@/components/ui/CompanyLogoCarousel';
import { companyLogos } from '@/data/company-logos';

interface ExtendedResults extends AnalysisResults {
  topGaps?: TopGap[];
  quickWins?: string[];
  chatContext?: string;
  productContext?: ProductContext;
  productTypeSummary?: string;
  surfaceDescription?: string;
  applicablePatterns?: string[];
}

interface FullPageResultsProps {
  results: ExtendedResults | null;
  onNewAudit: () => void;
  isAnalyzing: boolean;
  isDemoMode: boolean;
  screenshotUrl?: string;
  screenshotDeviceType?: 'mobile' | 'desktop';
  screenshots?: Array<{ url: string; deviceType: 'mobile' | 'desktop' }>;
  onStartRealAudit?: () => void;
  auditsRemaining?: number;
  isPaywalled?: boolean;
  auditCount?: number;
  isUnlocked?: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

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

// Deterministic pin positions overlaid on the user's uploaded screenshot.
// We don't have AI-detected coordinates, so we distribute up to 5 pins evenly
// across the screenshot — the side panel reveals the actual pattern feedback.
const REAL_PIN_POSITIONS: Array<{ xPct: number; yPct: number }> = [
  { xPct: 22, yPct: 18 },
  { xPct: 78, yPct: 22 },
  { xPct: 50, yPct: 45 },
  { xPct: 22, yPct: 70 },
  { xPct: 78, yPct: 76 },
];

// Buttons inside the canvas can yank the page to bottom on click via focus-anchored
// scroll. Suppress mousedown's default and blur on click to keep keyboard a11y.
function withFocusSuppress(onClick: () => void) {
  return {
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault(),
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick();
      e.currentTarget.blur();
    },
  };
}

function GapSidePanel({ gap, pinNumber, onClose }: { gap: TopGap; pinNumber: number; onClose: () => void }) {
  // Lock body scroll while the mobile bottom sheet is open so it doesn't
  // double-scroll with the page underneath. No-op on desktop (the side
  // panel is contained within the canvas).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    if (!isMobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);

  return (
    <>
      {/* Backdrop: fixed full-screen on mobile, absolute within canvas on desktop. */}
      <button
        onClick={onClose}
        aria-label="Close panel"
        className="fixed lg:absolute inset-0 bg-black/50 lg:bg-black/30 z-40 lg:z-20 cursor-pointer animate-fade-in"
      />
      {/* Sheet: fixed bottom sheet on mobile, right-anchored side panel on desktop. */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Pattern detected: ${gap.pattern}`}
        className="fixed lg:absolute inset-x-0 bottom-0 lg:inset-x-auto lg:top-0 lg:right-0 lg:bottom-0 w-full lg:w-[420px] max-h-[85vh] lg:max-h-none z-50 lg:z-30 bg-background-primary border-t lg:border-t-0 lg:border-l border-border-primary shadow-xl overflow-y-auto overscroll-contain rounded-t-2xl lg:rounded-none animate-slide-up lg:animate-slide-in"
      >
        {/* Drag handle (mobile only) — visual affordance for the bottom-sheet pattern. */}
        <div className="lg:hidden flex justify-center pt-2.5 pb-1" aria-hidden>
          <div className="w-10 h-1.5 rounded-full bg-border-primary" />
        </div>
        <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-border-primary bg-background-primary">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary text-white dark:text-gray-900 text-sm font-bold">
              {pinNumber}
            </span>
            <p className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">Pattern detected</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-md hover:bg-background-secondary cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5 text-text-tertiary" />
          </button>
        </div>
        <div className="p-5">
          <GapCard gap={gap} />
        </div>
      </aside>
    </>
  );
}

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

interface IntentSuggestion {
  slug: string;
  title: string;
  category: string;
  description: string;
  why: string;
  url: string;
}

function EmptyAuditState({
  surfaceDescription,
  screenshotUrl,
  productType,
  onTryAgain,
}: {
  surfaceDescription?: string;
  screenshotUrl?: string;
  productType?: string;
  onTryAgain: () => void;
}) {
  const [intent, setIntent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<IntentSuggestion[] | null>(null);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const [statusIndex, setStatusIndex] = useState(0);

  const STATUS_MESSAGES = [
    'Reading your intent…',
    'Scanning 36 patterns in the library…',
    'Matching against your use case…',
    'Ranking by relevance…',
  ];

  useEffect(() => {
    trackAuditEvent('audit_empty_state_shown', {
      hasSurfaceDescription: !!surfaceDescription,
    });
  }, [surfaceDescription]);

  useEffect(() => {
    if (!submitting) {
      setStatusIndex(0);
      return;
    }
    const id = setInterval(() => {
      setStatusIndex((i) => Math.min(i + 1, STATUS_MESSAGES.length - 1));
    }, 1800);
    return () => clearInterval(id);
  }, [submitting, STATUS_MESSAGES.length]);

  const handleTryAgain = () => {
    trackAuditEvent('audit_empty_state_retry_clicked');
    onTryAgain();
  };

  const handleSuggest = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = intent.trim();
    if (trimmed.length < 8 || submitting) return;
    setSubmitting(true);
    setSuggestError(null);
    setSuggestions(null);
    trackAuditEvent('audit_intent_submitted', { length: trimmed.length });
    try {
      const res = await fetch('/api/audit/suggest-patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent: trimmed, productType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSuggestError(data.error || 'Could not generate suggestions. Please try again.');
        trackAuditEvent('audit_intent_suggestions_failed', {
          status: res.status,
          reason: data.error || 'unknown',
        });
      } else {
        setSuggestions(data.suggestions);
        trackAuditEvent('audit_intent_suggestions_returned', { count: data.suggestions?.length ?? 0 });
      }
    } catch (err) {
      setSuggestError('Network error. Please try again.');
      trackAuditEvent('audit_intent_suggestions_failed', {
        status: 0,
        reason: err instanceof Error ? err.message.slice(0, 100) : 'network_error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePatternClick = (slug: string) => {
    trackAuditEvent('audit_intent_pattern_clicked', { slug });
  };

  const hasSuggestions = !!suggestions && suggestions.length > 0;

  return (
    <div className="pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-6">
        {/* Card 1: Empty-state diagnostic — internal 2-col on lg+ */}
        <div className="bg-background-primary border border-border-primary rounded-2xl p-5 sm:p-12 lg:p-14">
          <div className="grid lg:grid-cols-5 gap-6 sm:gap-10 lg:gap-12 items-center lg:min-h-[360px]">
            <div className="lg:col-span-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary leading-tight mb-4 sm:mb-6">
                We scanned for 36 AI UX patterns
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-8">
                These patterns cover behaviors like confidence cues, error recovery, and explainability. None showed up in your screenshot, which usually means the surface isn&apos;t displaying AI output yet.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={handleTryAgain}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border-primary bg-background-primary text-text-primary font-semibold text-base hover:bg-background-secondary transition-colors cursor-pointer"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                  Try another screenshot
                </button>
                <span className="text-base text-text-tertiary">
                  This run didn&apos;t count against your free audit.
                </span>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-5">
              {(surfaceDescription || screenshotUrl) && (
                <div className="flex gap-4 px-5 py-5 rounded-xl bg-background-secondary border border-border-primary">
                  {screenshotUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={screenshotUrl}
                      alt="The screenshot you uploaded"
                      className="w-24 h-24 object-cover rounded-md border border-border-primary opacity-85 flex-shrink-0"
                    />
                  )}
                  {surfaceDescription && (
                    <div className="min-w-0">
                      <p className="text-sm font-semibold uppercase tracking-wider text-text-tertiary mb-2">What we saw</p>
                      <p className="text-base text-text-secondary leading-relaxed line-clamp-5">{surfaceDescription}</p>
                    </div>
                  )}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-text-tertiary mb-3">Works best on</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-base px-4 py-1.5 rounded-full bg-background-secondary border border-border-primary text-text-secondary">Chat threads</span>
                  <span className="text-base px-4 py-1.5 rounded-full bg-background-secondary border border-border-primary text-text-secondary">Code assistants</span>
                  <span className="text-base px-4 py-1.5 rounded-full bg-background-secondary border border-border-primary text-text-secondary">AI features</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Intent capture + suggestions */}
        <div className="bg-background-primary border border-border-primary rounded-2xl p-5 sm:p-12 lg:p-14">
          <div className="grid lg:grid-cols-5 gap-6 sm:gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-wider text-text-tertiary mb-3">
                Or skip the screenshot
              </p>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-3 sm:mb-4 leading-tight">
                Tell us what you&apos;re trying to design
              </h3>
              <p className="text-lg text-text-secondary leading-relaxed">
                We&apos;ll surface the most relevant patterns from the library based on your intent. Nothing to upload, just describe it.
              </p>
            </div>

            <form onSubmit={handleSuggest} className="lg:col-span-3">
              <textarea
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="e.g., A chat assistant for customer support that can hand off to a human, or an AI agent that schedules meetings on the user's behalf."
                className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-border-primary bg-background-primary text-base text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary resize-none leading-relaxed"
                disabled={submitting}
              />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                <span className="text-sm sm:text-base text-text-tertiary order-2 sm:order-1">{intent.length}/1000</span>
                <button
                  type="submit"
                  disabled={submitting || intent.trim().length < 8}
                  className="order-1 sm:order-2 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-accent-primary text-white font-semibold text-base hover:bg-accent-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer min-h-[48px]"
                >
                  {submitting ? 'Finding patterns…' : 'Show me relevant patterns'}
                </button>
              </div>
              {suggestError && (
                <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-base text-red-700 dark:text-red-300">
                  {suggestError}
                </div>
              )}
            </form>
          </div>

          {submitting && (
            <div className="mt-10 pt-10 border-t border-border-primary">
              <div className="flex items-center gap-3 mb-5" aria-live="polite">
                <span className="relative inline-flex w-3 h-3" aria-hidden="true">
                  <span className="absolute inset-0 rounded-full bg-accent-primary animate-ping opacity-75"></span>
                  <span className="relative rounded-full w-3 h-3 bg-accent-primary"></span>
                </span>
                <p className="text-base text-text-secondary transition-opacity duration-300">
                  {STATUS_MESSAGES[statusIndex]}
                </p>
              </div>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <li key={i}>
                    <div className="block h-full px-5 py-5 rounded-xl border border-border-primary bg-background-secondary/30 animate-pulse">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="h-5 bg-background-secondary rounded w-3/5"></div>
                        <div className="h-3 bg-background-secondary rounded w-1/4 mt-1"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-background-secondary rounded w-full"></div>
                        <div className="h-4 bg-background-secondary rounded w-4/5"></div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasSuggestions && !submitting && (
            <div className="mt-10 pt-10 border-t border-border-primary">
              <p className="text-sm font-semibold uppercase tracking-wider text-text-tertiary mb-5">
                {suggestions!.length} relevant {suggestions!.length === 1 ? 'pattern' : 'patterns'}
              </p>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions!.map((s) => (
                  <li key={s.slug}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handlePatternClick(s.slug)}
                      className="block h-full px-5 py-5 rounded-xl border border-border-primary hover:border-accent-primary hover:bg-accent-subtle/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-accent-primary leading-tight">
                          {s.title}
                        </h4>
                        <span className="text-sm text-text-tertiary whitespace-nowrap mt-1 flex-shrink-0">{s.category}</span>
                      </div>
                      <p className="text-base text-text-secondary leading-relaxed">{s.why}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function FullPageResults({ results, onNewAudit, isAnalyzing, isDemoMode, screenshotUrl, screenshotDeviceType, screenshots, onStartRealAudit, auditsRemaining, isPaywalled, auditCount, isUnlocked }: FullPageResultsProps) {
  // Normalize: prefer the multi-screenshot prop, fall back to the single-screenshot props for backwards compat.
  const allScreenshots = screenshots && screenshots.length > 0
    ? screenshots
    : (screenshotUrl ? [{ url: screenshotUrl, deviceType: screenshotDeviceType || 'desktop' }] : []);
  const [activeScreenshotIndex, setActiveScreenshotIndex] = useState(0);
  const activeScreenshot = allScreenshots[activeScreenshotIndex];
  const heroScreenshotUrl = activeScreenshot?.url ?? screenshotUrl;
  const heroDeviceType = activeScreenshot?.deviceType ?? screenshotDeviceType;
  const showDemoCTA = isDemoMode && !!onStartRealAudit;
  // Analysis loading state
  const [messageIndex, setMessageIndex] = useState(0);
  const [scanIndex, setScanIndex] = useState(0);

  // Tab + Chat state
  // Tab state controls the chat aside on desktop and the mobile section
  // selector (Gaps / Audit details / Chat). On desktop, 'issues' and 'details'
  // are visually equivalent — both let the details aside render beside the
  // screenshot. On mobile, they pick which block is visible below the screenshot.
  const [activeTab, setActiveTab] = useState<'issues' | 'details' | 'chat'>('issues');
  const [showAllQuickWins, setShowAllQuickWins] = useState(false);
  const [handoffCopied, setHandoffCopied] = useState(false);
  const [showHandoffSource, setShowHandoffSource] = useState(false);
  const [hasSentOpener, setHasSentOpener] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Well-implemented collapsed state
  const [showWellImplemented, setShowWellImplemented] = useState(false);

  // Pin → side panel (demo mode)
  const [openPin, setOpenPin] = useState<number | null>(null);
  const [hoveredPin, setHoveredPin] = useState<number | null>(null);

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

  // Scroll chat panel to bottom on new messages — scope to the chat container
  // (never use scrollIntoView here: it scrolls every ancestor including window).
  useEffect(() => {
    const el = chatScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
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

  // Shared handoff-copy handler — used by both the inline IDE card and the
  // mobile sticky bottom bar. Defined here (before any conditional return) so
  // the hook order stays stable; it derives its inputs from `results` and
  // no-ops when results aren't ready yet. (Moving this below the `if (!results)
  // return null` guard caused React error #310 — a hooks-count mismatch.)
  const handleCopyHandoff = useCallback(async () => {
    if (!results) return;
    const gaps = (results.topGaps || []).filter(
      (g) => g.status === 'missing' || g.status === 'needs-improvement'
    );
    if (gaps.length === 0) return;
    const handoffPrompt = composeHandoffPrompt({
      surfaceDescription: (results as ExtendedResults | null)?.surfaceDescription,
      productType: results.productContext?.productType,
      gaps,
    });
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(handoffPrompt);
      } else {
        const ta = document.createElement('textarea');
        ta.value = handoffPrompt;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      trackAuditEvent('audit_handoff_copied', { gapCount: gaps.length });
      setHandoffCopied(true);
      setTimeout(() => setHandoffCopied(false), 2000);
    } catch {
      /* swallow — clipboard can fail in private browsing; user can still copy from disclosure */
    }
  }, [results]);

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

  // ----- Demo view: full-bleed dashboard mockup with clickable pins + side panel -----
  if (showDemoCTA) {
    const openGap = openPin ? topGaps[openPin - 1] : null;
    const openPinMeta = openPin ? DEMO_PINS.find(p => p.index === openPin) : null;

    return (
      <div className="relative">
        {/* Hero zone — atmospheric mesh + corner reticles (editorial
            precision aesthetic, see globals.css `.bg-hero-mesh`). The
            laptop mockup lives INSIDE this section so the gradient
            extends behind it fully; SocialProof's white bg starts
            directly below. */}
        <section className="relative bg-hero-mesh bg-grain pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
          {/* Calibration-frame reticles — anchor the hero like a measuring
              instrument. Hidden on mobile to avoid edge clipping. */}
          <span aria-hidden className="hero-reticle hidden md:block top-6 left-6" />
          <span aria-hidden className="hero-reticle hidden md:block top-6 right-6" />
          <span aria-hidden className="hero-reticle hidden md:block bottom-6 left-6" />
          <span aria-hidden className="hero-reticle hidden md:block bottom-6 right-6" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent-primary mb-5 before:content-[''] before:w-8 before:h-px before:bg-accent-primary/40 after:content-[''] after:w-8 after:h-px after:bg-accent-primary/40">
                Stop shipping AI slop
              </p>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 sm:mb-6"
                style={{ color: 'var(--text-hero)' }}
              >
                Free AI UX Audit Tool
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-text-secondary mb-8 sm:mb-10">
                Score AI interfaces against 36 proven patterns and get specific fixes you can ship today.
              </p>

              {/* CTA — moved into the hero text zone so the email form sits
                  above the dashboard rather than below it. Paywalled state
                  swaps in the inline waitlist capture. */}
              <div className="flex flex-col items-center gap-3 max-w-xl mx-auto">
                {isPaywalled ? (
                  <PaywallInlineCapture auditCountAtTrigger={auditCount} />
                ) : (
                  <DemoStartForm
                    onStart={() => {
                      trackAuditEvent('audit_demo_start_real_clicked');
                      onStartRealAudit!();
                    }}
                    auditsRemaining={auditsRemaining}
                    isUnlocked={isUnlocked}
                  />
                )}
              </div>
            </div>

            <div className="mt-10 sm:mt-12">
              <p className="text-[9px] font-bold text-text-secondary uppercase tracking-tight mb-4 text-center">
                Patterns observed in products from
              </p>
              <div className="overflow-hidden">
                <CompanyLogoCarousel
                  companies={companyLogos}
                  size="sm"
                  duration={80}
                  gap="lg"
                  className="py-2"
                />
              </div>
            </div>

            {/* Multi-device composition — laptop + glass phone laid out
                side-by-side at center, vertically aligned. Hidden below md
                because the desktop dashboard mockup can't reflow into a
                phone-width viewport; mobile users see the gap list below
                instead, which carries the same audit context. */}
            <div className="relative mt-12 sm:mt-16 md:mt-20">
              <div className="hidden md:flex items-center justify-center gap-6 lg:gap-10">
                <div className="flex-1 max-w-3xl lg:max-w-4xl min-w-0">
                  <LaptopFrame>
                    <DemoProductMockup
                      activePin={openPin ?? hoveredPin}
                      onPinClick={(idx) => {
                        setOpenPin(idx);
                        trackAuditEvent('audit_step_completed', { step: 'demo_pin_clicked', pinIndex: idx });
                      }}
                      onPinHover={setHoveredPin}
                    />
                  </LaptopFrame>
                </div>

                <div className="hidden md:block flex-shrink-0">
                  <PhoneFrame>
                    <DemoChatMockup
                      activePin={openPin ?? hoveredPin}
                      onPinClick={(idx) => {
                        setOpenPin(idx);
                        trackAuditEvent('audit_step_completed', { step: 'demo_pin_clicked', pinIndex: idx });
                      }}
                      onPinHover={setHoveredPin}
                    />
                  </PhoneFrame>
                </div>
              </div>

              {/* Mobile-only prototype — same DemoProductMockup as desktop but
                  rendered in its responsive stacked layout with mobile pin
                  positions. Each pin opens the same bottom-sheet flow. */}
              <div className="md:hidden">
                <div className="text-center mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary mb-2">
                    Example audit
                  </p>
                  <p className="text-base text-text-secondary leading-relaxed max-w-xs mx-auto">
                    Tap a numbered pin to see the fix.
                  </p>
                </div>
                <div className="rounded-2xl border border-border-primary overflow-hidden shadow-md">
                  <DemoProductMockup
                    activePin={openPin ?? hoveredPin}
                    onPinClick={(idx) => {
                      setOpenPin(idx);
                      trackAuditEvent('audit_step_completed', { step: 'demo_pin_clicked', pinIndex: idx });
                    }}
                    onPinHover={setHoveredPin}
                  />
                </div>
              </div>

              {/* Slide-in side panel */}
              {openGap && openPinMeta && openPin !== null && (
                <GapSidePanel gap={openGap} pinNumber={openPin} onClose={() => setOpenPin(null)} />
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ----- Real audit view -----
  // Mirrors the demo layout: user's screenshot full-width with numbered pins,
  // each pin opens a side panel with the matching pattern's GapCard.
  const topPinnedIssues = issues.slice(0, REAL_PIN_POSITIONS.length);
  // Pin assignment: prefer the AI-returned `screenshotIndex` (1-based) on each gap.
  // Fall back to round-robin across screens for older results that don't carry it.
  const screenshotCount = Math.max(1, allScreenshots.length);
  const pinAssignments = topPinnedIssues.map((g, i) => {
    const aiIdx = (g as TopGap & { screenshotIndex?: number }).screenshotIndex;
    if (typeof aiIdx === 'number' && aiIdx >= 1 && aiIdx <= screenshotCount) {
      return aiIdx - 1;
    }
    return i % screenshotCount;
  });
  const pinsForActiveScreenshot = topPinnedIssues
    .map((_, i) => ({ index: i + 1, ...REAL_PIN_POSITIONS[i], screenshotIdx: pinAssignments[i] }))
    .filter((p) => p.screenshotIdx === activeScreenshotIndex);
  const realOpenGap = openPin ? topPinnedIssues[openPin - 1] : null;

  const surfaceDescription = (results as ExtendedResults | null)?.surfaceDescription;
  const noFindings = topPinnedIssues.length === 0;

  // Empty-state branch: when a real (non-demo) run surfaces zero actionable
  // findings, replace the normal results layout with an honest "this isn't an
  // AI surface — try again" card. Users who hit this don't have their free
  // audit credit decremented (gated in AuditClient.runAnalysis). Demo mode
  // keeps the showcase layout regardless so it can render its scripted pins.
  if (noFindings && !showDemoCTA) {
    return (
      <EmptyAuditState
        surfaceDescription={surfaceDescription}
        screenshotUrl={heroScreenshotUrl}
        productType={results?.productContext?.productType}
        onTryAgain={onNewAudit}
      />
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-24 lg:pb-8">

        {/* Screenshot canvas + optional chat side panel.
            Both columns have explicit fixed heights on desktop so the row size never changes
            when chat opens/closes — chat content scrolls inside its own bounds. */}
        <div className="flex flex-col lg:flex-row lg:justify-center gap-4 lg:gap-6">

        {/* Pinned screenshot column — wraps the canvas + carousel thumbnail strip */}
        <div className={`flex-shrink-0 flex flex-col gap-3 w-full mx-auto ${
          heroDeviceType === 'mobile' ? 'max-w-[400px] lg:w-[400px]' : 'max-w-[880px] lg:w-[880px]'
        }`}>
        <div
          className={`relative w-full ${
            heroDeviceType === 'mobile' ? 'aspect-[9/16]' : 'aspect-[4/3]'
          }`}
        >
          {heroScreenshotUrl && (
            <div className="absolute inset-0 rounded-2xl border border-border-primary overflow-hidden bg-background-secondary shadow-sm">
              <img
                src={heroScreenshotUrl}
                alt={`Your audited interface ${activeScreenshotIndex + 1}`}
                className="w-full h-full object-contain block lg:blur-[2px]"
              />
              {/* Subtle wash so the numbered pins read clearly over the blurred shot.
                  Desktop only — mobile shows the screenshot clearly since pins move to a list below. */}
              <div className="hidden lg:block absolute inset-0 bg-white/30 dark:bg-black/30 pointer-events-none" />
            </div>
          )}

          {/* Carousel arrows + counter — when more than one screenshot */}
          {allScreenshots.length > 1 && (
            <>
              <button
                {...withFocusSuppress(() => {
                  setActiveScreenshotIndex((i) => (i - 1 + allScreenshots.length) % allScreenshots.length);
                  setOpenPin(null);
                })}
                aria-label="Previous screenshot"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                {...withFocusSuppress(() => {
                  setActiveScreenshotIndex((i) => (i + 1) % allScreenshots.length);
                  setOpenPin(null);
                })}
                aria-label="Next screenshot"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black/60 text-white text-xs rounded-full z-10">
                Screenshot {activeScreenshotIndex + 1} / {allScreenshots.length}
              </div>
            </>
          )}

          {/* Numbered pins — only the ones assigned to the active screenshot */}
          {pinsForActiveScreenshot.map((pin) => {
            const isActive = openPin === pin.index || hoveredPin === pin.index;
            return (
              <button
                key={pin.index}
                {...withFocusSuppress(() => setOpenPin(pin.index))}
                onMouseEnter={() => setHoveredPin(pin.index)}
                onMouseLeave={() => setHoveredPin(null)}
                aria-label={`Issue ${pin.index}: ${topPinnedIssues[pin.index - 1].pattern}`}
                className="hidden lg:block absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${pin.xPct}%`, top: `${pin.yPct}%` }}
              >
                <span
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 transition-all ${
                    isActive
                      ? 'bg-accent-primary text-white dark:text-gray-900 border-white scale-125 shadow-lg'
                      : 'bg-white text-accent-primary border-accent-primary shadow-md group-hover:scale-110'
                  }`}
                >
                  {pin.index}
                  <span
                    className={`absolute inset-0 rounded-full border-2 border-accent-primary ${isActive ? '' : 'animate-ping opacity-60'}`}
                    aria-hidden
                  />
                </span>
              </button>
            );
          })}

          {/* Slide-in side panel */}
          {realOpenGap && openPin !== null && (
            <GapSidePanel gap={realOpenGap} pinNumber={openPin} onClose={() => setOpenPin(null)} />
          )}
        </div>

        {/* Carousel thumbnail nav — only when more than one screenshot */}
        {allScreenshots.length > 1 && (
          <div className="flex flex-wrap gap-2 items-center justify-center">
            {allScreenshots.map((shot, index) => {
              const isActive = index === activeScreenshotIndex;
              const pinCount = pinAssignments.filter((a) => a === index).length;
              return (
                <button
                  key={index}
                  {...withFocusSuppress(() => {
                    setActiveScreenshotIndex(index);
                    setOpenPin(null);
                  })}
                  aria-label={`Show screenshot ${index + 1}`}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-accent-primary shadow-md scale-105'
                      : 'border-border-primary opacity-70 hover:opacity-100 hover:border-accent-primary/50'
                  }`}
                >
                  <img src={shot.url} alt="" className="w-full h-full object-cover block" />
                  {pinCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-accent-primary text-white dark:text-gray-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                      {pinCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Mobile-only section tabs — Gaps / Audit details / Chat. Lets the
            three blocks below the screenshot share one slot instead of stacking. */}
        {topPinnedIssues.length > 0 && (
          <div
            role="tablist"
            aria-label="Audit sections"
            className="lg:hidden mt-3 grid grid-cols-3 gap-1 p-1 rounded-full border border-border-primary bg-background-secondary"
          >
            {([
              { id: 'issues', label: `Gaps · ${topPinnedIssues.length}` },
              { id: 'details', label: 'Details' },
              { id: 'chat', label: 'Chat' },
            ] as const).map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveTab(t.id);
                    if (t.id === 'chat' && !hasSentOpener && issues.length > 0) {
                      setHasSentOpener(true);
                      const topPatterns = issues.slice(0, 3).map((g) => g.pattern).join(', ');
                      setTimeout(
                        () =>
                          sendMessage(
                            `I found ${issues.length} issues in my interface. The top priorities are: ${topPatterns}. What should I fix first and how?`,
                          ),
                        200,
                      );
                    }
                  }}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer min-h-[40px] ${
                    isActive
                      ? 'bg-background-primary text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Mobile-only gap list — replaces the on-canvas pin overlay on small screens.
            Each row opens the same bottom-sheet flow via setOpenPin. */}
        {topPinnedIssues.length > 0 && (
          <div className={`lg:hidden mt-2 rounded-2xl border border-border-primary bg-background-primary overflow-hidden ${activeTab === 'issues' ? '' : 'hidden'}`}>
            <div className="px-4 py-3 border-b border-border-primary bg-background-secondary">
              <p className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                {topPinnedIssues.length} gap{topPinnedIssues.length === 1 ? '' : 's'} found
              </p>
              <p className="text-xs text-text-tertiary mt-0.5">Tap a row for details</p>
            </div>
            <ul className="divide-y divide-border-primary">
              {topPinnedIssues.map((gap, i) => {
                const idx = i + 1;
                const severity = (gap as TopGap & { severity?: string }).severity;
                const severityChip =
                  severity === 'critical'
                    ? 'bg-status-error/10 text-status-error'
                    : severity === 'important'
                      ? 'bg-status-warning/10 text-status-warning'
                      : 'bg-background-secondary text-text-secondary';
                return (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => setOpenPin(idx)}
                      className="w-full flex items-start gap-3 px-4 py-3.5 text-left active:bg-background-secondary cursor-pointer min-h-[56px]"
                      aria-label={`Open details for gap ${idx}: ${gap.pattern}`}
                    >
                      <span className="flex-shrink-0 mt-0.5 flex items-center justify-center w-7 h-7 rounded-full bg-accent-primary text-white dark:text-gray-900 text-sm font-bold">
                        {idx}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-semibold text-text-primary">{gap.pattern}</span>
                          {severity && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${severityChip}`}>
                              {severity}
                            </span>
                          )}
                        </span>
                        {gap.finding && (
                          <span className="block mt-1 text-sm text-text-secondary line-clamp-2">{gap.finding}</span>
                        )}
                      </span>
                      <ChevronRightIcon className="flex-shrink-0 w-5 h-5 text-text-tertiary mt-1.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        </div>

        {/* What we audited + Quick Wins — sits beside the screenshot when chat isn't active */}
        {activeTab !== 'chat' && (surfaceDescription || quickWins.length > 0 || results.applicablePatterns?.length) && (
          <aside className={`w-full lg:w-[360px] lg:flex-shrink-0 rounded-2xl border border-border-primary bg-background-primary px-5 py-4 overflow-y-auto max-h-[640px] lg:max-h-none ${activeTab === 'details' ? '' : 'hidden lg:block'} ${
            heroDeviceType === 'mobile' ? 'lg:h-[711px]' : 'lg:h-[660px]'
          }`}>
            {(() => {
              const productLabel: Record<string, string> = {
                'chat-interface': 'Chat interface',
                'ai-agent': 'AI agent',
                'recommendation-system': 'Recommendations',
                'content-generation': 'Content generation',
                other: 'AI product',
              };
              const productType = results.productContext?.productType;
              const facts: Array<{ label: string; value: string }> = [];
              if (productType) facts.push({ label: 'Surface', value: productLabel[productType] || productType });
              facts.push({ label: 'Device', value: heroDeviceType === 'mobile' ? 'Mobile' : 'Desktop' });
              if (allScreenshots.length > 0) facts.push({ label: 'Screenshots', value: String(allScreenshots.length) });
              if (results.applicablePatterns?.length) facts.push({ label: 'Applicable patterns', value: `${results.applicablePatterns.length} of 36` });
              if (issues.length > 0) facts.push({ label: 'Gaps found', value: String(issues.length) });
              return (
                <div className={(surfaceDescription || quickWins.length > 0) ? 'pb-4 mb-4 border-b border-border-primary' : ''}>
                  <p className="text-sm font-semibold uppercase tracking-wider text-text-tertiary mb-3">What we audited</p>
                  <dl className="rounded-lg border border-border-primary bg-background-secondary divide-y divide-border-primary mb-3">
                    {facts.map((f) => (
                      <div key={f.label} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                        <dt className="text-sm text-text-secondary">{f.label}</dt>
                        <dd className="text-base font-semibold text-text-primary text-right truncate">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                  {surfaceDescription && (
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-4">{surfaceDescription}</p>
                  )}
                </div>
              );
            })()}
            {quickWins.length > 0 && (() => {
              const QUICK_WINS_CAP = 4;
              const visibleWins = showAllQuickWins ? quickWins : quickWins.slice(0, QUICK_WINS_CAP);
              const hiddenCount = quickWins.length - QUICK_WINS_CAP;
              return (
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-text-tertiary mb-3 flex items-center gap-1.5">
                    <LightBulbIcon className="w-4 h-4 text-amber-500" />
                    Quick Wins
                  </p>
                  <ul className="space-y-3">
                    {visibleWins.map((win, i) => (
                      <li key={i} className="flex gap-2.5 text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xs font-semibold">
                          {i + 1}
                        </span>
                        <span className="text-text-secondary leading-relaxed line-clamp-3">{win}</span>
                      </li>
                    ))}
                  </ul>
                  {hiddenCount > 0 && (
                    <button
                      onClick={() => setShowAllQuickWins((v) => !v)}
                      className="mt-3 text-sm font-medium text-accent-primary hover:text-accent-hover cursor-pointer"
                    >
                      {showAllQuickWins ? 'Show fewer' : `+ ${hiddenCount} more`}
                    </button>
                  )}
                </div>
              );
            })()}
          </aside>
        )}

        {/* In-flow chat side panel — sits next to the screenshot */}
        {activeTab === 'chat' && (
          <aside className={`w-full lg:w-[360px] lg:flex-shrink-0 rounded-2xl border border-border-primary bg-background-primary shadow-sm flex flex-col overflow-hidden min-h-0 ${
            heroDeviceType === 'mobile' ? 'lg:h-[711px]' : 'lg:h-[660px]'
          }`}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-primary">
              <div className="flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-accent-primary" />
                <p className="font-semibold text-text-primary">Chat with results</p>
              </div>
              <button
                onClick={() => setActiveTab('issues')}
                aria-label="Close"
                className="p-1.5 rounded-md hover:bg-background-secondary cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5 text-text-tertiary" />
              </button>
            </div>
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
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
            </div>
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
          </aside>
        )}

        </div>
        {/* /flex-row screenshot+chat wrapper */}

        {/* Consolidated handoff — one prompt the user pastes into Claude Code / Cursor */}
        {issues.length > 0 && (() => {
          const handoffPrompt = composeHandoffPrompt({
            surfaceDescription,
            productType: results.productContext?.productType,
            gaps: issues,
          });
          return (
            <section className="mt-8" id="handoff-card">
              <div className="rounded-2xl border border-border-primary bg-background-primary p-6 sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-wider text-accent-primary mb-2">Apply with Claude Code</p>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary mb-2">Take this to your IDE</h2>
                <p className="text-base text-text-secondary leading-relaxed mb-5">
                  Paste this into Claude Code or Cursor. It will find the affected surfaces in your repo, apply each of the {issues.length} pattern{issues.length === 1 ? '' : 's'} in the right files, and report back what changed.
                </p>
                <button
                  onClick={handleCopyHandoff}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-primary text-white dark:text-gray-900 font-semibold text-base hover:bg-accent-hover transition-colors active:scale-95 cursor-pointer"
                >
                  {handoffCopied ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <CommandLineIcon className="w-5 h-5" />
                      Copy handoff prompt
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowHandoffSource((v) => !v)}
                  aria-expanded={showHandoffSource}
                  className="ml-3 sm:ml-4 inline-flex items-center gap-1.5 text-base font-medium text-text-secondary hover:text-text-primary cursor-pointer"
                >
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${showHandoffSource ? 'rotate-180' : ''}`} />
                  {showHandoffSource ? 'Hide' : 'Inspect'}
                </button>
                {showHandoffSource && (
                  <div className="mt-3 rounded-lg border border-border-primary bg-background-secondary p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm font-mono whitespace-pre-wrap text-text-secondary leading-relaxed">{handoffPrompt}</pre>
                  </div>
                )}
                <div className="mt-6 pt-5 border-t border-border-primary">
                  <p className="text-base text-text-primary font-semibold mb-1">
                    Audit every time you ship.
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Catch AI slop before your users do. Re-run after each change to keep your interface honest.
                  </p>
                </div>
              </div>
            </section>
          );
        })()}

        {/* CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
          <button
            onClick={() => setShowEmailModal(true)}
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-full border border-border-primary bg-background-primary text-text-primary text-sm font-medium hover:bg-background-secondary transition-colors cursor-pointer"
          >
            Email Report
          </button>
          <button
            onClick={() => {
              const next: 'issues' | 'chat' = activeTab === 'chat' ? 'issues' : 'chat';
              setActiveTab(next);
              if (next === 'chat' && !hasSentOpener && issues.length > 0) {
                setHasSentOpener(true);
                const topPatterns = issues.slice(0, 3).map(g => g.pattern).join(', ');
                setTimeout(() => sendMessage(
                  `I found ${issues.length} issues in my interface. The top priorities are: ${topPatterns}. What should I fix first and how?`
                ), 200);
              }
            }}
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-full border border-border-primary bg-background-primary text-text-primary text-sm font-medium hover:bg-background-secondary transition-colors cursor-pointer"
          >
            {activeTab === 'chat' ? 'Hide chat' : 'Chat with results'}
          </button>
          <button
            onClick={onNewAudit}
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-full bg-accent-primary text-white dark:text-gray-900 text-sm font-semibold hover:bg-accent-hover transition-colors cursor-pointer"
          >
            Run Another Audit
          </button>
        </div>

      </div>

      {/* Mobile sticky handoff CTA — keeps the load-bearing action thumb-reachable
          while the user scrolls the results. Hidden when the gap sheet or chat
          tab is active so it doesn't compete with whichever surface the user
          is interacting with. */}
      {issues.length > 0 && openPin === null && activeTab !== 'chat' && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-background-primary via-background-primary to-background-primary/0">
          <button
            type="button"
            onClick={handleCopyHandoff}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-accent-primary text-white dark:text-gray-900 font-semibold text-base shadow-lg active:scale-95 transition-transform cursor-pointer min-h-[48px]"
          >
            {handoffCopied ? (
              <>
                <CheckCircleIcon className="w-5 h-5" />
                Copied — paste into Claude Code
              </>
            ) : (
              <>
                <CommandLineIcon className="w-5 h-5" />
                Copy handoff prompt
              </>
            )}
          </button>
        </div>
      )}

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

/**
 * Single-CTA hero — one primary "Audit your design — free" button. The
 * email-form-in-hero variant converted at 1.9% over the May 8-13 window
 * (8 submits / 417 real sessions) while audit starts ran at 1.2%; pairing
 * them in one component split attention so neither won. Email capture now
 * lives post-audit (SaveResultsCard) and in the dedicated newsletter section
 * further down the page.
 */
function DemoStartForm({
  onStart,
  auditsRemaining,
  isUnlocked,
}: {
  onStart: () => void;
  auditsRemaining?: number;
  isUnlocked?: boolean;
}) {
  let pillCopy: string | null = null;
  if (typeof auditsRemaining === 'number' && auditsRemaining > 0) {
    pillCopy = isUnlocked
      ? `${auditsRemaining} free audit${auditsRemaining === 1 ? '' : 's'} remaining`
      : '1 free audit · 3 more after email';
  }

  return (
    <div className="w-full flex flex-col items-center">
      <button
        type="button"
        onClick={onStart}
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-accent-primary text-white dark:text-gray-900 text-base font-semibold hover:bg-accent-hover transition-colors active:scale-[0.98] cursor-pointer whitespace-nowrap"
      >
        Audit your design
        <span aria-hidden>→</span>
      </button>

      {pillCopy && (
        <p className="text-sm text-text-tertiary text-center mt-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
            {pillCopy}
          </span>
        </p>
      )}
    </div>
  );
}
