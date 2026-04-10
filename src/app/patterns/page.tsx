import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';
import PatternGrid from '../pattern-grid';
import patterns from '@/data/patterns';
import categories from '@/data/categories';
import { getAllProducts, getProductsForPattern } from '@/data/utils/product-utils';
import { getAllIndustries, getIndustriesForPattern } from '@/data/utils/industry-utils';
import { siteConfig } from '@/config/seo';
import { PatternSummary } from '@/types';

// ISR so Googlebot hits the warm edge cache
export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: '36 AI UX Design Patterns — A Framework for Designing AI Products',
  },
  description:
    '36 AI UX design patterns documented from ChatGPT, Claude, GitHub Copilot, Midjourney, Figma, Linear, and 50+ shipped AI products. Each pattern has real examples, code demos, and implementation guidance — use them to design AI experiences users actually trust.',
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
    title: '36 AI UX Design Patterns — A Framework for Designing AI Products',
    description:
      '36 AI UX design patterns from ChatGPT, Claude, GitHub Copilot, Midjourney, and 50+ shipped AI products. Real examples, code demos, implementation guidance.',
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
    title: '36 AI UX Design Patterns — A Framework for Designing AI Products',
    description:
      '36 AI UX design patterns from ChatGPT, Claude, GitHub Copilot, Midjourney, and 50+ shipped AI products.',
    images: [`${siteConfig.url}/images/og/og-home.png`],
    creator: siteConfig.creator.twitter,
  },
};

// Reuse the same summary shape the homepage passes to PatternGrid
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

// Group patterns by category for the SEO-focused category-grouped listing
// (below the interactive filterable grid)
const patternsByCategory = categories.map((cat) => ({
  category: cat,
  patterns: patternSummaries.filter((p) => p.category === cat.title),
}));

function buildStructuredData() {
  return [
    // CollectionPage — tells Google this is a curated list of pattern pages
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'AI UX Design Patterns',
      url: `${siteConfig.url}/patterns`,
      description:
        '36 AI UX design patterns documented from 50+ real shipped AI products.',
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
    },
    // Breadcrumb
    {
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
    },
  ];
}

export default function PatternsIndexPage() {
  const structuredData = buildStructuredData();

  return (
    <>
      {structuredData.map((schema, i) => (
        <script
          key={`patterns-index-ld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="min-h-screen bg-background-primary text-text-primary">
        <Navbar />

        {/* Hero — server-rendered H1 + intro prose for SEO.
            Deliberately no framer-motion / no client-only widgets on first paint. */}
        <section className="pt-20 md:pt-28 pb-12 md:pb-16 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-primary mb-4">
              Pattern Library
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
              style={{ color: 'var(--text-hero)' }}
            >
              36 AI UX Design Patterns
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-6 leading-relaxed">
              A framework of 36 AI UX design patterns documented from ChatGPT,
              Claude, GitHub Copilot, Midjourney, Figma, Linear, and 50+ shipped
              AI products. Each pattern has real examples, code demos, and
              research-backed guidance you can apply today.
            </p>
            <p className="text-base text-text-secondary leading-relaxed">
              Browse by category, search by product, or filter by industry
              below.
            </p>
          </div>
        </section>

        {/* Category summary — indexable, link-rich, server-rendered */}
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-text-primary">
            Browse all {patterns.length} patterns by category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {patternsByCategory.map(({ category, patterns: catPatterns }) => (
              <div key={category.slug}>
                <h3 className="text-lg font-semibold mb-3 text-text-primary">
                  {category.title}
                  <span className="ml-2 text-sm font-normal text-text-secondary">
                    ({catPatterns.length})
                  </span>
                </h3>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  {category.description}
                </p>
                <ul className="space-y-1.5">
                  {catPatterns.map((p) => (
                    <li key={p.slug}>
                      <a
                        href={`/patterns/${p.slug}`}
                        className="text-sm text-text-secondary hover:text-accent-primary hover:underline transition-colors"
                      >
                        {p.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive filterable grid — the same one the homepage uses */}
        <PatternGrid
          patterns={patternSummaries}
          categories={categories}
          allProducts={allProducts}
          allIndustries={allIndustries}
        />

        {/* Newsletter CTA */}
        <div className="max-w-lg mx-auto px-6 py-16 md:py-20">
          <InlineNewsletterSignup
            variant="hero"
            customHeading="Get new patterns as they're added"
            customSubheading="Free. Weekly. Unsubscribe anytime."
            customButtonText="Subscribe"
            source="patterns-index"
          />
        </div>

        <Footer />
        <ScrollToTop />
      </main>
    </>
  );
}
