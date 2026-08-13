import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import SavedItemsBar from '@/components/handoff/SavedItemsBar';
import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';
import LazyLogoCarousel from '@/components/ui/LazyLogoCarousel';
import PatternGrid from '../pattern-grid';
import patterns from '@/data/patterns';
import categories from '@/data/categories';
import { companyLogos } from '@/data/company-logos';
import { getAllProducts, getProductsForPattern } from '@/data/utils/product-utils';
import { getAllIndustries, getIndustriesForPattern } from '@/data/utils/industry-utils';
import { siteConfig } from '@/config/seo';
import type { PatternSummary } from '@/types';

// ISR so Googlebot hits the warm edge cache
export const revalidate = 86400;

export const metadata: Metadata = {
  title: {
    absolute: `${patterns.length} AI UX Design Patterns & Skills: A Framework for Designing AI Products`,
  },
  description:
    `${patterns.length} AI UX design patterns documented from ChatGPT, Claude, GitHub Copilot, Midjourney, Figma, Linear, and 50+ shipped AI products. Each pattern has real examples, code demos, and implementation guidance — use them to design AI experiences users actually trust.`,
  keywords: [
    'AI UX patterns',
    'AI design patterns',
    'AI UX design',
    'design patterns for AI',
    'AI interface design',
    'AI product design',
    'LLM UX patterns',
    'chatbot UX patterns',
    'generative AI UX',
    'AI UX framework',
  ],
  alternates: {
    canonical: `${siteConfig.url}/patterns`,
  },
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/patterns`,
    title: `${patterns.length} AI UX Design Patterns & Skills: A Framework for Designing AI Products`,
    description:
      `${patterns.length} AI UX design patterns from ChatGPT, Claude, GitHub Copilot, Midjourney, and 50+ shipped AI products. Real examples, code demos, implementation guidance.`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/images/og/og-home.png`,
        width: 1200,
        height: 630,
        alt: 'AI UX Design Patterns',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${patterns.length} AI UX Design Patterns & Skills: A Framework for Designing AI Products`,
    description:
      `${patterns.length} AI UX design patterns from ChatGPT, Claude, GitHub Copilot, Midjourney, and 50+ shipped AI products.`,
    images: [`${siteConfig.url}/images/og/og-home.png`],
    creator: siteConfig.creator.twitter,
  },
};

// Lightweight pattern summaries server-side to keep client bundle slim
const patternSummaries: PatternSummary[] = patterns.map((p) => ({
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

const collectionPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'AI UX Design Patterns',
  url: `${siteConfig.url}/patterns`,
  description: `${patterns.length} AI UX design patterns documented from 50+ real shipped AI products.`,
  isPartOf: {
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: patterns.length,
    itemListElement: patterns.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.title,
      url: `${siteConfig.url}/patterns/${p.slug}`,
    })),
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Patterns',
      item: `${siteConfig.url}/patterns`,
    },
  ],
};

export default function PatternsIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="min-h-screen bg-background-primary text-text-primary">
        <Navbar />

        {/* Hero — restored to the pre-swap homepage treatment: large H1,
            subhead, and the company-logo carousel as social proof. Server-
            rendered for fast LCP. */}
        <section className="pt-16 md:pt-20 pb-16 md:pb-20 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                style={{ color: 'var(--text-hero)', textWrap: 'balance' }}
              >
                {patterns.length} AI UX Design Patterns & Skills
              </h1>

              <p className="text-2xl md:text-3xl text-text-secondary mb-6">
                How the world&apos;s best AI products design their experiences, documented, analyzed, and continuously updated.
              </p>

              <p className="text-base text-text-secondary mb-12">
                Every pattern ships as a free Claude Code skill.{' '}
                <Link href="/skills" className="font-medium text-text-primary underline underline-offset-4">
                  Browse the skills directory
                </Link>
              </p>

              {/* Hero stays minimal on purpose: identity, one skills line, and
                  quiet social proof, then straight into the grid. Newsletter
                  capture lives in the signup section below the grid. */}
              <div>
                <p className="text-[9px] font-bold text-text-secondary uppercase tracking-tight mb-4">
                  Patterns used by leading companies
                </p>
                <LazyLogoCarousel companies={companyLogos} size="sm" gap="lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Pattern Grid — search + filters + responsive cards */}
        <PatternGrid
          patterns={patternSummaries}
          categories={categories}
          allProducts={allProducts}
          allIndustries={allIndustries}
        />

        {/* Newsletter signup — same placement and copy that lived on the old
            homepage to preserve the conversion surface for browsers. */}
        <section className="max-w-2xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-3">
            Daily AI UX news
          </h2>
          <InlineNewsletterSignup variant="hero" source="patterns" />
        </section>

        {/* SEO — keyword-rich server-rendered text for Googlebot */}
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <p className="text-base md:text-lg text-text-secondary text-center leading-relaxed">
            The AI UX design pattern library for product designers and teams building AI-powered experiences. Each pattern is documented from 3+ real implementations across products like ChatGPT, Claude, GitHub Copilot, Midjourney, Google, and Notion, with examples, code demos, and research-backed guidance you can apply today.
          </p>
        </div>

        {/* Raised above SavedItemsBar, which is fixed to the bottom on this route. */}
        <ScrollToTop bottom={88} />
        <SavedItemsBar />
        <Footer />
      </main>
    </>
  );
}
