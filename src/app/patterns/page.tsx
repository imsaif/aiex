import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import patterns from '@/data/patterns';
import categories from '@/data/categories';
import { siteConfig } from '@/config/seo';

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

// Group patterns by category for the SEO-focused category-grouped listing.
// This is the core crawlable surface of the page — 36 real links grouped by
// their category so Google can index them and users can scan the library.
// The interactive filterable grid lives on the homepage (/) to avoid
// duplicating the same interface on two routes.
const patternsByCategory = categories.map((cat) => ({
  category: cat,
  patterns: patterns.filter((p) => p.category === cat.title),
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

        {/* Hero — server-rendered H1 + intro prose for SEO. */}
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
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-primary text-white dark:text-gray-900 font-medium hover:bg-accent-hover transition-colors"
            >
              Browse and filter all {patterns.length} patterns
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Category summary — indexable, link-rich, server-rendered.
            This is the primary crawlable surface of the page. */}
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-text-primary">
            Browse all {patterns.length} patterns by category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {patternsByCategory.map(({ category, patterns: catPatterns }) => (
              <div key={category.slug}>
                <h3 className="text-lg font-semibold mb-3 text-text-primary">
                  <Link
                    href={`/patterns/category/${category.slug}`}
                    className="hover:text-accent-primary transition-colors"
                  >
                    {category.title}
                  </Link>
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
                      <Link
                        href={`/patterns/${p.slug}`}
                        className="text-sm text-text-secondary hover:text-accent-primary hover:underline transition-colors"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <Footer />
        <ScrollToTop />
      </main>
    </>
  );
}
