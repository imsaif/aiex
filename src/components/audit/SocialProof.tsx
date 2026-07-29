'use client';

import Link from 'next/link';
import {
  ChatBubbleLeftRightIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassCircleIcon,
  ArrowRightIcon,
  Squares2X2Icon,
  AcademicCapIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline';
import OptimizedMedia from '@/components/ui/OptimizedMedia';
import { PATTERN_COUNT } from '@/data/pattern-count';

const PATTERN_DEMOS = [
  {
    slug: 'contextual-assistance',
    title: 'Contextual Assistance',
    blurb: 'Gmail Smart Compose finishes the sentence you were writing.',
    media: '/images/examples/Smart-compose_Taco_Tuesday.gif',
  },
  {
    slug: 'trust-calibration',
    title: 'Trust Calibration',
    blurb: 'Reject suggestions and watch AI confidence pull back.',
    media: '/images/examples/notion-ai.gif',
  },
  {
    slug: 'mixed-initiative-control',
    title: 'Mixed-Initiative Control',
    blurb: 'Click any field. AI yields and keeps writing the others.',
    media: '/images/examples/figma-ai-design.gif',
  },
];

const TRUST_POINTS = [
  'Screenshots never stored',
  'Powered by Claude AI',
  'Actionable design insights',
];

export function SocialProof() {
  return (
    <div className="bg-background-primary border-t border-border-primary">
      {/* What is an AI UX audit — SEO content, visually enhanced */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-24">
        {/* Heading + description */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5" style={{ color: 'var(--text-hero)' }}>
            What is an AI UX audit?
          </h2>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed">
            Score your interface against {PATTERN_COUNT} patterns built for AI products. Upload a screenshot of any chatbot, code assistant, or dashboard and get instant, actionable fixes.
          </p>
        </div>

        {/* Each pattern has a working demo — drives traffic to pattern detail pages */}
        <div className="mb-14">
          <h3 className="text-xl font-bold text-text-primary mb-6">Each pattern has a working demo</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {PATTERN_DEMOS.map((d) => (
              <Link
                key={d.slug}
                href={`/patterns/${d.slug}`}
                className="group relative block rounded-2xl border border-border-primary bg-background-grain hover:bg-background-primary hover:border-accent-primary hover:shadow-card transition-all overflow-hidden flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden bg-background-tertiary">
                  <OptimizedMedia src={d.media} alt={`${d.title} demo`} fill sizes="(max-width: 768px) 100vw, 33vw" className="w-full h-full" />
                  <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent-primary bg-background-primary/95 backdrop-blur px-2 py-1 rounded-full">
                    <PlayCircleIcon className="w-3 h-3" />
                    Interactive
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="text-base font-bold text-text-primary mb-1 group-hover:text-accent-primary transition-colors">
                    {d.title}
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">{d.blurb}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-primary mt-auto">
                    Try the demo
                    <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/patterns"
            className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-accent-primary hover:underline"
          >
            See all {PATTERN_COUNT} patterns
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* How it works — 3 cards with icons */}
        <h3 className="text-xl font-bold text-text-primary mb-6">How it works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border-primary bg-background-grain p-6">
            <div className="w-12 h-12 rounded-full bg-background-primary border border-border-primary flex items-center justify-center mb-4">
              <ArrowUpTrayIcon className="w-6 h-6 text-accent-primary" />
            </div>
            <p className="text-sm font-semibold text-accent-primary mb-1">Step 1</p>
            <p className="text-base font-semibold text-text-primary mb-2">Upload</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Drop a screenshot. Desktop, mobile, or tablet.
            </p>
          </div>
          <div className="rounded-2xl border border-border-primary bg-background-grain p-6">
            <div className="w-12 h-12 rounded-full bg-background-primary border border-border-primary flex items-center justify-center mb-4">
              <MagnifyingGlassCircleIcon className="w-6 h-6 text-accent-primary" />
            </div>
            <p className="text-sm font-semibold text-accent-primary mb-1">Step 2</p>
            <p className="text-base font-semibold text-text-primary mb-2">Analyze</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Scored against {PATTERN_COUNT} patterns from ChatGPT, Copilot, and Notion.
            </p>
          </div>
          <div className="rounded-2xl border border-border-primary bg-background-grain p-6">
            <div className="w-12 h-12 rounded-full bg-background-primary border border-border-primary flex items-center justify-center mb-4">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-accent-primary" />
            </div>
            <p className="text-sm font-semibold text-accent-primary mb-1">Step 3</p>
            <p className="text-base font-semibold text-text-primary mb-2">Get Insights</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              See what&apos;s strong, weak, or missing. Chat with an AI mentor.
            </p>
          </div>
        </div>

        {/* Keep exploring — feature-card discovery routing to /patterns,
            /guides, and a couple of beginner-friendly starter courses for
            users who aren't sure where to dive in. Larger surface +
            iconography so it carries visual weight equivalent to the
            How-it-works cards above. */}
        <div className="mt-20 mb-2">
          <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Keep exploring</h3>
          <p className="text-base text-text-secondary">Browse patterns, take a course, or pick a starting point.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Link
            href="/patterns"
            className="group relative block rounded-2xl border border-border-primary bg-background-grain hover:bg-background-primary hover:border-accent-primary hover:shadow-card transition-all overflow-hidden h-full flex flex-col p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-background-primary border border-border-primary flex items-center justify-center">
                <Squares2X2Icon className="w-7 h-7 text-accent-primary" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-primary bg-background-primary border border-border-primary px-3 py-1.5 rounded-full">
                {PATTERN_COUNT} patterns
              </span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
              Browse the pattern library
            </h4>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-6">
              Real examples and code from ChatGPT, Claude, Copilot, and 50+ AI products.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2.5 py-1 rounded-md bg-background-primary border border-border-primary text-text-primary">Conversational UI</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-background-primary border border-border-primary text-text-primary">Confidence Visualization</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-background-primary border border-border-primary text-text-primary">+34 more</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-primary mt-auto">
              Explore patterns
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/guides"
            className="group relative block rounded-2xl border border-border-primary bg-background-grain hover:bg-background-primary hover:border-accent-primary hover:shadow-card transition-all overflow-hidden h-full flex flex-col p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-background-primary border border-border-primary flex items-center justify-center">
                <AcademicCapIcon className="w-7 h-7 text-accent-primary" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-primary bg-background-primary border border-border-primary px-3 py-1.5 rounded-full">
                Free · No signup
              </span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
              Free courses for designers
            </h4>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-6">
              Hands-on paths from product designers shipping AI features daily.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2.5 py-1 rounded-md bg-background-primary border border-border-primary text-text-primary">Claude Code</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-background-primary border border-border-primary text-text-primary">Cursor</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-background-primary border border-border-primary text-text-primary">GitHub Copilot</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-background-primary border border-border-primary text-text-primary">Claude Design</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-primary mt-auto">
              Browse courses
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

      </div>

      {/* Trust Points Strip */}
      <div className="border-y border-border-primary bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 md:py-5">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-10">
            {TRUST_POINTS.map((point, index) => (
              <div key={index} className="flex items-center gap-2 text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary flex-shrink-0" />
                <span className="text-sm whitespace-nowrap">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

