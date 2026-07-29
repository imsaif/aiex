'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
  CommandLineIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import { composeHandoffPrompt, productTypeLabel } from '@/lib/audit/handoff';
import SaveAuditButton from './SaveAuditButton';
import type { SavedAudit } from '@/hooks/useSavedAudits';
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
import { PATTERN_COUNT } from '@/data/pattern-count';

interface ExtendedResults extends AnalysisResults {
  topGaps?: TopGap[];
  quickWins?: string[];
  chatContext?: string;
  productContext?: ProductContext;
  productTypeSummary?: string;
  surfaceDescription?: string;
  applicablePatterns?: string[];
  generalObservations?: string[];
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
  generalObservations,
  onTryAgain,
}: {
  surfaceDescription?: string;
  screenshotUrl?: string;
  productType?: string;
  generalObservations?: string[];
  onTryAgain: () => void;
}) {
  const [intent, setIntent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<IntentSuggestion[] | null>(null);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const [statusIndex, setStatusIndex] = useState(0);

  const STATUS_MESSAGES = [
    'Reading your intent…',
    `Scanning ${PATTERN_COUNT} patterns in the library…`,
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
                We scanned for {PATTERN_COUNT} AI UX patterns
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
              {generalObservations && generalObservations.length > 0 && (
                <div className="px-5 py-5 rounded-xl bg-background-secondary border border-border-primary">
                  <p className="text-sm font-semibold uppercase tracking-wider text-text-tertiary mb-3">A few general UX notes</p>
                  <ul className="space-y-2.5">
                    {generalObservations.map((note, i) => (
                      <li key={i} className="flex gap-2.5 text-base text-text-secondary leading-relaxed">
                        <LightBulbIcon className="w-5 h-5 flex-shrink-0 text-text-tertiary mt-0.5" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
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
  const [analyzeElapsedMs, setAnalyzeElapsedMs] = useState(0);

  // Handoff copy state
  const [handoffCopied, setHandoffCopied] = useState(false);
  const [showHandoffSource, setShowHandoffSource] = useState(false);

  // Chat state — inline conversation below the findings
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Optional "see it on your screenshot" disclosure
  const [showScreenshot, setShowScreenshot] = useState(false);

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

  // Track elapsed analysis time so the progress bar can pace itself against the
  // REAL median (~40s, p90 ~58s) instead of the pattern checklist, which filled
  // to 100% in ~12s and then sat there — the classic "stuck at 100%, must be
  // frozen" perceived-hang that drives abandonment on a genuinely slow call.
  useEffect(() => {
    if (!isAnalyzing) { setAnalyzeElapsedMs(0); return; }
    const startedAt = Date.now();
    const interval = setInterval(() => setAnalyzeElapsedMs(Date.now() - startedAt), 250);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Bring the latest message into view. The conversation now flows in the page
  // (no inner scroll container) with a sticky input, so scrolling the window to
  // the end sentinel is the intended behaviour.
  useEffect(() => {
    if (messages.length === 0) return;
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
                // Asymptotic ease toward ~95% keyed to elapsed time (median run ~40s),
                // so the bar keeps visibly moving for the whole wait and never parks
                // at 100% before results land. Reaches ~60% at 20s, ~82% at 40s.
                style={{ width: `${Math.round(95 * (1 - Math.exp(-analyzeElapsedMs / 20000)))}%` }}
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
          <p className="text-sm text-white/40">This usually takes 30-45 seconds — we check every pattern properly</p>
        </div>
      </div>
    );
  }

  if (!results) return null;

  // Extract data
  const topGaps = results.topGaps || [];
  const quickWins = results.quickWins || [];
  const issues = topGaps.filter((g) => g.status === 'missing' || g.status === 'needs-improvement');

  // ----- Demo view: full-bleed dashboard mockup with clickable pins + side panel -----
  if (showDemoCTA) {
    const openGap = openPin ? topGaps[openPin - 1] : null;
    const openPinMeta = openPin ? DEMO_PINS.find(p => p.index === openPin) : null;

    return (
      <div className="relative">
        {/* Hero zone — transparent so the page background (solid + dot
            pattern from the parent section) shows through. The laptop mockup
            lives INSIDE this section; SocialProof's white bg starts directly
            below. */}
        <section className="relative pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
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
                Score AI interfaces against {PATTERN_COUNT} proven patterns and get specific fixes you can ship today.
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

  // Text-only snapshot for the "Save audit" action — exactly the inputs the
  // dashboard needs to recap the audit and re-compose the IDE handoff prompt.
  // The screenshot is deliberately omitted (localStorage cap, see useSavedAudits).
  const savedAudit: SavedAudit = {
    id: results.id,
    savedAt: Date.now(),
    productType: results.productContext?.productType,
    productLabel: productTypeLabel(results.productContext?.productType),
    surfaceDescription: surfaceDescription || '',
    score: typeof results.score === 'number' ? results.score : null,
    maxScore: typeof results.maxScore === 'number' ? results.maxScore : null,
    applicablePatternsCount: results.applicablePatterns?.length ?? 0,
    gaps: issues,
    quickWins,
  };

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
        generalObservations={(results as ExtendedResults | null)?.generalObservations}
        onTryAgain={onNewAudit}
      />
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-24 lg:pb-32">

        {/* Results header — wrapped in the same two-column geometry (768px slot
            + rail spacer) so the title/description line up with the gap cards.
            "New audit" now lives as the last action in the right rail. */}
        <div className="lg:flex lg:gap-8 lg:justify-center mb-5 sm:mb-6">
          <div className="w-full lg:w-[768px] min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight leading-tight">
              Your audit results
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary leading-snug">
              Review the gaps below and learn what you are missing in the design.
            </p>
          </div>
          <div className="hidden lg:block lg:w-[340px] lg:flex-shrink-0" aria-hidden />
        </div>

        <div className="lg:flex lg:gap-8 lg:items-start lg:justify-center">

        {/* LEFT — the findings, then a conversation about them */}
        <main className="w-full lg:w-[768px] min-w-0">

          {/* Findings — every gap as a card */}
          {topPinnedIssues.length > 0 && (
            <section>
              <p className="text-sm font-semibold uppercase tracking-wider text-text-tertiary mb-4">
                {topPinnedIssues.length} gap{topPinnedIssues.length === 1 ? '' : 's'} found
              </p>
              <div className="space-y-3">
                {topPinnedIssues.map((gap, i) => (
                  <GapCard key={i} gap={gap} index={i + 1} />
                ))}
              </div>
            </section>
          )}

          {/* Conversation — messages flow in the column; the input floats at
              the bottom of the viewport (sticky on desktop). */}
          <section className="mt-10">
            <div className="flex items-center gap-2 text-text-secondary mb-4">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-accent-primary" />
              <p className="text-sm font-semibold text-text-primary">Ask about your audit</p>
            </div>

            {messages.length > 0 && (
              <div className="space-y-4 mb-4">
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
                <div ref={chatScrollRef} />
              </div>
            )}

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
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
            )}

            {/* Mobile input (inline at the end of the conversation). Desktop uses
                the fixed floating bar rendered below the two-column layout. */}
            <div className="lg:hidden">
              <div className="flex gap-2 items-end rounded-2xl border-2 border-border-primary bg-background-primary shadow-card p-3">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your audit..."
                  rows={2}
                  className="flex-1 resize-none bg-transparent px-2 py-1.5 text-base text-text-primary placeholder:text-text-tertiary focus:outline-none min-h-[3.5rem]"
                />
                <button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  aria-label="Send"
                  className="flex-shrink-0 p-3 rounded-xl bg-accent-primary text-white dark:text-gray-900 disabled:opacity-40 hover:bg-accent-hover transition-colors cursor-pointer"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

        </main>

        {/* RIGHT — artifacts: fix handoff, screenshot, save, email, audit facts */}
        <aside className="mt-8 lg:mt-9 lg:w-[340px] lg:flex-shrink-0">
          <div className="lg:sticky lg:top-6 space-y-4">

            {/* Apply the fixes — copy the handoff prompt to Claude Code / Cursor */}
            {issues.length > 0 && (() => {
              const handoffPrompt = composeHandoffPrompt({
                surfaceDescription,
                productType: results.productContext?.productType,
                gaps: issues,
              });
              return (
                <div className="rounded-2xl border border-border-primary bg-background-primary p-5">
                  <p className="text-sm font-semibold uppercase tracking-wider text-accent-primary mb-1">Apply the fixes</p>
                  <p className="text-sm text-text-secondary leading-relaxed mb-3">
                    One prompt with all {issues.length} gap{issues.length === 1 ? '' : 's'} &mdash; paste into Claude Code or Cursor.
                  </p>
                  <button
                    onClick={handleCopyHandoff}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-accent-primary text-white dark:text-gray-900 font-semibold text-sm hover:bg-accent-hover transition-colors active:scale-95 cursor-pointer"
                  >
                    {handoffCopied ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <CommandLineIcon className="w-5 h-5" />
                        Copy fix for Claude Code
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowHandoffSource((v) => !v);
                      trackAuditEvent('audit_inspect_prompt_toggled', { opened: !showHandoffSource });
                    }}
                    aria-expanded={showHandoffSource}
                    className="mt-2 w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary cursor-pointer"
                  >
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${showHandoffSource ? 'rotate-180' : ''}`} />
                    {showHandoffSource ? 'Hide prompt' : 'Inspect prompt'}
                  </button>
                  {showHandoffSource && (
                    <div className="mt-3 rounded-lg border border-border-primary bg-background-secondary p-3 max-h-72 overflow-y-auto">
                      <pre className="text-xs font-mono whitespace-pre-wrap text-text-secondary leading-relaxed">{handoffPrompt}</pre>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Screenshot — collapsible artifact with non-interactive markers */}
            {heroScreenshotUrl && (
              <div className="rounded-2xl border border-border-primary bg-background-primary p-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowScreenshot((v) => !v);
                    if (!showScreenshot) trackAuditEvent('audit_screenshot_locations_opened');
                  }}
                  aria-expanded={showScreenshot}
                  className="w-full inline-flex items-center justify-between gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary cursor-pointer"
                >
                  <span>See where each gap is</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${showScreenshot ? 'rotate-180' : ''}`} />
                </button>
                {showScreenshot && (
                  <div className="mt-3 flex flex-col gap-3">
                    <div className={`relative w-full ${heroDeviceType === 'mobile' ? 'aspect-[9/16]' : 'aspect-video'}`}>
                      <div className="absolute inset-0 rounded-xl border border-border-primary overflow-hidden bg-background-secondary">
                        <img
                          src={heroScreenshotUrl}
                          alt={`Your audited interface ${activeScreenshotIndex + 1}`}
                          className="w-full h-full object-contain block"
                        />
                      </div>
                      {allScreenshots.length > 1 && (
                        <>
                          <button
                            {...withFocusSuppress(() => setActiveScreenshotIndex((i) => (i - 1 + allScreenshots.length) % allScreenshots.length))}
                            aria-label="Previous screenshot"
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer z-10"
                          >
                            <ChevronLeftIcon className="w-4 h-4" />
                          </button>
                          <button
                            {...withFocusSuppress(() => setActiveScreenshotIndex((i) => (i + 1) % allScreenshots.length))}
                            aria-label="Next screenshot"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer z-10"
                          >
                            <ChevronRightIcon className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/60 text-white text-xs rounded-full z-10">
                            {activeScreenshotIndex + 1} / {allScreenshots.length}
                          </div>
                        </>
                      )}
                      {pinsForActiveScreenshot.map((pin) => {
                        const isActive = openPin === pin.index || hoveredPin === pin.index;
                        return (
                          <span
                            key={pin.index}
                            aria-hidden
                            className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border-2 transition-all bg-accent-primary text-white dark:text-gray-900 border-white dark:border-gray-900 ${
                              isActive
                                ? 'scale-125 shadow-lg ring-2 ring-black/15 dark:ring-white/25'
                                : 'shadow-md ring-1 ring-black/10 dark:ring-white/20'
                            }`}
                            style={{ left: `${pin.xPct}%`, top: `${pin.yPct}%` }}
                          >
                            {pin.index}
                          </span>
                        );
                      })}
                    </div>
                    {allScreenshots.length > 1 && (
                      <div className="flex flex-wrap gap-2 items-center justify-center">
                        {allScreenshots.map((shot, index) => {
                          const isActive = index === activeScreenshotIndex;
                          const pinCount = pinAssignments.filter((a) => a === index).length;
                          return (
                            <button
                              key={index}
                              {...withFocusSuppress(() => setActiveScreenshotIndex(index))}
                              aria-label={`Show screenshot ${index + 1}`}
                              className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                isActive
                                  ? 'border-accent-primary shadow-md scale-105'
                                  : 'border-border-primary opacity-70 hover:opacity-100 hover:border-accent-primary/50'
                              }`}
                            >
                              <img src={shot.url} alt="" className="w-full h-full object-cover block" />
                              {pinCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-accent-primary text-white dark:text-gray-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                                  {pinCount}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Save / Email / New audit (the last CTA) */}
            <div className="flex flex-col gap-2">
              <SaveAuditButton
                audit={savedAudit}
                className="w-full px-5 py-3 rounded-full border border-border-primary bg-background-primary text-text-primary text-sm font-medium hover:bg-background-secondary cursor-pointer"
              />
              <button
                onClick={() => setShowEmailModal(true)}
                className="w-full inline-flex items-center justify-center px-5 py-3 rounded-full border border-border-primary bg-background-primary text-text-primary text-sm font-medium hover:bg-background-secondary transition-colors cursor-pointer"
              >
                Email Report
              </button>
              <button
                type="button"
                onClick={() => {
                  trackAuditEvent('audit_new_audit_clicked');
                  onNewAudit();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border-primary bg-background-primary text-text-primary text-sm font-medium hover:bg-background-secondary transition-colors cursor-pointer"
              >
                <ArrowPathIcon className="w-4 h-4" />
                New audit
              </button>
            </div>

            {/* Done-for-you upsell — non-blocking secondary offer */}
            <a
              href="/services?from=post-audit-cta"
              onClick={() => trackAuditEvent('service_cta_clicked', { source: 'results_rail' })}
              className="block rounded-2xl border border-border-primary bg-background-primary px-5 py-4 hover:bg-background-secondary transition-colors"
            >
              <span className="block text-sm font-semibold text-text-primary mb-0.5">Want us to audit your whole product?</span>
              <span className="block text-sm text-text-secondary">A senior, done-for-you AI-UX audit with a detailed report, prioritized recommendations, and a walkthrough with your team. <span className="text-accent-primary">Learn more →</span></span>
            </a>

            {/* What we audited — optional details */}
            {(surfaceDescription || results.applicablePatterns?.length) && (
              <details className="rounded-2xl border border-border-primary bg-background-primary px-5 py-4">
                <summary className="text-sm font-semibold uppercase tracking-wider text-text-tertiary cursor-pointer select-none">What we audited</summary>
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
                    <div className="mt-3">
                      <dl className="rounded-lg border border-border-primary bg-background-secondary divide-y divide-border-primary mb-3">
                        {facts.map((f) => (
                          <div key={f.label} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                            <dt className="text-sm text-text-secondary">{f.label}</dt>
                            <dd className="text-base font-semibold text-text-primary text-right truncate">{f.value}</dd>
                          </div>
                        ))}
                      </dl>
                      {surfaceDescription && (
                        <p className="text-sm text-text-secondary leading-relaxed">{surfaceDescription}</p>
                      )}
                    </div>
                  );
                })()}
              </details>
            )}

          </div>
        </aside>

        </div>

      </div>

      {/* Desktop floating chat input — fixed to the viewport bottom, aligned to
          the left findings column via a mirror of the two-column layout (a
          340px spacer reserves the rail). pointer-events pass through the empty
          gutters so only the input itself is interactive. */}
      <div className="hidden lg:block fixed inset-x-0 bottom-6 z-sticky pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-8 justify-center">
          <div className="w-full lg:w-[768px] min-w-0 pointer-events-auto">
            <div className="flex gap-2 items-end rounded-2xl border-2 border-border-primary bg-background-primary shadow-elevated p-3 lg:-mx-8">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your audit..."
                rows={2}
                className="flex-1 resize-none bg-transparent px-2 py-1.5 text-base text-text-primary placeholder:text-text-tertiary focus:outline-none min-h-[3.5rem]"
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send"
                className="flex-shrink-0 p-3 rounded-xl bg-accent-primary text-white dark:text-gray-900 disabled:opacity-40 hover:bg-accent-hover transition-colors cursor-pointer"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="w-[340px] flex-shrink-0" aria-hidden />
        </div>
      </div>

      {/* Mobile sticky handoff CTA — keeps the load-bearing action thumb-reachable
          while the user scrolls the results. Hidden when a gap side-sheet is
          open so it doesn't compete with that surface. */}
      {issues.length > 0 && openPin === null && (
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
  if (isUnlocked && typeof auditsRemaining === 'number' && auditsRemaining > 0) {
    pillCopy = `${auditsRemaining} free audit${auditsRemaining === 1 ? '' : 's'} remaining`;
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
