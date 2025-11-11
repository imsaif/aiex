'use client';

import { motion } from 'framer-motion';

export function HandbookPatternPreview() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background-secondary">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground-primary mb-4">
            Preview Pattern #1
          </h2>
          <p className="text-lg text-foreground-secondary">
            Here's what's inside: Contextual Assistance
          </p>
        </motion.div>

        {/* Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl border border-border-primary shadow-lg overflow-hidden"
        >
          {/* Pattern Header */}
          <div className="bg-accent-primary text-background-primary px-6 sm:px-8 py-8">
            <div className="text-4xl mb-3">💡</div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-2">
              Pattern 1: Contextual Assistance
            </h3>
            <p className="text-accent-primary/90 text-lg">
              Help users when they're actually stuck, not when you think they might be
            </p>
          </div>

          {/* Pattern Content */}
          <div className="px-6 sm:px-8 py-8 space-y-8">
            {/* The Idea Section */}
            <div>
              <h4 className="text-xl font-bold text-foreground-primary mb-4">The Idea</h4>
              <p className="text-foreground-secondary leading-relaxed mb-4">
                The best AI help is invisible until needed. Watch for signals. A pause, a mistake, a search. Offer suggestions at exactly that moment, then disappear if ignored.
              </p>
              <p className="text-foreground-secondary leading-relaxed">
                Like a helpful colleague who notices you're stuck, makes one suggestion, and steps back. Not someone interrupting every five minutes.
              </p>
            </div>

            {/* When to Use Section */}
            <div>
              <h4 className="text-xl font-bold text-foreground-primary mb-4">When to Use</h4>
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <span className="text-green-700 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground-primary">User is paused, stuck, or searching</p>
                    <p className="text-sm text-foreground-secondary">Detect the signal of uncertainty</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <span className="text-green-700 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground-primary">Help is relevant to the current moment</p>
                    <p className="text-sm text-foreground-secondary">Not generic or off-topic suggestions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <span className="text-green-700 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground-primary">User can dismiss or ignore it</p>
                    <p className="text-sm text-foreground-secondary">Never force AI interaction</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Examples */}
            <div>
              <h4 className="text-xl font-bold text-foreground-primary mb-4">Products Doing It Right</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-accent-primary pl-4 py-2">
                  <p className="font-semibold text-foreground-primary">Gmail Smart Compose</p>
                  <p className="text-sm text-foreground-secondary">Suggests text when you pause writing a message</p>
                </div>
                <div className="border-l-4 border-accent-primary pl-4 py-2">
                  <p className="font-semibold text-foreground-primary">GitHub Copilot</p>
                  <p className="text-sm text-foreground-secondary">Suggests code when you pause typing or leave a comment</p>
                </div>
                <div className="border-l-4 border-accent-primary pl-4 py-2">
                  <p className="font-semibold text-foreground-primary">Notion AI</p>
                  <p className="text-sm text-foreground-secondary">Offers help in relevant moments without being intrusive</p>
                </div>
              </div>
            </div>

            {/* Key Insight */}
            <div className="bg-accent-primary/5 border border-accent-primary/20 rounded-lg p-4">
              <p className="text-sm font-semibold text-accent-primary mb-2">Key Insight</p>
              <p className="text-foreground-secondary">
                <strong>Invisible until needed.</strong> Clear when presented. <strong>Gone if rejected.</strong> This is the essence of respectful AI assistance.
              </p>
            </div>

            {/* DO/DON'T */}
            <div>
              <h4 className="text-xl font-bold text-foreground-primary mb-4">Do's and Don'ts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-green-700 mb-3">✓ DO</p>
                  <ul className="space-y-2 text-sm text-foreground-secondary">
                    <li>• Detect signals: pauses, mistakes, searches</li>
                    <li>• Offer as suggestion (not requirement)</li>
                    <li>• Disappear if ignored</li>
                    <li>• Keep it timely and relevant</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-red-700 mb-3">✗ DON'T</p>
                  <ul className="space-y-2 text-sm text-foreground-secondary">
                    <li>• Add "Ask AI" buttons everywhere</li>
                    <li>• Help when user is performing well</li>
                    <li>• Force interaction</li>
                    <li>• Interrupt without context</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-background-secondary border-t border-border-primary px-6 sm:px-8 py-6 text-center">
            <p className="text-sm text-foreground-secondary">
              This is just one of 6 patterns in the handbook. Each includes detailed guidelines and design considerations.
            </p>
          </div>
        </motion.div>

        {/* Preview Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            The handbook also includes Figma design prompts, interactive code examples, and practical implementation guides for each pattern.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
