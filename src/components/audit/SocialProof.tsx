'use client';

import {
  ChatBubbleLeftRightIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassCircleIcon,
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
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5" style={{ color: 'var(--text-hero)' }}>
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
          <a href="/" className="px-3 py-1 rounded-full text-sm text-accent-primary hover:underline transition-colors">+32 more</a>
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

      {/* Community & Resources Section */}
      <div className="border-t border-border-primary bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-20">
          <div className="bg-background-primary rounded-2xl border border-border-primary p-8 md:p-10 shadow-card">
            {/* 3-column grid */}
            <div className="grid md:grid-cols-3 gap-8 md:gap-10">

              {/* Column 1: Share & Connect */}
              <div className="space-y-5">
                <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Share</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-background-tertiary rounded-lg">
                    <span className="text-xs text-text-secondary font-mono">aiux.design/audit</span>
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText('https://aiux.design/audit'); }}
                    className="w-9 h-9 rounded-lg bg-accent-primary flex items-center justify-center text-white hover:bg-accent-hover transition-colors flex-shrink-0"
                    title="Copy URL"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  {[
                    { href: 'https://twitter.com/intent/tweet?url=https://aiux.design/audit&text=Check%20out%20this%20AI%20UX%20Pattern%20Audit%20tool!', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                    { href: 'https://www.linkedin.com/sharing/share-offsite/?url=https://aiux.design/audit', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                    { href: 'https://wa.me/?text=Check%20out%20this%20AI%20UX%20Pattern%20Audit%20tool!%20https://aiux.design/audit', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' },
                  ].map((social, i) => (
                    <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-background-tertiary flex items-center justify-center text-text-primary hover:bg-background-secondary transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d={social.icon} /></svg>
                    </a>
                  ))}
                </div>

                <div className="space-y-2 pt-3">
                  <a href="mailto:hello@aiux.design" className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-primary transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Send Feedback
                  </a>
                  <a href="https://aiuxdesign.featurebase.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-primary transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    Suggest a Feature
                  </a>
                </div>
              </div>

              {/* Column 2: Resources */}
              <div className="space-y-5">
                <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Resources</p>
                <div className="space-y-3">
                  <a href="/" className="block text-base text-text-secondary hover:text-accent-primary transition-colors">All 36 Patterns</a>
                  <a href="/guides" className="block text-base text-text-secondary hover:text-accent-primary transition-colors">Designer Guides</a>
                  <a href="/prompts" className="block text-base text-text-secondary hover:text-accent-primary transition-colors">AI Tool Prompts</a>
                  <a href="/resources" className="block text-base text-text-secondary hover:text-accent-primary transition-colors">Downloads & Toolkits</a>
                </div>
              </div>

              {/* Column 3: Follow & Bookmark */}
              <div className="space-y-5">
                <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Stay Connected</p>
                <a
                  href="https://x.com/aiuxdesignguide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-base text-text-secondary hover:text-accent-primary transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  Follow on X
                </a>
                <button
                  onClick={() => { if (typeof window !== 'undefined') alert('Press Ctrl+D (or Cmd+D on Mac) to bookmark this page!'); }}
                  className="flex items-center gap-2 text-base text-text-secondary hover:text-accent-primary transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                  Bookmark This Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

