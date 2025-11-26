import Link from 'next/link';
import type { Metadata } from 'next';
import { MagnifyingGlassIcon, CheckCircleIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'AI UX Pattern Audit | Free Design Analysis Tool',
  description: 'Discover which essential AI patterns your interface is missing in 60 seconds. Free analysis tool with instant results and implementation guides.',
};

export default function AuditLandingPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background-primary">
      {/* Hero Section */}
      <section className="pt-12 md:pt-16 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1 mb-4 bg-accent-subtle border-2 border-border-primary rounded-full text-sm font-semibold text-text-primary">
            🚧 Work in Progress
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 text-text-primary tracking-tight">
            AI UX Pattern Audit
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-10 max-w-2xl mx-auto">
            Discover which essential AI patterns your interface is missing in 60 seconds
          </p>

          {/* Value Props */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-4 text-text-primary">
                <MagnifyingGlassIcon className="w-full h-full" />
              </div>
              <div className="font-semibold text-lg mb-2 text-text-primary">Detect Patterns</div>
              <div className="text-sm text-text-tertiary">28 AI patterns analyzed</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-4 text-text-primary">
                <CheckCircleIcon className="w-full h-full" />
              </div>
              <div className="font-semibold text-lg mb-2 text-text-primary">Get Priorities</div>
              <div className="text-sm text-text-tertiary">Know what to fix first</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-4 text-text-primary">
                <RocketLaunchIcon className="w-full h-full" />
              </div>
              <div className="font-semibold text-lg mb-2 text-text-primary">Implementation</div>
              <div className="text-sm text-text-tertiary">Ready-to-use solutions</div>
            </div>
          </div>

          {/* Main CTA */}
          <Link
            href="/audit/context"
            className="inline-block bg-accent-primary dark:bg-white text-white dark:text-black font-semibold text-xl px-12 py-4 rounded-full hover:scale-[1.02] transition-transform shadow-card"
          >
            Start Free Audit →
          </Link>
          <p className="mt-4 text-sm text-text-tertiary">
            No signup required • 60 seconds • Instant results
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-background-secondary">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-text-primary">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-accent-primary dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-semibold text-xl mb-4">
                1
              </div>
              <div className="font-semibold text-lg mb-2 text-text-primary">Answer 3 Questions</div>
              <div className="text-sm text-text-secondary">About your AI product</div>
            </div>

            <div className="text-2xl text-text-tertiary hidden md:block">→</div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-accent-primary dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-semibold text-xl mb-4">
                2
              </div>
              <div className="font-semibold text-lg mb-2 text-text-primary">Upload Design</div>
              <div className="text-sm text-text-secondary">Screenshot or Figma</div>
            </div>

            <div className="text-2xl text-text-tertiary hidden md:block">→</div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-accent-primary dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-semibold text-xl mb-4">
                3
              </div>
              <div className="font-semibold text-lg mb-2 text-text-primary">Get Report</div>
              <div className="text-sm text-text-secondary">Personalized insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-text-tertiary mb-6">Trusted by designers at</p>
          <div className="flex flex-wrap justify-center gap-10 opacity-60">
            <div className="text-lg font-semibold text-text-secondary">Stripe</div>
            <div className="text-lg font-semibold text-text-secondary">Linear</div>
            <div className="text-lg font-semibold text-text-secondary">Vercel</div>
            <div className="text-lg font-semibold text-text-secondary">Notion</div>
          </div>
        </div>
      </section>

      {/* Example Results */}
      <section className="py-16 px-6 bg-background-secondary">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-semibold text-center mb-8 text-text-primary">
            Example Audit Results
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Missing Pattern */}
            <div className="p-5 bg-surface-primary rounded-2xl border-2 border-border-primary shadow-card">
              <div className="font-semibold text-text-primary mb-2">
                ❌ Missing: Confidence Indicators
              </div>
              <div className="text-sm text-text-secondary">
                Users can't judge AI reliability
              </div>
            </div>

            {/* Weak Pattern */}
            <div className="p-5 bg-surface-primary rounded-2xl border-2 border-border-primary shadow-card">
              <div className="font-semibold text-text-primary mb-2">
                ⚠️ Weak: Error Recovery
              </div>
              <div className="text-sm text-text-secondary">
                No fallback when AI fails
              </div>
            </div>

            {/* Good Pattern */}
            <div className="p-5 bg-surface-primary rounded-2xl border-2 border-border-primary shadow-card">
              <div className="font-semibold text-text-primary mb-2">
                ✅ Good: Conversational UI
              </div>
              <div className="text-sm text-text-secondary">
                Natural chat interface
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-12">
            <Link
              href="/audit/context"
              className="inline-block bg-accent-primary dark:bg-white text-white dark:text-black font-semibold text-lg px-10 py-3 rounded-full hover:scale-[1.02] transition-transform shadow-card"
            >
              Start Your Free Audit →
            </Link>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}
