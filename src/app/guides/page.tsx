import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { guides } from '@/data/guides';
import { siteConfig } from '@/config/seo';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute:
      'Free AI Tool Guides for Designers — Claude Code, Cursor, GitHub Copilot',
  },
  description:
    'Free learning paths for designers using AI tools. Step-by-step courses on Claude Code, Cursor, GitHub Copilot, GitHub, and conversational UI — no coding experience needed. Go from zero to shipping with AI.',
  keywords: [
    'AI tools for designers',
    'claude code for designers',
    'cursor for designers',
    'github copilot for designers',
    'AI design tutorials',
    'learn AI tools',
    'designer to developer',
    'design with AI',
    'AI learning path designer',
    'figma MCP',
  ],
  alternates: {
    canonical: `${siteConfig.url}/guides`,
  },
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/guides`,
    title: 'Free AI Tool Guides for Designers',
    description:
      'Free learning paths for designers using Claude Code, Cursor, GitHub Copilot, and more. No coding experience needed.',
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/images/og/og-home.png`,
        width: 1200,
        height: 630,
        alt: 'AI Tool Guides for Designers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Tool Guides for Designers',
    description:
      'Free learning paths for designers using Claude Code, Cursor, GitHub Copilot, and more.',
    images: [`${siteConfig.url}/images/og/og-home.png`],
    creator: siteConfig.creator.twitter,
  },
};

// Pre-computed card data so the server component can render without touching
// the heavier client-side guide utilities (framer-motion, icons, etc.).
interface GuideCard {
  slug: string;
  title: string;
  tool: string;
  tagline: string;
  highlights: string[];
  lessons: number;
  readTime: number;
  featured: boolean;
}

const guideMeta: Record<
  string,
  { tagline: string; highlights: string[] }
> = {
  'claude-code-learning-path': {
    tagline: 'Start Here',
    highlights: [
      'Figma MCP design-to-code',
      'AI-powered prototyping',
      'Version control basics',
    ],
  },
  'cursor-learning-path': {
    tagline: 'AI-native code editor',
    highlights: [
      'Tab autocomplete & AI suggestions',
      'Chat & Composer for code generation',
      'Design-to-code workflows',
    ],
  },
  'github-copilot-learning-path': {
    tagline: 'AI pair programmer',
    highlights: [
      'Inline code suggestions',
      'AI pair programming',
      'Works in VS Code, JetBrains & more',
    ],
  },
  'github-learning-path': {
    tagline: 'Version control fundamentals',
    highlights: [
      'Git basics for designers',
      'Pull requests & code review',
      'Team collaboration workflows',
    ],
  },
  'conversational-ui-guide': {
    tagline: 'Design & implementation',
    highlights: [
      'Chat bubbles, streaming & typing indicators',
      'Context management & error recovery',
      'Agentic AI patterns & accessibility',
    ],
  },
};

const featuredSlugs = new Set([
  'claude-code-learning-path',
  'conversational-ui-guide',
]);

const cards: GuideCard[] = guides.map((g) => ({
  slug: g.slug,
  title: g.title,
  tool: g.tool,
  tagline: guideMeta[g.slug]?.tagline || '',
  highlights: guideMeta[g.slug]?.highlights || [],
  lessons: g.lessons?.length || 0,
  readTime: g.readTime || 0,
  featured: featuredSlugs.has(g.slug),
}));

const featuredCards = cards.filter((c) => c.featured);
const otherCards = cards.filter((c) => !c.featured);

function buildStructuredData() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'AI Tool Guides for Designers',
      url: `${siteConfig.url}/guides`,
      description:
        'Free learning paths for designers using AI tools: Claude Code, Cursor, GitHub Copilot, GitHub, and conversational UI.',
      isPartOf: {
        '@type': 'WebSite',
        name: siteConfig.name,
        url: siteConfig.url,
      },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: guides.length,
        itemListElement: guides.map((g, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: g.title,
          url: `${siteConfig.url}/guides/${g.slug}`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Guides',
          item: `${siteConfig.url}/guides`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Which AI tool should designers learn first?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Start with Claude Code. It has the most forgiving learning curve, works with Figma via MCP for design-to-code workflows, and lets you describe what you want in plain English instead of memorizing syntax. Cursor is great if you already know a bit of code. GitHub Copilot is best for people already using VS Code.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to know how to code to use these guides?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Every guide is written for designers with zero coding background. We cover everything from terminal basics to version control to shipping real prototypes. You describe what you want to build; the AI handles the implementation details.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are these guides really free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, all guides are free. No email required to read them. The tools themselves (Claude Code, Cursor, GitHub Copilot) have free tiers — we recommend starting with those and upgrading only when you hit limits.',
          },
        },
      ],
    },
  ];
}

export default function GuidesPage() {
  const structuredData = buildStructuredData();

  return (
    <>
      {structuredData.map((schema, i) => (
        <script
          key={`guides-index-ld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="min-h-screen bg-background-primary text-text-primary">
        <Navbar />

        {/* Hero — server-rendered H1 + intro prose */}
        <section className="pt-20 md:pt-28 pb-8 md:pb-12 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-primary mb-4">
                Free Learning Paths
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                AI Tool Guides for Designers
              </h1>
              <p className="text-xl text-text-secondary mb-4 leading-relaxed">
                Free step-by-step courses on Claude Code, Cursor, GitHub
                Copilot, GitHub, and conversational UI. No coding experience
                needed.
              </p>
              <p className="text-base text-text-secondary">
                {guides.length} guides · {guides.reduce((sum, g) => sum + (g.lessons?.length || 0), 0)} lessons ·
                All free, no signup required
              </p>
            </div>
          </div>
        </section>

        {/* Intro prose — SEO content block */}
        <section className="max-w-3xl mx-auto px-6 pt-12 md:pt-16 pb-6">
          <div className="prose prose-lg dark:prose-invert max-w-none text-text-secondary leading-relaxed">
            <p>
              The line between designer and developer is dissolving. Not
              because designers are learning to code in the traditional sense,
              but because AI has changed what &ldquo;building software&rdquo;
              means. You no longer need to memorize syntax, master APIs, or
              spend years on computer science fundamentals before you can ship
              something real.
            </p>
            <p>
              These guides teach you the tools that make that possible. Each
              course is structured as a sequential learning path — start at
              lesson 1, work through to the end, and you&rsquo;ll go from
              &ldquo;I don&rsquo;t write code&rdquo; to &ldquo;I just shipped
              a working prototype&rdquo; in a few hours. Every lesson has its
              own page so you can bookmark, share, and return to specific
              steps whenever you need them.
            </p>
          </div>
        </section>

        {/* Featured guides */}
        {featuredCards.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-12 md:py-16 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent-subtle text-accent-primary border border-accent-primary/20">
                Recommended Start
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredCards.map((card) => (
                <Link
                  key={card.slug}
                  href={`/guides/${card.slug}`}
                  className="block p-8 rounded-3xl border border-gray-200 dark:border-gray-700 bg-surface-secondary hover:border-accent-primary/40 hover:shadow-lg transition-all"
                >
                  <p className="text-sm font-medium text-accent-primary mb-1">
                    {card.tagline}
                  </p>
                  <h2 className="text-2xl font-bold text-text-primary mb-4">
                    {card.title}
                  </h2>
                  {card.highlights.length > 0 && (
                    <ul className="space-y-2 mb-5">
                      {card.highlights.map((h, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-text-secondary"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-primary flex-shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex items-center gap-4 text-sm text-text-secondary pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span>{card.lessons} lessons</span>
                    <span aria-hidden="true">·</span>
                    <span>{card.readTime} min total</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-accent-primary">
                      Start Learning →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* More guides */}
        {otherCards.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                More Guides
              </h2>
              <p className="text-text-secondary">
                Other AI tools to expand your workflow
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {otherCards.map((card) => (
                <Link
                  key={card.slug}
                  href={`/guides/${card.slug}`}
                  className="block p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-surface-primary hover:border-accent-primary/40 hover:shadow-lg transition-all"
                >
                  <p className="text-sm font-medium text-accent-primary mb-1">
                    {card.tagline}
                  </p>
                  <h3 className="text-xl font-bold text-text-primary mb-4">
                    {card.title}
                  </h3>
                  {card.highlights.length > 0 && (
                    <ul className="space-y-2 mb-5">
                      {card.highlights.map((h, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-text-secondary"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-primary flex-shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex items-center gap-4 text-sm text-text-secondary pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span>{card.lessons} lessons</span>
                    <span aria-hidden="true">·</span>
                    <span>{card.readTime} min total</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-accent-primary">
                      Start Learning →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ — visible counterpart to the FAQPage JSON-LD above */}
        <section className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Which AI tool should designers learn first?
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Start with Claude Code. It has the most forgiving learning
                curve, works with Figma via MCP for design-to-code workflows,
                and lets you describe what you want in plain English instead
                of memorizing syntax. Cursor is great if you already know a
                bit of code. GitHub Copilot is best for people already using
                VS Code.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Do I need to know how to code to use these guides?
              </h3>
              <p className="text-text-secondary leading-relaxed">
                No. Every guide is written for designers with zero coding
                background. We cover everything from terminal basics to
                version control to shipping real prototypes. You describe
                what you want to build; the AI handles the implementation
                details.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Are these guides really free?
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Yes, all guides are free. No email required to read them. The
                tools themselves (Claude Code, Cursor, GitHub Copilot) have
                free tiers — we recommend starting with those and upgrading
                only when you hit limits.
              </p>
            </div>
          </div>
        </section>

        <Footer />
        <ScrollToTop />
      </main>
    </>
  );
}
