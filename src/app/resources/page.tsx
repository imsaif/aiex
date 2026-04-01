import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ResourcesGrid from '../../components/sections/ResourcesGrid';

export const metadata: Metadata = {
  title: 'Resources | AI UX Design Patterns, Tools, Downloads & Guides',
  description:
    'All AI UX design resources in one place. Interactive tools, downloadable kits, Figma prompts, designer guides, and learning paths for building better AI products.',
  openGraph: {
    title: 'Resources | AI UX Design Patterns',
    description:
      'Tools, downloads, prompts, and learning content for designing AI-powered products.',
    url: 'https://www.aiuxdesign.guide/resources',
    siteName: 'aiuxdesign.guide',
    type: 'website',
  },
};

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero Section - centered, matching patterns/news style */}
      <section className="pt-12 md:pt-16 pb-12 md:pb-16 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent-subtle text-accent-primary border border-info">
                Tools, Downloads & Learning
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6" style={{ color: 'var(--text-hero)' }}>
              AIUX Resources
            </h1>
            <p className="text-lg md:text-xl text-text-secondary">
              Everything you need to design better AI products. Interactive tools, downloadable kits,
              Figma prompts, and learning paths.
            </p>
          </div>
        </div>
      </section>

      <ResourcesGrid />

      {/* Bottom CTA */}
      <section className="border-t border-border-primary bg-surface-primary">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Not sure where to start?</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Run a quick audit of your AI product against all 36 patterns. You&apos;ll get a
            prioritized report with the highest-impact improvements.
          </p>
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-white dark:text-gray-900 rounded-full font-medium hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Start Pattern Audit
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
