import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  AcademicCapIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';
import { guides } from '@/data/guides';
import { siteConfig } from '@/config/seo';

// Per-guide visual anchor — brand logo where available, generic chat icon for
// the conversational UI guide. Drops into the card header so the grid reads
// as an icon-led list rather than five identical text blocks.
type GuideIconConfig =
  | { src: string; alt: string }
  | { component: typeof ChatBubbleLeftRightIcon; alt: string };

const GUIDE_ICONS: Record<string, GuideIconConfig> = {
  'claude-code-learning-path': {
    src: '/images/logos/simple-icons/anthropic.svg',
    alt: 'Claude',
  },
  'claude-design-learning-path': {
    src: '/images/logos/simple-icons/claude-design.svg',
    alt: 'Claude Design',
  },
  'cursor-learning-path': {
    src: '/images/logos/simple-icons/cursor.svg',
    alt: 'Cursor',
  },
  'github-copilot-learning-path': {
    src: '/images/logos/simple-icons/githubcopilot.svg',
    alt: 'GitHub Copilot',
  },
  'github-learning-path': {
    src: '/images/logos/simple-icons/github.svg',
    alt: 'GitHub',
  },
  'conversational-ui-guide': {
    component: ChatBubbleLeftRightIcon,
    alt: 'Conversational UI',
  },
};

function GuideIconTile({ slug }: { slug: string }) {
  const meta = GUIDE_ICONS[slug];
  if (!meta) return null;
  return (
    <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-background-primary border border-gray-200 dark:border-gray-700">
      {'component' in meta ? (
        <meta.component
          className="w-6 h-6 text-text-primary"
          aria-hidden="true"
        />
      ) : (
        <Image
          src={meta.src}
          alt=""
          width={28}
          height={28}
          className="dark:invert"
        />
      )}
    </div>
  );
}

export const revalidate = 86400;

export const metadata: Metadata = {
  title: {
    absolute:
      'Free AI Tool Guides for Designers | Claude Code, Cursor, GitHub Copilot',
  },
  description:
    'Free learning paths for designers using AI tools. Step-by-step courses on Claude Code, Cursor, GitHub Copilot, GitHub, and conversational UI, no coding experience needed. Go from zero to shipping with AI.',
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
  'claude-design-learning-path': {
    tagline: 'Prompt to prototype',
    highlights: [
      'Prompts → clickable HTML prototypes',
      'Design system extracted from your codebase',
      'Handoff to Claude Code for implementation',
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
  'claude-design-learning-path',
  'github-learning-path',
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
            text: 'Yes, all guides are free. No email required to read them. The tools themselves (Claude Code, Cursor, GitHub Copilot) have free tiers, so we recommend starting with those and upgrading only when you hit limits.',
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

        {/* Hero — server-rendered. Typography + spacing scaled to match the
            homepage hero hierarchy (H1, subtitle, padding, margins). */}
        <section className="pt-16 md:pt-20 pb-16 md:pb-20 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-primary mb-4">
                Free Learning Paths
              </p>
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-9"
                style={{ color: 'var(--text-hero)' }}
              >
                AI Tool Guides for Designers
              </h1>
              <p className="text-2xl md:text-3xl text-text-secondary mb-12">
                Free step-by-step courses on Claude Code, Cursor, GitHub
                Copilot, GitHub, and conversational UI.
              </p>
              <p className="text-base text-text-secondary">
                {guides.length} guides · {guides.reduce((sum, g) => sum + (g.lessons?.length || 0), 0)} lessons ·
                All free, start instantly
              </p>

              {/* Hero email capture — mirrors the /news and /patterns hero
                  treatment (stacked form + social proof) for a consistent,
                  above-the-fold conversion surface. */}
              <div className="mt-10 max-w-md mx-auto">
                <InlineNewsletterSignup
                  variant="hero"
                  source="direct"
                  customSubheading="Get daily AI product updates, pattern breakdowns & design insights"
                  customButtonText="Solve my AI design overload →"
                  customSuccessMessage="You're in! Watch for our next issue."
                  stacked
                />
                <p className="text-base font-medium text-text-secondary mt-4">
                  46,000+ reads · 50+ products analyzed daily
                </p>
              </div>
            </div>
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
                  <GuideIconTile slug={card.slug} />
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
                  <GuideIconTile slug={card.slug} />
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

        {/* Intro prose — SEO content block, placed below the cards as
            supporting content so the hero-to-cards flow matches /patterns.
            Outer max-w-7xl matches the cards container above; inner max-w-3xl
            stays narrow for readability and is left-aligned so it lines up
            with the cards' left edge instead of floating mid-viewport. */}
        <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-16 pb-6 md:pb-8">
          <div className="max-w-3xl mx-auto">
            <h2
              id="why-guides"
              className="scroll-mt-24 text-2xl md:text-3xl font-bold text-text-primary mb-6"
            >
              Why guides
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-text-secondary leading-relaxed space-y-4">
              <p>
                The line between designer and developer is dissolving. Not
                because designers are learning to code in the traditional
                sense, but because AI has changed what &ldquo;building
                software&rdquo; means. You no longer need to memorize syntax,
                master APIs, or spend years on computer science fundamentals
                to participate in how your product actually gets built.
              </p>
              <p>
                These guides teach you the tools that make that possible,
                whether you want cleaner handoffs with engineers, faster
                prototypes, a clearer mental model of the technical decisions
                shaping your product, or just the confidence to make changes
                yourself. Each course is a sequential learning path you can
                work through end-to-end, and every lesson has its own page so
                you can bookmark, share, and return to specific steps
                whenever you need them.
              </p>
            </div>

            {/* 3-up benefit row — visual reinforcement of the three claims
                in the prose above. Centered cells, icon-tile design language
                shared with the guide cards so the page reads as one system. */}
            <ul className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <li className="flex flex-col items-center text-center">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-background-primary border border-gray-200 dark:border-gray-700">
                  <AcademicCapIcon
                    className="w-6 h-6 text-text-primary"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">
                  Built for designers
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  No coding background required. Each guide assumes a
                  designer starting point and lets the AI handle the syntax.
                </p>
              </li>
              <li className="flex flex-col items-center text-center">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-background-primary border border-gray-200 dark:border-gray-700">
                  <ClockIcon
                    className="w-6 h-6 text-text-primary"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">
                  Hours, not weeks
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Each course is a focused path you can work through in an
                  afternoon, no semester-long commitment to get fluent.
                </p>
              </li>
              <li className="flex flex-col items-center text-center">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-background-primary border border-gray-200 dark:border-gray-700">
                  <BookmarkIcon
                    className="w-6 h-6 text-text-primary"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">
                  Bookmark any lesson
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Every lesson has its own URL: save, share, or return to
                  the exact step you need without scrolling through a course.
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ — visible counterpart to the FAQPage JSON-LD above. Same
            container pattern as the intro: max-w-7xl outer, max-w-3xl inner
            left-aligned. Question h3s and answer p sizes bumped for
            readability and stronger hierarchy. */}
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <h2
              id="faq"
              className="scroll-mt-24 text-2xl md:text-3xl font-bold text-text-primary mb-8"
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  Which AI tool should designers learn first?
                </h3>
                <p className="text-base md:text-lg text-text-secondary leading-relaxed">
                  Start with Claude Code. It has the most forgiving learning
                  curve, works with Figma via MCP for design-to-code
                  workflows, and lets you describe what you want in plain
                  English instead of memorizing syntax. Cursor is great if
                  you already know a bit of code. GitHub Copilot is best for
                  people already using VS Code.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  Do I need to know how to code to use these guides?
                </h3>
                <p className="text-base md:text-lg text-text-secondary leading-relaxed">
                  No. Every guide is written for designers with zero coding
                  background. We cover everything from terminal basics to
                  version control to shipping real prototypes. You describe
                  what you want to build; the AI handles the implementation
                  details.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  Are these guides really free?
                </h3>
                <p className="text-base md:text-lg text-text-secondary leading-relaxed">
                  Yes, all guides are free. No email required to read them.
                  The tools themselves (Claude Code, Cursor, GitHub Copilot)
                  have free tiers, so we recommend starting with those and
                  upgrading only when you hit limits.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
        <ScrollToTop />
      </main>
    </>
  );
}
