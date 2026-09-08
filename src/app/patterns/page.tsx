import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import LearnSidebar from '@/components/learn/LearnSidebar';
import LearnShell from '@/components/learn/LearnShell';
import ConsoleSignup from '@/components/learn/ConsoleSignup';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import SavedItemsBar from '@/components/handoff/SavedItemsBar';
import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';
import LazyLogoCarousel from '@/components/ui/LazyLogoCarousel';
import { ClaudeMark } from '@/components/icons/ClaudeMark';
import { NewspaperIcon } from '@heroicons/react/24/outline';
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

        {/* Page header, not a hero. It says one thing: what this page is.

            The email capture used to live in here — first as a tinted card in
            the top right, then as a bare second column — and both split the
            opening beat between the title and an offer. It now has its own
            band underneath. The skills line stays, because it describes the
            library itself and belongs with the counts rather than as a stray
            banner above the grid. */}
        <header className="border-b border-border-primary pt-16 pb-12">
          <div>
            <div>
              {/* Four things in this column, and they used to arrive as three
                  muted lines of near-identical size under one heading, so the
                  eye had nothing to rank. Now each level differs on two axes
                  at once — size and treatment — and the gaps grow with the
                  drop in importance: title, then a lead at half its size,
                  then the counts set as a tracked eyebrow so they read as
                  metadata rather than as more prose, then the skills link.

                  The heading also gets its leading opened from the token's
                  1.15: that value is tuned for a single line, and over two it
                  closes the lines up into a slab. */}
              {/* Each level steps down the token scale rather than sitting a
                  hair apart: display for the title, h3 at normal weight for
                  the lead, then the counts as a tracked eyebrow. Leading is
                  opened on both large sizes — the display token's 1.05 and the
                  h1's 1.15 are tuned for a single line and close multi-line
                  text into a slab — and the gaps widen as importance drops, so
                  the block reads as a hierarchy rather than a stack. */}
              {/* No max-width and no balancing: the title is meant to run as a
                  single line across the content column at desktop widths.
                  Both a measure and `text-wrap: balance` would break it into
                  two. It still wraps naturally on narrow screens. */}
              <h1
                className="type-display mb-6 leading-tight"
                style={{ color: 'var(--text-hero)' }}
              >
                {patterns.length} AI UX Design Patterns &amp; Skills
              </h1>
              <p className="type-h3 mb-9 max-w-2xl font-normal leading-relaxed text-text-secondary">
                How the world&apos;s best AI products design their experiences.
              </p>

              <p className="type-eyebrow uppercase text-text-secondary">
                {patterns.length} patterns · {categories.length} categories ·
                free, no account
              </p>

              {/* A block, not a loose line. As bare text under the eyebrow it
                  read as a fourth muted sentence in the stack — easy to skim
                  past, and oddly placed, since it is an offer rather than more
                  description of the page. Boxed, with the mark set in its own
                  frame, it reads as a thing you can act on and sits at a
                  different altitude from the copy above it. */}
              <Link
                href="/skills"
                className="group mt-8 flex max-w-2xl items-start gap-4 rounded-card border border-border-primary p-loose transition-colors hover:border-accent-primary/40"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-card border border-border-primary">
                  <ClaudeMark
                    animated
                    className="h-4 w-4 shrink-0 text-brand-claude"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="type-body block font-semibold text-text-primary">
                    Every pattern ships as a free Claude Code skill
                  </span>
                  <span className="type-caption block text-text-secondary">
                    Install one and your agent applies that pattern on its own,
                    without being asked.
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="type-body shrink-0 text-text-secondary transition-colors group-hover:text-accent-primary"
                >
                  →
                </span>
              </Link>
            </div>

          </div>
        </header>

        {/* The email offer, on its own line under the header rather than inside
            it. In the header it was a second thing competing with the title
            for the opening beat, whichever way it was dressed - a tinted card
            read as a widget dropped in the corner, and a bare second column
            still split the eye at the exact moment the page should be saying
            one thing. As its own band it is unmistakably secondary, and it
            gets the full width instead of a 380px sliver. */}
        <section className="flex flex-col gap-snug border-b border-border-primary py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-loose">
          {/* One line, not a heading over a subheading. A two-line label for a
              single input restated the same offer twice and gave a secondary
              band the type hierarchy of a section. The newspaper mark — the
              same one the nav uses for News — carries what the heading was
              doing, in the space of a character. */}
          <p className="flex items-center gap-2.5 type-caption text-text-secondary">
            <NewspaperIcon
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-text-secondary"
            />
            Daily AI UX news and pattern breakdowns, straight to your inbox.
          </p>
          <ConsoleSignup
            source="patterns-hero"
            className="w-full lg:max-w-md"
            subheading=""
          />
        </section>

        {/* Interactive Pattern Grid — search + filters + responsive cards */}
        <PatternGrid
          patterns={patternSummaries}
          categories={categories}
          allProducts={allProducts}
          allIndustries={allIndustries}
        />

        {/* Social proof. The email capture that used to sit under it moved to
            the page header — one in-page form is enough, and these logos are
            the only place the proof appears. */}
        <section className="border-t border-border-primary py-16 md:py-20">
          <p className="type-eyebrow mb-4 text-center text-text-secondary">
            Patterns used by leading companies
          </p>
          <LazyLogoCarousel companies={companyLogos} size="sm" gap="lg" />

          <div className="mx-auto mt-10 max-w-2xl text-center">
          <p className="type-caption text-text-secondary">
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
