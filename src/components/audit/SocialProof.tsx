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
  'Plain English feedback',
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
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
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
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <div className="aspect-[4/5] relative">
                <Image
                  src="/images/audit/daniel-korpai-mxPiMiz7KCo-unsplash.jpg"
                  alt="Designer reviewing AI interface on mobile and desktop"
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust Points Strip */}
      <div className="border-y border-border-primary bg-background-secondary">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-center gap-6 md:gap-10">
            {TRUST_POINTS.map((point, index) => (
              <div key={index} className="flex items-center gap-2 text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                <span className="text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof - Tweets/Testimonials */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-4">
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
    </div>
  );
}
