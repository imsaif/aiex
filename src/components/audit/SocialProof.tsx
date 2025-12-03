'use client';

import { motion } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  DocumentMagnifyingGlassIcon,
  LightBulbIcon,
  BoltIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

const FEATURES = [
  { label: 'Pattern Detection', icon: DocumentMagnifyingGlassIcon },
  { label: 'Instant Scoring', icon: BoltIcon },
  { label: 'AI Chat Mentor', icon: ChatBubbleLeftRightIcon },
  { label: 'Fix Suggestions', icon: LightBulbIcon },
  { label: 'Figma Prompts', icon: SparklesIcon },
];

const TRUST_POINTS = [
  'Screenshots never stored',
  'Powered by Claude AI',
  'Actionable design insights',
];

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    handle: '@sarahux',
    avatar: 'https://i.pravatar.cc/150?img=47',
    platform: 'twitter' as const,
    quote: 'Finally found a tool that actually understands AI interface patterns. The feedback is spot-on and actionable.',
  },
  {
    name: 'Marcus Rivera',
    handle: '@marcusdesigns',
    avatar: 'https://i.pravatar.cc/150?img=12',
    platform: 'twitter' as const,
    quote: 'This is exactly what I needed for reviewing my chatbot UI. The pattern suggestions saved me hours of research.',
  },
  {
    name: 'Elena Kowalski',
    handle: '@elenakowalski',
    avatar: 'https://i.pravatar.cc/150?img=23',
    platform: 'linkedin' as const,
    quote: 'The AI chat mentor explained complex UX concepts in plain English. Great for learning while improving designs.',
  },
  {
    name: 'James Park',
    handle: '@jamespark_ux',
    avatar: 'https://i.pravatar.cc/150?img=59',
    platform: 'twitter' as const,
    quote: 'Uploaded my AI dashboard mockup and got instant feedback on 28 different patterns. Super comprehensive.',
  },
  {
    name: 'Priya Sharma',
    handle: '@priyabuilds',
    avatar: 'https://i.pravatar.cc/150?img=45',
    platform: 'twitter' as const,
    quote: 'The Figma prompts feature is brilliant. Copy, paste, iterate. My workflow is so much faster now.',
  },
  {
    name: 'David Mueller',
    handle: '@dmueller',
    avatar: 'https://i.pravatar.cc/150?img=68',
    platform: 'linkedin' as const,
    quote: 'Best tool I\'ve found for auditing AI product interfaces. The scoring system helps prioritize what to fix first.',
  },
];

export function SocialProof() {
  return (
    <div className="bg-background-primary border-t border-border-primary">
      {/* Feature Showcase Section - Like the reference */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text-hero)' }}>
              AI UX Pattern Audit
            </h2>
            <p className="text-base text-text-secondary leading-relaxed mb-8">
              Upload any AI interface screenshot and get instant feedback on UX patterns.
              Powered by 28 research-backed patterns for AI products.
            </p>

            {/* Feature Chips */}
            <div className="flex flex-wrap gap-3">
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-primary bg-background-secondary text-sm text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors cursor-default"
                >
                  <feature.icon className="w-4 h-4" />
                  {feature.label}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Showcase Image - Smaller, subtle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative max-w-xs mx-auto"
          >
            <div className="rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/audit/daniel-korpai-mxPiMiz7KCo-unsplash.jpg"
                alt="Designer reviewing AI interface on mobile and desktop"
                width={280}
                height={350}
                className="object-cover"
              />
            </div>
          </motion.div>
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

      {/* Social Proof - Tweets/Testimonials */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-5 rounded-2xl border border-border-primary bg-background-primary hover:shadow-card transition-shadow"
            >
              {/* Header: Avatar, Name, Handle, Platform */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{testimonial.name}</p>
                    <p className="text-xs text-text-tertiary">{testimonial.handle}</p>
                  </div>
                </div>
                {/* Platform icon */}
                <div className="text-text-tertiary">
                  {testimonial.platform === 'twitter' && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )}
                  {testimonial.platform === 'linkedin' && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Quote with highlighted text */}
              <p className="text-sm text-text-primary leading-relaxed">
                {testimonial.quote}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Showcase Gallery Section */}
      <div className="border-t border-border-primary bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-24">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1fr)_480px] gap-8 lg:gap-10 xl:gap-12">
            {/* Left: Gallery Content */}
            <div>
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text-hero)' }}>
                  Analyze Any AI Design
                </h2>
                <p className="text-base text-text-secondary leading-relaxed">
                  Upload any screenshot and get instant pattern analysis with actionable feedback.
                </p>
              </div>

              {/* Grid of Use Case Cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* Large card - spans 2 rows */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  className="row-span-2 rounded-2xl overflow-hidden border border-border-primary bg-background-primary shadow-card"
                >
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex-1 bg-background-tertiary rounded-xl flex items-center justify-center min-h-[220px]">
                      <div className="text-center p-6">
                        <div className="w-12 h-12 rounded-full bg-accent-subtle mx-auto mb-3 flex items-center justify-center">
                          <ChatBubbleLeftRightIcon className="w-6 h-6 text-accent-primary" />
                        </div>
                        <p className="text-sm font-semibold text-text-primary">Chatbot Interfaces</p>
                        <p className="text-sm text-text-secondary mt-1">Conversational AI</p>
                      </div>
                    </div>
                    <div className="mt-3 px-1">
                      <span className="text-sm text-text-secondary">ChatGPT, Claude, Gemini...</span>
                    </div>
                  </div>
                </motion.div>

                {/* Smaller cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl overflow-hidden border border-border-primary bg-background-primary shadow-card"
                >
                  <div className="p-4">
                    <div className="bg-background-tertiary rounded-xl flex items-center justify-center h-[100px]">
                      <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-accent-subtle mx-auto mb-2 flex items-center justify-center">
                          <BoltIcon className="w-5 h-5 text-accent-primary" />
                        </div>
                        <p className="text-sm font-medium text-text-primary">Code Assistants</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  viewport={{ once: true }}
                  className="rounded-2xl overflow-hidden border border-border-primary bg-background-primary shadow-card"
                >
                  <div className="p-4">
                    <div className="bg-background-tertiary rounded-xl flex items-center justify-center h-[100px]">
                      <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-accent-subtle mx-auto mb-2 flex items-center justify-center">
                          <SparklesIcon className="w-5 h-5 text-accent-primary" />
                        </div>
                        <p className="text-sm font-medium text-text-primary">Content Generators</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="rounded-2xl overflow-hidden border border-border-primary bg-background-primary shadow-card"
                >
                  <div className="p-4">
                    <div className="bg-background-tertiary rounded-xl flex items-center justify-center h-[100px]">
                      <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-accent-subtle mx-auto mb-2 flex items-center justify-center">
                          <DocumentMagnifyingGlassIcon className="w-5 h-5 text-accent-primary" />
                        </div>
                        <p className="text-sm font-medium text-text-primary">AI Dashboards</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  viewport={{ once: true }}
                  className="rounded-2xl overflow-hidden border border-border-primary bg-background-primary shadow-card"
                >
                  <div className="p-4">
                    <div className="bg-background-tertiary rounded-xl flex items-center justify-center h-[100px]">
                      <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-accent-subtle mx-auto mb-2 flex items-center justify-center">
                          <LightBulbIcon className="w-5 h-5 text-accent-primary" />
                        </div>
                        <p className="text-sm font-medium text-text-primary">AI Agents</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Feature pills below grid */}
              <div className="flex flex-wrap gap-3 mt-8">
                {['Mobile & Desktop', 'Figma Exports', 'Screenshots'].map((label, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full border border-border-primary bg-background-primary text-sm text-text-secondary"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Sticky Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-6 bg-background-primary rounded-2xl border border-border-primary p-6 shadow-card">
                {/* Logo & Brand */}
                <div className="flex items-center gap-3 pb-5 border-b border-border-primary">
                  <span className="flex items-center justify-center w-12 h-12 bg-accent-subtle rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-text-primary">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      <path d="M12 10l1-2.2 1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z" fill="white" />
                    </svg>
                  </span>
                  <div>
                    <span className="text-lg font-semibold text-text-primary block">AI UX Patterns</span>
                    <span className="text-sm text-text-tertiary">Design better AI interfaces</span>
                  </div>
                </div>

                {/* CTA Buttons - Stacked layout */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base text-text-primary font-medium">Come back!</span>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          alert('Press Ctrl+D (or Cmd+D on Mac) to bookmark this page!');
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border-primary bg-background-secondary text-sm font-medium text-text-primary hover:border-accent-primary hover:text-accent-primary transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Bookmark Page
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base text-text-primary">Have feedback?</span>
                    <a
                      href="mailto:hello@aiux.design"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border-primary bg-background-secondary text-sm text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Send Feedback
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base text-text-primary">Have an idea?</span>
                    <a
                      href="https://aiuxdesign.featurebase.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border-primary bg-background-secondary text-sm text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Suggest Feature
                    </a>
                  </div>
                </div>

                {/* Sharing */}
                <div className="pt-5 border-t border-border-primary">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-base text-text-primary">Sharing is caring!</span>
                    <div className="flex items-center gap-1.5">
                      {/* X/Twitter */}
                      <a
                        href="https://twitter.com/intent/tweet?url=https://aiux.design/audit&text=Check%20out%20this%20AI%20UX%20Pattern%20Audit%20tool!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-background-tertiary flex items-center justify-center text-text-primary hover:bg-background-secondary transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                      {/* Bluesky */}
                      <a
                        href="https://bsky.app/intent/compose?text=Check%20out%20this%20AI%20UX%20Pattern%20Audit%20tool!%20https://aiux.design/audit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-background-tertiary flex items-center justify-center text-text-primary hover:bg-background-secondary transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 01-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
                        </svg>
                      </a>
                      {/* LinkedIn */}
                      <a
                        href="https://www.linkedin.com/sharing/share-offsite/?url=https://aiux.design/audit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-background-tertiary flex items-center justify-center text-text-primary hover:bg-background-secondary transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                      {/* WhatsApp */}
                      <a
                        href="https://wa.me/?text=Check%20out%20this%20AI%20UX%20Pattern%20Audit%20tool!%20https://aiux.design/audit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-background-tertiary flex items-center justify-center text-text-primary hover:bg-background-secondary transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </a>
                      {/* Telegram */}
                      <a
                        href="https://t.me/share/url?url=https://aiux.design/audit&text=Check%20out%20this%20AI%20UX%20Pattern%20Audit%20tool!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-background-tertiary flex items-center justify-center text-text-primary hover:bg-background-secondary transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  {/* URL Copy Field */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-2.5 bg-background-tertiary rounded-lg">
                      <span className="text-sm text-text-secondary font-mono">https://aiux.design/audit</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('https://aiux.design/audit');
                      }}
                      className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center text-white hover:bg-accent-hover transition-colors"
                      title="Copy URL"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="pt-5 border-t border-border-primary">
                  <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-4">Resources</p>
                  <div className="space-y-3">
                    <a href="/" className="block text-base text-text-secondary hover:text-accent-primary transition-colors">
                      All 28 Patterns
                    </a>
                    <a href="/guides" className="block text-base text-text-secondary hover:text-accent-primary transition-colors">
                      Designer Guides
                    </a>
                    <a href="/prompts" className="block text-base text-text-secondary hover:text-accent-primary transition-colors">
                      AI Tool Prompts
                    </a>
                  </div>
                </div>

                {/* Follow */}
                <div className="pt-5 border-t border-border-primary">
                  <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-4">Follow Us</p>
                  <div className="space-y-3">
                    <a
                      href="https://x.com/aiuxdesignguide"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-base text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      X (Twitter)
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
