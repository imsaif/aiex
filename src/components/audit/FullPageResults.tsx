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
} from '@heroicons/react/24/outline';
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
  return (
    <>
      <button
        onClick={onClose}
        aria-label="Close panel"
        className="absolute inset-0 bg-black/30 z-20 cursor-pointer"
      />
      <aside className="absolute top-0 right-0 bottom-0 w-full sm:w-[420px] z-30 bg-background-primary border-l border-border-primary shadow-xl overflow-y-auto animate-slide-in">
        <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-border-primary bg-background-primary">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary text-white dark:text-gray-900 text-sm font-bold">
              {pinNumber}
            </span>
            <p className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Pattern detected</p>
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

export function FullPageResults({ results, onNewAudit, isAnalyzing, isDemoMode, screenshotUrl, screenshotDeviceType, screenshots, onStartRealAudit, auditsRemaining, isPaywalled, auditCount }: FullPageResultsProps) {
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
  const [activeTab, setActiveTab] = useState<'issues' | 'chat'>('issues');
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
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary mb-4 before:content-[''] before:w-6 before:h-px before:bg-accent-primary/40 after:content-[''] after:w-6 after:h-px after:bg-accent-primary/40">
                Free · No signup required
              </p>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-5"
                style={{ color: 'var(--text-hero)' }}
              >
                Free AI UX Audit Tool
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-text-secondary mb-8 sm:mb-10">
                Score AI interfaces against 36 patterns. Get next steps from Claude.
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
                  />
                )}
              </div>
            </div>

            <div className="mt-10 sm:mt-12">
              <p className="text-[9px] font-bold text-text-secondary uppercase tracking-tight mb-4 text-center">
                Patterns used by teams at
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
                side-by-side at center, vertically aligned. Phone hides
                below md so mobile users see just the laptop. */}
            <div className="relative mt-12 sm:mt-16 md:mt-20">
              <div className="flex items-center justify-center gap-6 lg:gap-10">
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

  return (
    <div className="pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">

        {/* What we saw — grounds the audit in the actual surface(s) */}
        {surfaceDescription && (
          <div className="mb-4 max-w-3xl mx-auto px-4 py-3 rounded-xl bg-background-primary border border-border-primary text-sm text-text-secondary">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1">What we audited</p>
            <p>{surfaceDescription}</p>
            {noFindings && (
              <p className="mt-2 text-text-primary font-medium">
                No AI UX patterns meaningfully apply to this surface — there&apos;s nothing to flag here. Try uploading a screen where the AI is producing output (a chat thread, a recommendation list, a generation flow).
              </p>
            )}
          </div>
        )}

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
                className="w-full h-full object-contain block blur-[2px]"
              />
              {/* Subtle wash so the numbered pins read clearly over the blurred shot */}
              <div className="absolute inset-0 bg-white/30 dark:bg-black/30 pointer-events-none" />
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
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
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
        </div>

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

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
          <button
            onClick={() => setShowEmailModal(true)}
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-full border border-border-primary bg-background-primary text-text-primary text-sm font-medium hover:bg-background-secondary transition-colors cursor-pointer"
          >
            Email Report
          </button>
          <button
            onClick={() => {
              const next = activeTab === 'chat' ? 'issues' : 'chat';
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

        {/* Quick Wins */}
        {quickWins.length > 0 && (
          <section className="mt-10 sm:mt-12 max-w-3xl mx-auto">
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
      </div>

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
 * Email-capture demo CTA — primary "Start your audit" button paired with
 * an optional email field + checkbox opt-in for the daily newsletter.
 * Subscription is fire-and-forget so the audit transition stays instant.
 */
function DemoStartForm({
  onStart,
  auditsRemaining,
}: {
  onStart: () => void;
  auditsRemaining?: number;
}) {
  const [email, setEmail] = useState('');
  const [optIn, setOptIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleStart = () => {
    if (optIn && (!email || !isValidEmail(email))) {
      setError('Enter a valid email to receive updates');
      return;
    }
    setError(null);

    if (optIn && email && isValidEmail(email)) {
      // Fire-and-forget — don't block the audit transition.
      fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage-hero-pre-audit', website_url: '' }),
      }).catch(() => {});
    }

    onStart();
  };

  return (
    <form
      className="w-full max-w-xl"
      onSubmit={(e) => {
        e.preventDefault();
        handleStart();
      }}
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="your@email.com"
          className="flex-1 px-5 py-4 rounded-full text-base sm:text-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary placeholder:text-gray-400 focus:border-accent-primary dark:focus:border-white focus:outline-none transition-colors"
          autoComplete="email"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-accent-primary text-white dark:text-gray-900 text-base sm:text-lg font-semibold hover:bg-accent-hover transition-all active:scale-95 cursor-pointer shadow-lg shadow-accent-primary/20 whitespace-nowrap"
        >
          Start your audit
        </button>
      </div>

      <label className="flex items-center justify-center gap-2 mt-4 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={optIn}
          onChange={(e) => {
            setOptIn(e.target.checked);
            if (error) setError(null);
          }}
          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-accent-primary focus:ring-accent-primary cursor-pointer"
        />
        <span className="text-sm text-text-secondary">
          Email me daily AI UX news
        </span>
      </label>

      {error ? (
        <p className="text-sm text-border-error mt-2 text-center" role="alert">
          {error}
        </p>
      ) : (
        typeof auditsRemaining === 'number' && auditsRemaining > 0 && (
          <p className="text-sm text-text-tertiary text-center mt-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
              {auditsRemaining} free audit{auditsRemaining === 1 ? '' : 's'} · No signup
            </span>
          </p>
        )
      )}
    </form>
  );
}
