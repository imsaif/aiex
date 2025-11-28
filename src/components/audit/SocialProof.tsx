'use client';

import { motion } from 'framer-motion';
import { SparklesIcon, StarIcon } from '@heroicons/react/24/solid';

const STATS = [
  { value: '28', label: 'AI UX Patterns', sublabel: 'Research-backed' },
  { value: '500+', label: 'Designs Analyzed', sublabel: 'And counting' },
  { value: '<30s', label: 'Analysis Time', sublabel: 'Instant feedback' },
];

const TESTIMONIALS = [
  {
    quote: "Finally, a tool that understands AI interface design. The pattern suggestions were spot-on.",
    author: "Sarah K.",
    role: "Product Designer",
    company: "AI Startup",
    rating: 5,
  },
  {
    quote: "The fix prompts saved me hours. I just pasted them into Figma and my designs improved instantly.",
    author: "Marcus T.",
    role: "UX Lead",
    company: "Tech Company",
    rating: 5,
  },
  {
    quote: "Like having a senior AI/UX designer review my work. The chat mentor explained everything clearly.",
    author: "Elena R.",
    role: "Junior Designer",
    company: "Agency",
    rating: 5,
  },
];

const TRUST_POINTS = [
  'Screenshots never stored',
  'Powered by Claude AI',
  'Plain English feedback',
];

const COMPANY_LOGOS = [
  'OpenAI', 'Anthropic', 'Google', 'Microsoft', 'Meta', 'Figma'
];

export function SocialProof() {
  return (
    <div className="bg-background-primary border-t border-border-primary">
      {/* Stats Row */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-3 gap-8">
          {STATS.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-text-secondary">{stat.label}</div>
              <div className="text-xs text-text-tertiary">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Points - Simplified */}
      <div className="border-y border-border-primary bg-background-secondary">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-center gap-6 md:gap-10">
            {TRUST_POINTS.map((point, index) => (
              <div key={index} className="flex items-center gap-2 text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary" />
                <span className="text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-text-primary tracking-tight mb-2">
            Trusted by Designers Building AI Products
          </h3>
          <p className="text-sm text-text-secondary">
            Join hundreds of designers improving their AI interfaces
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-2xl bg-background-primary border border-border-primary shadow-card hover:shadow-card-hover transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-accent-primary" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-text-primary mb-5 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-background-secondary flex items-center justify-center border border-border-primary">
                  <span className="text-sm font-semibold text-text-primary">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{testimonial.author}</p>
                  <p className="text-xs text-text-tertiary">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium CTA Banner */}
      <div className="bg-accent-primary">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="hidden md:flex w-12 h-12 rounded-xl bg-white/10 items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight mb-1">
                  Unlock Unlimited Analysis
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Get unlimited scans, all annotations, and full fix prompts with Premium
                </p>
              </div>
            </div>
            <button
              type="button"
              className="px-8 py-3 bg-white text-accent-primary font-semibold rounded-full hover:bg-white/90 hover:scale-[1.02] transition-all active:scale-[0.98]"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>

      {/* Used By Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-xs text-text-tertiary text-center mb-6 uppercase tracking-wider">
          Designers from these companies use our patterns
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {COMPANY_LOGOS.map((company, index) => (
            <span
              key={index}
              className="text-lg font-semibold text-text-tertiary/40 hover:text-text-tertiary/70 transition-colors cursor-default"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
