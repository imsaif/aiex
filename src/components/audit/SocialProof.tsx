'use client';

import Link from 'next/link';
import {
  ChatBubbleLeftRightIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassCircleIcon,
  ArrowRightIcon,
  Squares2X2Icon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import CompanyLogoCarousel from '@/components/ui/CompanyLogoCarousel';
import { companyLogos } from '@/data/company-logos';

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
            An AI UX audit evaluates your interface against proven design patterns to identify usability strengths and gaps.
            This tool scores your design against 36 patterns specifically researched for AI products.
            Upload a screenshot of any AI interface like a chatbot, code assistant, dashboard, or content generator and get instant, actionable feedback.
          </p>
        </div>

        {/* Logo carousel — trusted by */}
        <div className="mb-12">
          <p className="text-[9px] font-bold text-text-secondary uppercase tracking-tight mb-4">Patterns used by teams at</p>
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

        {/* Pattern pills — non-linked labels, +32 more links to patterns page */}
        <div className="flex flex-wrap gap-2 mb-14">
          <span className="text-sm text-text-tertiary py-1">Patterns tested:</span>
          <span className="px-3 py-1 rounded-full text-sm text-text-secondary border border-border-primary/50">Progressive Disclosure</span>
          <span className="px-3 py-1 rounded-full text-sm text-text-secondary border border-border-primary/50">Confidence Visualization</span>
          <span className="px-3 py-1 rounded-full text-sm text-text-secondary border border-border-primary/50">Error Recovery</span>
          <span className="px-3 py-1 rounded-full text-sm text-text-secondary border border-border-primary/50">Contextual Assistance</span>
          <a href="/patterns" className="px-3 py-1 rounded-full text-sm text-accent-primary hover:underline transition-colors">+32 more</a>
        </div>

        {/* How it works — 3 cards with icons */}
        <h3 className="text-xl font-bold text-text-primary mb-6">How it works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border-primary bg-background-secondary p-6">
            <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center mb-4">
              <ArrowUpTrayIcon className="w-6 h-6 text-accent-primary" />
            </div>
            <p className="text-sm font-semibold text-accent-primary mb-1">Step 1</p>
            <p className="text-base font-semibold text-text-primary mb-2">Upload</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Drop a screenshot of your AI interface. Supports desktop, mobile, and tablet designs.
            </p>
          </div>
          <div className="rounded-2xl border border-border-primary bg-background-secondary p-6">
            <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center mb-4">
              <MagnifyingGlassCircleIcon className="w-6 h-6 text-accent-primary" />
            </div>
            <p className="text-sm font-semibold text-accent-primary mb-1">Step 2</p>
            <p className="text-base font-semibold text-text-primary mb-2">Analyze</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Scored against 36 AI UX patterns used by ChatGPT, GitHub Copilot, and Notion.
            </p>
          </div>
          <div className="rounded-2xl border border-border-primary bg-background-secondary p-6">
            <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center mb-4">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-accent-primary" />
            </div>
            <p className="text-sm font-semibold text-accent-primary mb-1">Step 3</p>
            <p className="text-base font-semibold text-text-primary mb-2">Get Insights</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              See which patterns are strong, weak, or missing, then chat with an AI design mentor.
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
          <p className="text-base text-text-secondary">Browse the library, level up with a course, or just pick a starting point.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Link
            href="/patterns"
            className="group relative block rounded-2xl border border-border-primary bg-background-secondary hover:bg-background-primary hover:border-accent-primary hover:shadow-card transition-all overflow-hidden h-full flex flex-col p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-accent-subtle flex items-center justify-center">
                <Squares2X2Icon className="w-7 h-7 text-accent-primary" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-primary bg-accent-subtle px-3 py-1.5 rounded-full">
                36 patterns
              </span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
              Browse the pattern library
            </h4>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-6">
              Real examples, code demos, and design guidance from ChatGPT, Claude, GitHub Copilot, Midjourney, and 50+ shipped AI products.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2.5 py-1 rounded-md bg-background-tertiary text-text-secondary">Conversational UI</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-background-tertiary text-text-secondary">Confidence Visualization</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-background-tertiary text-text-secondary">+34 more</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-primary mt-auto">
              Explore patterns
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/guides"
            className="group relative block rounded-2xl border border-border-primary bg-background-secondary hover:bg-background-primary hover:border-accent-primary hover:shadow-card transition-all overflow-hidden h-full flex flex-col p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-accent-subtle flex items-center justify-center">
                <AcademicCapIcon className="w-7 h-7 text-accent-primary" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-primary bg-accent-subtle px-3 py-1.5 rounded-full">
                Free · No signup
              </span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
              Free courses for designers
            </h4>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-6">
              Hands-on learning paths to ship AI features faster — straight from product designers using these tools every day.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs px-2.5 py-1 rounded-md bg-background-tertiary text-text-secondary">Claude Code</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-background-tertiary text-text-secondary">Cursor</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-background-tertiary text-text-secondary">GitHub Copilot</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-background-tertiary text-text-secondary">Claude Design</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-primary mt-auto">
              Browse courses
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

        {/* "Not sure where to start?" beginner-friendly starter cards.
            Same surface treatment as the primary Keep exploring cards
            above so they read as legitimate options, not afterthoughts. */}
        <div className="mt-10 pt-10 border-t border-border-primary/60">
          <p className="text-sm font-semibold uppercase tracking-wide text-text-tertiary mb-6">
            Not sure where to start?
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/guides/conversational-ui-guide"
              className="group relative block rounded-2xl border border-border-primary bg-background-secondary hover:bg-background-primary hover:border-accent-primary hover:shadow-card transition-all overflow-hidden h-full flex flex-col p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-accent-subtle flex items-center justify-center">
                  <ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7 text-accent-primary" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent-primary bg-accent-subtle px-3 py-1.5 rounded-full">
                  Hands-on
                </span>
              </div>
              <h4 className="text-xl md:text-2xl font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
                Build a Conversational UI
              </h4>
              <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-6">
                Design and ship a chat interface from scratch — message bubbles, input states, error recovery, and the patterns ChatGPT and Claude actually use.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-primary mt-auto">
                Start the guide
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/guides/claude-code-learning-path"
              className="group relative block rounded-2xl border border-border-primary bg-background-secondary hover:bg-background-primary hover:border-accent-primary hover:shadow-card transition-all overflow-hidden h-full flex flex-col p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-accent-subtle flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logos/claude.svg"
                    alt=""
                    width={28}
                    height={28}
                    className="w-7 h-7 dark:invert"
                  />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent-primary bg-accent-subtle px-3 py-1.5 rounded-full">
                  Most popular
                </span>
              </div>
              <h4 className="text-xl md:text-2xl font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
                Claude Code Course for Designers
              </h4>
              <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-6">
                Go from zero to shipping real features with Claude Code — designed for product designers who don&apos;t (yet) ship code daily.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-primary mt-auto">
                Start the course
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
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

