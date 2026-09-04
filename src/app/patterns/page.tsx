import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import LearnSidebar from '@/components/learn/LearnSidebar';
import LearnShell from '@/components/learn/LearnShell';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import SavedItemsBar from '@/components/handoff/SavedItemsBar';
import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';
import LazyLogoCarousel from '@/components/ui/LazyLogoCarousel';
import { ClaudeMark } from '@/components/icons/ClaudeMark';
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
        <Navbar inConsole />

      {/* Learn console shell — same rail as /guides and the course pages, so
          Explore's own links do not drop you out of the area they belong to.
          Opened directly under the navbar so the rail runs the full length of
          the page rather than starting below a full-width hero. */}
      <LearnShell sidebar={<LearnSidebar active="patterns" />}>

        {/* Page header, not a hero. Left-aligned title, one line of
            description, then a meta row — the same shape the course and lesson
            pages use, so every page in the console opens the same way. The
            logo carousel and the email capture moved below the grid; they are
            supporting material, not the first thing to read. */}
        <header className="pt-10 pb-8 border-b border-border-primary">
          <h1
            className="type-h1 mb-3"
            style={{ color: 'var(--text-hero)', textWrap: 'balance' }}
          >
            {patterns.length} AI UX Design Patterns &amp; Skills
          </h1>
          <p className="type-lead mb-5 max-w-2xl text-text-secondary">
            How the world&apos;s best AI products design their experiences.
          </p>
          <p className="type-caption text-text-secondary">
            {patterns.length} patterns · {categories.length} categories · free,
            no account
          </p>
        </header>

        {/* Skills note — sits above the grid, sized to its own sentence rather
            than stretched across the page like a card. */}
        <div className="pt-8">
          <Link
            href="/skills"
            className="group inline-flex items-center gap-2.5 rounded-full border border-border-primary bg-surface-primary py-2 pl-3 pr-4 text-sm text-text-secondary hover:border-accent-primary transition-colors"
          >
            <ClaudeMark animated className="h-4 w-4 shrink-0 text-brand-claude" />
            <span>
              Every pattern below ships as a free Claude Code skill.{' '}
              <span className="font-medium text-accent-primary group-hover:text-accent-hover transition-colors">
                Browse the skills directory →
              </span>
            </span>
          </Link>
        </div>

        {/* Interactive Pattern Grid — search + filters + responsive cards */}
        <PatternGrid
          patterns={patternSummaries}
          categories={categories}
          allProducts={allProducts}
          allIndustries={allIndustries}
        />

        {/* Social proof + newsletter. Both were in the hero; they read
            better here, after someone has seen the patterns, and this is where
            the page's only remaining email capture lives — the hero carried a
            second, duplicate one. */}
        <section className="border-t border-border-primary py-16 md:py-20">
          <p className="type-eyebrow mb-4 text-center text-text-secondary">
            Patterns used by leading companies
          </p>
          <LazyLogoCarousel companies={companyLogos} size="sm" gap="lg" />

          <div className="mx-auto mt-14 max-w-2xl text-center">
          <h2 className="type-h2 text-text-primary mb-3">
            Daily AI UX news
          </h2>
          <InlineNewsletterSignup variant="hero" source="patterns-grid" />
          <p className="type-caption mt-4 text-text-secondary">
            Read by 1,500+ designers every month.
          </p>
          </div>
        </section>

        {/* SEO — keyword-rich server-rendered text for Googlebot */}
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <p className="text-base md:text-lg text-text-secondary text-center leading-relaxed">
            The AI UX design pattern library for product designers and teams building AI-powered experiences. Each pattern is documented from 3+ real implementations across products like ChatGPT, Claude, GitHub Copilot, Midjourney, Google, and Notion, with examples, code demos, and research-backed guidance you can apply today.
          </p>
        </div>

      </LearnShell>

        {/* Raised above SavedItemsBar, which is fixed to the bottom on this route. */}
        <ScrollToTop bottom={88} />
        <SavedItemsBar />
        <Footer />
      </main>
    </>
  );
}
