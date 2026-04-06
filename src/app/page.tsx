import { Metadata } from 'next';
import { generateHomeMetadata } from '@/utils/metadata';
import Navbar from '@/components/layout/Navbar';
import HeroAuditCTA from '@/components/audit/HeroAuditCTA';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';
import LazyLogoCarousel from '@/components/ui/LazyLogoCarousel';
import PatternGrid from './pattern-grid';
import patterns from '@/data/patterns';
import categories from '@/data/categories';
import { getAllProducts, getProductsForPattern } from '@/data/utils/product-utils';
import { getAllIndustries, getIndustriesForPattern } from '@/data/utils/industry-utils';
import { companyLogos } from '@/data/company-logos';
import { PatternSummary } from '@/types';

export const metadata: Metadata = generateHomeMetadata();

// Compute lightweight pattern summaries server-side to avoid sending
// full pattern data (code examples, guidelines, figma prompts) to the client
const patternSummaries: PatternSummary[] = patterns.map(p => ({
  id: p.id,
  title: p.title,
  slug: p.slug,
  description: p.description,
  category: p.category,
  tags: p.tags,
  thumbnail: p.thumbnail,
  products: getProductsForPattern(p),
  industries: getIndustriesForPattern(p),
}));

const allProducts = getAllProducts(patterns);
const allIndustries = getAllIndustries(patterns);

export default function Home() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero Section - Server-rendered for fast LCP */}
      <section className="pt-16 md:pt-20 pb-16 md:pb-20 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Heading - LCP element, renders immediately as server HTML */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-9" style={{ color: 'var(--text-hero)' }}>
              AI UX Design Patterns
            </h1>

            {/* Subheading */}
            <p className="text-2xl md:text-3xl text-text-secondary mb-12">
              How the world&apos;s best AI products design their experiences, documented, analyzed, and continuously updated.
            </p>

            {/* Company Logo Carousel - Social Proof Before CTA */}
            <div className="mb-12">
              <p className="text-[9px] font-bold text-text-secondary uppercase tracking-tight mb-4">
                Patterns used by leading companies
              </p>
              <LazyLogoCarousel companies={companyLogos} size="sm" gap="lg" />
            </div>

            {/* Audit CTA - Primary action (tracked via Clarity) */}
            <HeroAuditCTA />
          </div>
        </div>
      </section>

      {/* Intro Paragraph */}
      <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-16">
        <p className="text-base md:text-lg text-text-secondary text-center leading-relaxed">
          The AI UX design pattern library for product designers and teams building AI-powered experiences. Each pattern is documented from 3+ real implementations across products like ChatGPT, Claude, GitHub Copilot, Midjourney, Google, and Notion, with examples, code demos, and research-backed guidance you can apply today.
        </p>
      </div>

      {/* Interactive Pattern Grid - Client component */}
      <PatternGrid
        patterns={patternSummaries}
        categories={categories}
        allProducts={allProducts}
        allIndustries={allIndustries}
      />

      {/* Newsletter Signup - After patterns, before footer */}
      <div className="max-w-lg mx-auto px-6 py-16 md:py-20">
        <InlineNewsletterSignup
          variant="hero"
          customHeading="Stay up to date with AI UX"
          customSubheading="Daily AI/UX news and pattern insights. Unsubscribe anytime."
          customButtonText="Subscribe"
          source="homepage"
        />
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Footer */}
      <Footer />
    </main>
  );
}
