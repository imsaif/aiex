'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CheckIcon } from '@heroicons/react/24/outline';
import { ANALYSIS_MESSAGES } from '@/components/audit/shared';
import { productOptions } from '@/components/audit/productOptions';
import type { ProductType } from '@/types/audit';

// The 38-pattern library, cycled through during the "Checking patterns" phase so
// the narration reads as a real sweep rather than a spinner. Display strings only.
const PATTERN_NAMES = [
  'Confidence Visualization', 'Explainable AI', 'Progressive Disclosure', 'Error Recovery',
  'Human-in-the-Loop', 'Feedback Loops', 'Progressive Enhancement', 'Responsible AI Design',
  'Contextual Assistance', 'Conversational UI', 'Guided Learning', 'Graceful Handoff',
  'Safe Exploration', 'Privacy-First Design', 'Selective Memory', 'Session Degradation Prevention',
  'Adaptive Interfaces', 'Ambient Intelligence', 'Anti-Manipulation Safeguards', 'Augmented Creation',
  'Collaborative AI', 'Context Switching', 'Crisis Detection & Escalation', 'Intelligent Caching',
  'Multimodal Interaction', 'Predictive Anticipation', 'Universal Access Patterns', 'Vulnerable User Protection',
  'Autonomy Spectrum', 'Intent Preview', 'Plan Summary', 'Action Audit Trail',
  'Escalation Pathways', 'Trust Calibration', 'Mixed-Initiative Control', 'Agent Status & Monitoring',
  'Agent Reflection & Learning', 'Workspace-Native Agent Integration',
];
const PATTERN_COUNT = PATTERN_NAMES.length;

/**
 * How many patterns the analyzing narration lists. Read by the pattern-count drift
 * test, which inherited this guard from PatternCheckingPanel when AnalyzingView
 * replaced it. The names above are display strings, so they cannot derive from
 * the library directly — this export is what keeps them from silently drifting.
 */
export const PANEL_PATTERN_COUNT = PATTERN_COUNT;

// The products we benchmark patterns against — shown as a quiet logo strip so the
// wait has something concrete to look at (and signals "we compare against the best").
const BENCHMARK_LOGOS = [
  { src: '/images/logos/simple-icons/openai.svg', alt: 'OpenAI' },
  { src: '/images/logos/simple-icons/anthropic.svg', alt: 'Anthropic' },
  { src: '/images/logos/simple-icons/googlegemini.svg', alt: 'Gemini' },
  { src: '/images/logos/simple-icons/githubcopilot.svg', alt: 'GitHub Copilot' },
  { src: '/images/logos/simple-icons/cursor.svg', alt: 'Cursor' },
  { src: '/images/logos/simple-icons/perplexity.svg', alt: 'Perplexity' },
  { src: '/images/logos/simple-icons/notion.svg', alt: 'Notion' },
  { src: '/images/logos/simple-icons/figma.svg', alt: 'Figma' },
];

type StepState = 'done' | 'active' | 'pending';

interface AnalyzingViewProps {
  screenshots: { url: string; deviceType?: string }[];
  productType?: ProductType | null;
  /** Dev-only: freeze elapsed time so the view can be screenshotted deterministically. */
  previewElapsedMs?: number;
}

export function AnalyzingView({ screenshots, productType, previewElapsedMs }: AnalyzingViewProps) {
  const [elapsedMs, setElapsedMs] = useState(previewElapsedMs ?? 0);

  // Tick elapsed time; the whole pace derives from this so nothing can freeze on
  // a fixed-time step — the "Checking patterns" phase absorbs however long the
  // real ~40s (p90 ~58s) call takes and only ends when results replace this view.
  useEffect(() => {
    if (previewElapsedMs != null) return; // frozen for preview
    const startedAt = Date.now();
    const id = setInterval(() => setElapsedMs(Date.now() - startedAt), 200);
    return () => clearInterval(id);
  }, [previewElapsedMs]);

  const detectedOption = productType ? productOptions.find((o) => o.id === productType) : undefined;

  const readDone = elapsedMs > 1200;
  const detectDone = elapsedMs > 3000 && !!detectedOption;
  const checking = readDone && detectDone;

  const readState: StepState = readDone ? 'done' : 'active';
  const detectState: StepState = detectDone ? 'done' : readDone ? 'active' : 'pending';
  const checkState: StepState = checking ? 'active' : 'pending';

  // Asymptotic progress — approaches ~95% and never completes, matching the tuned
  // pacing against the real median instead of a checklist that hits 100% in ~12s.
  const progress = Math.round(95 * (1 - Math.exp(-elapsedMs / 20000)));
  const patternsChecked = checking ? Math.min(PATTERN_COUNT, Math.floor((progress / 95) * PATTERN_COUNT)) : 0;
  const currentPattern = PATTERN_NAMES[Math.floor(elapsedMs / 350) % PATTERN_COUNT];
  const statusMessage = ANALYSIS_MESSAGES[Math.floor(elapsedMs / 2500) % ANALYSIS_MESSAGES.length];

  const shot = screenshots[0];

  return (
    <div className="min-h-[82vh] bg-background-primary">
      <style>{`@keyframes auditScan { 0% { top: -10%; } 100% { top: 110%; } }`}</style>
      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-12 lg:py-16">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          {/* LEFT: header + live narration feed + benchmark logos */}
          <main>
            {/* Header — kept in the left column so the right-rail cards top-align with the title. */}
            <div className="mb-10">
              {/* No "Analyzing" eyebrow: the h1 already says it, and the pattern
                  progress bar below carries the in-progress signal a spinner would. */}
              <h1 className="type-h2 font-bold text-text-primary">Analyzing your design</h1>
              <p className="text-text-secondary text-base mt-2 leading-relaxed">{statusMessage}</p>
            </div>

            <ol className="flex flex-col">
              <FeedRow state={readState} last={false}>
                <div className="text-base font-semibold text-text-primary">Read your screenshot{screenshots.length > 1 ? 's' : ''}</div>
                <div className="text-sm text-text-secondary mt-1 leading-relaxed">
                  {screenshots.length} {screenshots.length === 1 ? 'image' : 'images'} received
                </div>
              </FeedRow>

              <FeedRow state={detectState} last={false}>
                <div className="text-base font-semibold text-text-primary">Identified the surface</div>
                <div className="text-sm text-text-secondary mt-1 leading-relaxed">
                  {detectedOption ? (
                    <span><span className="font-medium text-text-primary">{detectedOption.label}</span> — tailoring the checks to your product</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5"><Spinner /> Detecting product type…</span>
                  )}
                </div>
              </FeedRow>

              <FeedRow state={checkState} last>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-base font-semibold text-text-primary">Checking {PATTERN_COUNT} patterns</div>
                  {checking && <span className="text-sm tabular-nums text-text-tertiary">{patternsChecked}/{PATTERN_COUNT}</span>}
                </div>
                {checking ? (
                  <>
                    <div className="text-sm text-text-secondary mt-1 inline-flex items-center gap-1.5 leading-relaxed">
                      <Spinner /> <span className="truncate">{currentPattern}</span>
                    </div>
                    <div className="mt-3 h-1.5 rounded-pill bg-background-secondary overflow-hidden">
                      <div className="h-full rounded-pill bg-accent-primary transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="text-xs text-text-tertiary mt-3 leading-relaxed">Then: scoring &amp; writing the fixes you can ship today</div>
                  </>
                ) : (
                  <div className="text-sm text-text-tertiary mt-1 leading-relaxed">Scoring against the patterns that apply to your surface</div>
                )}
              </FeedRow>
            </ol>

            {/* Benchmark logo strip */}
            <div className="mt-12 pt-8 border-t border-border-primary">
              <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary mb-5">Comparing against top AI products</p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
                {BENCHMARK_LOGOS.map((logo) => (
                  <Image
                    key={logo.alt}
                    src={logo.src}
                    alt={logo.alt}
                    width={22}
                    height={22}
                    className="w-[22px] h-[22px] opacity-40 dark:invert dark:opacity-50"
                    unoptimized
                  />
                ))}
              </div>
            </div>
          </main>

          {/* RIGHT: live cards */}
          <aside className="mt-10 lg:mt-0 flex flex-col gap-3">
            {/* Screenshot preview — the artifact being analyzed, with a scan sweep. */}
            {shot?.url && (
              <div className="rounded-card border border-border-primary bg-background-secondary p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-2.5">Your screenshot</div>
                <div className="relative rounded-lg overflow-hidden border border-border-primary bg-background-primary aspect-[16/10]">
                  <Image src={shot.url} alt="Your screenshot" fill sizes="320px" className="object-cover object-top" unoptimized />
                  <div
                    className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-accent-primary/25 to-transparent pointer-events-none"
                    style={{ animation: 'auditScan 2.4s ease-in-out infinite' }}
                    aria-hidden
                  />
                </div>
              </div>
            )}

            <div className="rounded-card border border-border-primary bg-background-secondary p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-3">Progress</div>
              <ol className="flex flex-col">
                <MiniStep state={readState} label="Read screenshot" last={false} />
                <MiniStep state={detectState} label="Identify surface" last={false} />
                <MiniStep state={checkState} label="Check patterns" last={false} />
                <MiniStep state="pending" label="Write fixes" last />
              </ol>
            </div>

            <div className="rounded-card border border-border-primary bg-background-secondary p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-3">Context</div>
              <dl className="flex flex-col gap-2.5 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-text-secondary">Product type</dt>
                  <dd className="font-medium text-text-primary text-right truncate">{detectedOption?.label ?? 'Detecting…'}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-text-secondary">Pattern library</dt>
                  <dd className="font-medium text-text-primary">{PATTERN_COUNT} patterns</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-text-secondary">Screenshots</dt>
                  <dd className="font-medium text-text-primary">{screenshots.length}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span
      className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin inline-block flex-shrink-0 border-text-tertiary"
      aria-hidden
    />
  );
}

function Indicator({ state }: { state: StepState }) {
  return (
    <span
      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
        state === 'done'
          ? 'bg-accent-primary text-white dark:text-gray-900'
          : state === 'active'
            ? 'border-2 border-accent-primary'
            : 'border-2 border-border-primary'
      }`}
      aria-hidden
    >
      {state === 'done' ? (
        <CheckIcon className="w-3.5 h-3.5" strokeWidth={3} />
      ) : state === 'active' ? (
        <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
      ) : null}
    </span>
  );
}

function FeedRow({ state, last, children }: { state: StepState; last?: boolean; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center pt-0.5">
        <Indicator state={state} />
        {!last && <span className="w-px flex-1 min-h-[2.5rem] bg-border-primary my-1.5" />}
      </div>
      <div className={`min-w-0 flex-1 ${last ? '' : 'pb-7'}`}>{children}</div>
    </li>
  );
}

function MiniStep({ state, label, last }: { state: StepState; label: string; last?: boolean }) {
  return (
    <li className="flex gap-2.5">
      <div className="flex flex-col items-center">
        <span
          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${
            state === 'done'
              ? 'bg-accent-primary'
              : state === 'active'
                ? 'border-2 border-accent-primary'
                : 'border-2 border-border-primary'
          }`}
          aria-hidden
        >
          {state === 'active' && <span className="w-1 h-1 rounded-full bg-accent-primary animate-pulse" />}
        </span>
        {!last && <span className="w-px flex-1 min-h-[0.75rem] bg-border-primary my-0.5" />}
      </div>
      <span className={`text-sm pb-2.5 ${state === 'pending' ? 'text-text-tertiary' : 'text-text-primary'}`}>{label}</span>
    </li>
  );
}
