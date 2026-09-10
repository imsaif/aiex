'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ArrowPathIcon,
  LightBulbIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { resolvePatternSlug } from '@/lib/audit/pattern-link';
import { relatedGuidesFor } from '@/lib/audit/relatedGuides';
import { productTypeLabel } from '@/lib/audit/handoff';

/**
 * Whether the results page carries the "Ask about your audit" conversation.
 *
 * Off: the page's job is to hand over skills, and the chat competed with the
 * save action for the same attention. Flip to true to restore it; the endpoint,
 * the state, and the markup are all still here.
 */
const SHOW_RESULTS_CHAT = false;
import type { SavedAudit } from '@/hooks/useSavedAudits';
import type { AnalysisResults, TopGap, ProductContext } from '@/types/audit';
import { GapCard } from './GapCard';
import { DemoProductMockup, DEMO_PINS } from './DemoProductMockup';
import { LaptopFrame } from './LaptopFrame';
import { PhoneFrame } from './PhoneFrame';
import { DemoChatMockup } from './DemoChatMockup';
import { trackAuditEvent } from '@/lib/audit/analytics';
import { CHAT_SUGGESTIONS } from './shared';
import { PaywallInlineCapture } from './PaywallInlineCapture';
import CompanyLogoCarousel from '@/components/ui/CompanyLogoCarousel';
import { companyLogos } from '@/data/company-logos';
import { PATTERN_COUNT } from '@/data/pattern-count';
import { ClaudeMark } from '@/components/icons/ClaudeMark';

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
        className="fixed lg:absolute inset-0 bg-black/50 lg:bg-black/30 z-modal lg:z-sticky cursor-pointer animate-fade-in"
      />
      {/* Sheet: fixed bottom sheet on mobile, right-anchored side panel on desktop. */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Pattern detected: ${gap.pattern}`}
        className="fixed lg:absolute inset-x-0 bottom-0 lg:inset-x-auto lg:top-0 lg:right-0 lg:bottom-0 w-full lg:w-[420px] max-h-[85vh] lg:max-h-none z-toast lg:z-overlay bg-background-primary border-t lg:border-t-0 lg:border-l border-border-primary shadow-xl overflow-y-auto overscroll-contain rounded-t-2xl lg:rounded-none animate-slide-up lg:animate-slide-in"
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
                <div className="mt-4 px-4 py-3 rounded-xl bg-surface-error border border-border-error-subtle text-base text-text-error">
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



  // Skill-pack download state.
  const [packBuilding, setPackBuilding] = useState(false);
  const [packError, setPackError] = useState<string | null>(null);
  const [packDone, setPackDone] = useState(false);

  // The gaps that map to a real pattern, and so have a skill to save. A gap the
  // model named but the catalogue does not carry is shown but not savable —
  // better than offering a save that would silently do nothing.
  const savableSlugs = useMemo(() => {
    const gaps = (results?.topGaps || []).filter(
      (g) => g.status === 'missing' || g.status === 'needs-improvement'
    );
    const slugs: string[] = [];
    for (const gap of gaps) {
      const slug = resolvePatternSlug(gap.pattern, gap.resource);
      if (slug && !slugs.includes(slug)) slugs.push(slug);
    }
    return slugs;
  }, [results]);

  /**
   * The pack is every skill this audit matched.
   *
   * There was briefly a per-card control to narrow it, which had to go: the
   * pack already contained all of them, so a button reading "Save this skill"
   * could only ever *remove* one. Curating three items is also a decision
   * nobody asked for; anyone wanting fewer can delete a file after unzipping.
   */
  const packCount = savableSlugs.length;

  const relatedGuides = useMemo(
    () => relatedGuidesFor(results?.productContext?.productType),
    [results],
  );

  // Chat state — inline conversation below the findings
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Email modal state

  // Optional "see it on your screenshot" disclosure
  const [showScreenshot, setShowScreenshot] = useState(false);

  // Pin → side panel (demo mode)
  const [openPin, setOpenPin] = useState<number | null>(null);
  const [hoveredPin, setHoveredPin] = useState<number | null>(null);

  // The rotating status messages, the pattern-scan checklist and the elapsed
  // timer that paced the progress bar all belonged to the old analysing screen.
  // The skeleton replaced them: the audit is one request with no intermediate
  // events, so there was no real progress for any of them to report.

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


  // Save every skill this audit matched, in one action. Individual cards can
  // still be toggled; this is the shortcut for "all of them", which is the
  // common case when someone has just seen their own gaps.
  //
  // Saving the skills also saves the audit itself. The pack builder emits a
  // fixes file alongside the skills whenever a saved audit is present, so this
  // is how the one-shot fixes for this product reach the download now that the
  // results page no longer offers its own copy-to-clipboard prompt. The two
  // stores stay separate (skills are slugs, audits are text snapshots) but
  // there is no longer a reason to make someone save them in two steps.
  // The audit as a storable snapshot. Used both for saving to the dashboard and
  // for the fixes file inside a directly-downloaded pack, so the two paths ship
  // identical content.
  const auditSnapshot = useMemo<SavedAudit | null>(() => {
    if (!results) return null;
    return {
      id: results.id,
      savedAt: Date.now(),
      productType: results.productContext?.productType,
      productLabel: productTypeLabel(results.productContext?.productType),
      surfaceDescription: (results as ExtendedResults | null)?.surfaceDescription || '',
      score: typeof results.score === 'number' ? results.score : null,
      maxScore: typeof results.maxScore === 'number' ? results.maxScore : null,
      applicablePatternsCount: results.applicablePatterns?.length ?? 0,
      gaps: (results.topGaps || []).filter(
        (g) => g.status === 'missing' || g.status === 'needs-improvement'
      ),
      quickWins: results.quickWins || [],
    };
  }, [results]);

  // Download the pack for this audit directly. Nothing has to be saved first —
  // this is the "I just want it now" path, and the dashboard remains the place
  // to accumulate skills across audits.
  const handleDownloadPack = useCallback(async () => {
    if (!auditSnapshot || auditSnapshot.gaps.length === 0) return;
    setPackBuilding(true);
    setPackError(null);
    try {
      const { downloadAuditSkillPack } = await import('@/lib/skills/auditPack');
      const skillCount = await downloadAuditSkillPack(auditSnapshot.gaps, auditSnapshot);
      // Same event the dashboard fires, tagged with origin, so the "a pack left
      // the site" total stays whole across both surfaces.
      trackAuditEvent('skill_pack_downloaded', {
        source: 'audit-results',
        format: 'zip',
        gapCount: auditSnapshot.gaps.length,
        skillCount,
      });
      setPackDone(true);
      setTimeout(() => setPackDone(false), 2500);
    } catch (err) {
      // Nothing was written, so say so rather than leaving a dead button.
      console.warn('Failed to build the skill pack:', err);
      setPackError('We could not build the pack just now. Try again in a moment.');
    } finally {
      setPackBuilding(false);
    }
  }, [auditSnapshot]);


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  // Analyzing state — a skeleton of the results page itself.
  //
  // The previous version ticked pattern names off a checklist while a progress
  // bar filled. Both were fiction: the audit is a single request that returns
  // everything at once, so there is no per-pattern progress to report. Showing
  // invented progress in a tool whose whole claim is honesty about your
  // interface was the wrong trade.
  //
  // This mirrors the real results layout instead, so the wait previews the
  // answer and the arrival is a fill-in rather than a page swap. One honest
  // status line, no bar, no countdown we cannot keep.
  if (isAnalyzing && !results) {
    const shimmer = 'animate-pulse bg-background-secondary rounded';
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header — real text, in the same geometry as the results header so
            nothing jumps when the findings land. */}
        <div className="lg:flex lg:gap-8 lg:justify-center mb-5 sm:mb-6">
          <div className="w-full lg:w-[768px] min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight leading-tight">
              Reading your interface
            </h1>
            <p
              className="text-xs sm:text-sm text-text-secondary leading-snug"
              role="status"
              aria-live="polite"
            >
              Checking it against {PATTERN_COUNT} patterns. This usually takes about 40 seconds.
            </p>
          </div>
          <div className="hidden lg:block w-[340px] flex-shrink-0" aria-hidden />
        </div>

        <div className="lg:flex lg:gap-8 lg:justify-center" aria-hidden>
          {/* LEFT — placeholder skill cards in the same shape as GapCard. */}
          <main className="w-full lg:w-[768px] min-w-0">
            <div className={`h-4 w-32 mb-4 ${shimmer}`} />
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border-primary bg-background-primary p-5"
                  // Stagger so the cards breathe out of phase; one synchronised
                  // pulse across the column reads as a single flashing block.
                  style={{ animationDelay: `${i * 160}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-6 w-6 rounded-full ${shimmer}`} />
                    <div className={`h-4 w-20 ${shimmer}`} />
                    <div className={`h-5 w-48 ${shimmer}`} />
                  </div>
                  <div className={`h-3 w-full mb-2 ${shimmer}`} />
                  <div className={`h-3 w-4/5 mb-4 ${shimmer}`} />
                  <div className="rounded-lg border border-border-primary bg-accent-subtle p-4">
                    <div className={`h-3 w-28 mb-2 ${shimmer}`} />
                    <div className={`h-3 w-3/4 ${shimmer}`} />
                  </div>
                  <div className={`h-10 w-40 mt-4 rounded-full ${shimmer}`} />
                </div>
              ))}
            </div>
          </main>

          {/* RIGHT — the rail, so the pack card does not appear from nowhere. */}
        <aside className="mt-8 lg:mt-9 lg:w-[340px] lg:flex-shrink-0">
            <div className="space-y-4">
              {[0, 1].map((i) => (
                <div key={i} className="rounded-2xl border border-border-primary bg-background-primary p-5">
                  <div className={`h-3 w-24 mb-3 ${shimmer}`} />
                  <div className={`h-3 w-full mb-2 ${shimmer}`} />
                  <div className={`h-3 w-2/3 mb-4 ${shimmer}`} />
                  <div className={`h-11 w-full rounded-full ${shimmer}`} />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  if (!results) return null;

  // Extract data
  const topGaps = results.topGaps || [];
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
                Turn Your Design Into Claude Skills
              </h1>
              {/* The headline says what you get; this says what to hand over.
                  The uploader takes images only, so "your design" without a
                  stated mechanic invites people to arrive with a Figma link. */}
              <p className="text-sm sm:text-base md:text-lg text-text-secondary mb-8 sm:mb-10">
                Free AI UX audit. Upload a screenshot and see which of {PATTERN_COUNT} proven patterns your
                interface is missing.
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
                      trackAuditEvent('audit_get_skills_clicked');
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
        {/* Sized up from text-lg/text-xs. This is the one place the page says
            what it is and what you now have; at the old size it read as a
            breadcrumb and got skipped. */}
        <div className="lg:flex lg:gap-8 lg:justify-center mb-6 sm:mb-8">
          <div className="w-full lg:w-[768px] min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-tight mb-1.5">
              Your audit results
            </h1>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              {isDemoMode
                ? 'Review the gaps below and learn what you are missing in the design.'
                : 'The patterns your design is missing, ready to download as Claude skills.'}
            </p>
          </div>
          <div className="hidden lg:block lg:w-[340px] lg:flex-shrink-0" aria-hidden />
        </div>

        <div className="lg:flex lg:gap-8 lg:items-start lg:justify-center">

        {/* LEFT — the skills this interface is missing */}
        <main className="w-full lg:w-[768px] min-w-0">

          {/* Each gap is a skill the user can save. Framed as skills rather
              than findings because the audit's output is now the pack, not
              the report. */}
          {/* No count label above the cards. The pack card already states how
              many skills there are, the cards are numbered, and the page
              subhead says what they are, so a third statement of the same fact
              was just another line to read. */}
          {topPinnedIssues.length > 0 && (
            <section>
              <div className="space-y-3">
                {topPinnedIssues.map((gap, i) => (
                  <GapCard key={i} gap={gap} index={i + 1} />
                ))}
              </div>
            </section>
          )}

          {/* Guides matched to the surface that was audited.
              Lives under the findings rather than in the rail: at 340px it read
              as one more sidebar item, and the point is to send people into the
              courses. Full column width, after they have seen what is missing,
              is where that lands.

              This replaced the done-for-you services pitch, which was not being
              clicked. A chat interface gets the conversational UI guide;
              everyone gets the skills guide, because every audit now ends with a
              pack that has to be installed. Where no guide genuinely covers the
              surface only the skills one shows: padding this with a
              loosely-related guide would teach people to skip the block. */}
          {!isDemoMode && relatedGuides.length > 0 && (
            <section className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-text-tertiary mb-4">
                Learn
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    onClick={() =>
                      trackAuditEvent('audit_guide_clicked', {
                        slug: guide.slug,
                        productType: results.productContext?.productType ?? null,
                      })
                    }
                    className="group block rounded-xl border border-border-primary bg-background-primary p-5 hover:border-accent-primary/40 hover:bg-background-secondary transition-colors"
                  >
                    <span className="block text-base font-semibold text-text-primary group-hover:text-accent-primary transition-colors mb-1">
                      {guide.title}
                    </span>
                    <span className="block text-sm text-text-secondary leading-relaxed">{guide.reason}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Conversation — messages flow in the column; the input floats at
              the bottom of the viewport (sticky on desktop).

              Off since the results page became a skills handover: the page's
              one job is now "save the skills you want", and a chat box beside
              that competes for the same attention. Kept behind the flag rather
              than deleted because /api/audit/chat and the chat state below are
              still wired and working, so turning it back on is one line. */}
          {SHOW_RESULTS_CHAT && (
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
          )}

        </main>

        {/* RIGHT — artifacts: fix handoff, screenshot, save, email, audit facts */}
        {/* lg:mt-0 so the pack card's top edge lines up with the first skill
            card. lg:mt-9 dropped the whole rail below the column beside it,
            which read as a mistake rather than as spacing. The mobile mt-8
            stays: stacked, the rail needs air above it. */}
        <aside className="mt-8 lg:mt-0 lg:w-[340px] lg:flex-shrink-0">
          <div className="lg:sticky lg:top-6 space-y-4">

            {/* Your pack — the single takeaway, and the only place a count
                lives. Saving a card adds to it; the button downloads whatever is
                in it. Downloading needs no prior save: with nothing picked, the
                pack is everything this audit matched, which is what most people
                want and saves them clicking Save three times to get there.

                Hidden in demo mode: the sample audit describes a product the
                visitor does not own. */}
            {!isDemoMode && savableSlugs.length > 0 && (
              <div className="rounded-2xl border border-border-primary bg-background-primary p-5">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold uppercase tracking-wider text-accent-primary">Your pack</p>
                  <p className="text-sm font-semibold text-text-primary tabular-nums">
                    {packCount} skill{packCount === 1 ? '' : 's'}
                  </p>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  Every pattern this audit matched, plus the fixes for your screen.
                  Unzips into <code className="text-xs font-mono text-text-primary">.claude/skills/</code>.
                </p>
                <button
                  onClick={handleDownloadPack}
                  disabled={packBuilding}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-accent-primary text-white dark:text-gray-900 font-semibold text-sm hover:bg-accent-hover transition-colors active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {packDone ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      Downloaded
                    </>
                  ) : (
                    <>
                      <ArrowDownTrayIcon className="w-5 h-5" />
                      {packBuilding ? 'Building your pack…' : 'Download skill pack'}
                    </>
                  )}
                </button>
                {packError && (
                  <p role="alert" className="mt-2 text-xs text-text-secondary">{packError}</p>
                )}
              </div>
            )}


            {/* Run another audit — directly under the pack, because it is the
                only other thing anyone does from this page, and burying it under
                the reference blocks made people scroll to find it.

                Two neighbours are gone rather than restyled. "Email this report"
                went because the report is no longer the thing you leave with;
                the pack is, and it is already one click away. The done-for-you
                services card went because it was not being clicked. Note that
                removing it also removed the `service_cta_clicked` event, so
                there is no measurement behind that call any more: putting it
                back later means starting the evidence over. */}
            <button
              type="button"
              onClick={() => {
                trackAuditEvent('audit_new_audit_clicked');
                onNewAudit();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border-primary bg-background-primary text-text-primary text-sm font-medium hover:bg-background-secondary transition-colors cursor-pointer"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Run another audit
            </button>

            {/* What we audited. Open by default: it is the context for every finding above, not an optional extra */}
            {(surfaceDescription || results.applicablePatterns?.length) && (
              <details open className="rounded-2xl border border-border-primary bg-background-primary px-5 py-4">
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
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer z-dropdown"
                          >
                            <ChevronLeftIcon className="w-4 h-4" />
                          </button>
                          <button
                            {...withFocusSuppress(() => setActiveScreenshotIndex((i) => (i + 1) % allScreenshots.length))}
                            aria-label="Next screenshot"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer z-dropdown"
                          >
                            <ChevronRightIcon className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/60 text-white text-xs rounded-full z-dropdown">
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
                            className={`absolute z-dropdown -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border-2 transition-all bg-accent-primary text-white dark:text-gray-900 border-white dark:border-gray-900 ${
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



          </div>
        </aside>

        </div>

      </div>

      {/* Desktop floating chat input — fixed to the viewport bottom, aligned to
          the left findings column via a mirror of the two-column layout (a
          340px spacer reserves the rail). pointer-events pass through the empty
          gutters so only the input itself is interactive.

          Behind the same flag as the conversation it belongs to. It sits
          outside that section in the tree, so gating only the section would
          leave a floating input on the page with no conversation above it. */}
      {SHOW_RESULTS_CHAT && (
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
      )}

      {/* Mobile sticky CTA — the same single action as the rail, thumb-reachable.
          Hidden when a gap side-sheet is open so it doesn't compete with it. */}
      {!isDemoMode && savableSlugs.length > 0 && openPin === null && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-overlay px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-background-primary via-background-primary to-background-primary/0">
          <button
            type="button"
            onClick={handleDownloadPack}
            disabled={packBuilding}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-accent-primary text-white dark:text-gray-900 font-semibold text-base shadow-lg active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer min-h-[48px]"
          >
            {packDone ? (
              <>
                <CheckCircleIcon className="w-5 h-5" />
                Downloaded
              </>
            ) : (
              <>
                <ArrowDownTrayIcon className="w-5 h-5" />
                {packBuilding ? 'Building your pack…' : 'Download skill pack'}
              </>
            )}
          </button>
        </div>
      )}


    </div>
  );
}

/**
 * Single-CTA hero — one primary "Get your skills" button. Labelled by outcome
 * rather than process; "Claude" is dropped because the headline directly above
 * already carries it and three mentions in one viewport reads as a chant. The
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
        <ClaudeMark animated className="h-[18px] w-[18px] shrink-0" />
        Get your skills
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
