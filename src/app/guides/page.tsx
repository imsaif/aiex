import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  AcademicCapIcon,
  BoltIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';
import { guides } from '@/data/guides';
import { learnMap } from '@/data/learn-map';
import { resolveLearnSection } from '@/lib/learn-map';
import LearnSection from '@/components/learn/LearnSection';
import LearnSidebar from '@/components/learn/LearnSidebar';
import { PATTERN_COUNT } from '@/data/pattern-count';
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
  'ai-ux-skills-guide': {
    component: BoltIcon,
    alt: 'AI UX Skills',
  },
};

function GuideIconTile({ slug }: { slug: string }) {
  const meta = GUIDE_ICONS[slug];
  if (!meta) return null;
  return (
    <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-background-primary border border-border-primary">
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
  'ai-ux-skills-guide': {
    tagline: 'Your agent, trained',
    highlights: [
      'Claude Code from zero: install and first session',
      'Install a pack: zip or one-file installer',
      'Triggering: symptom-first, no prompting',
    ],
  },
};

const cards: GuideCard[] = guides.map((g) => ({
  slug: g.slug,
  title: g.title,
  tool: g.tool,
  tagline: guideMeta[g.slug]?.tagline || '',
  highlights: guideMeta[g.slug]?.highlights || [],
  lessons: g.lessons?.length || 0,
  readTime: g.readTime || 0,
}));

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

export default async function GuidesPage() {
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

        {/* One two-column shell for the whole page. The rail starts at the
            top, beside the hero, rather than below a full-width hero band —
            that is what makes the learn area read as one place. */}
        <div className="max-w-7xl mx-auto px-6 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
          <LearnSidebar />
          <div className="min-w-0">

        {/* Hero — question-led, following the aihero.dev/learn model. The
            page opens by asking the visitor what they want to do rather than
            announcing what the site has; the numbered list doubles as the
            table of contents and jumps into the matching section. Questions
            come from learnMap so the hero cannot drift from the map below. */}
        <section className="border-b border-border-primary pb-12 pt-10 md:pb-16">
          <div className="max-w-3xl">
                <p className="type-eyebrow font-semibold text-accent-primary mb-4">
                  The Map
                </p>
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                  style={{ color: 'var(--text-hero)' }}
                >
                  What do you want to do with AI UX?
                </h1>
                <p className="text-xl md:text-2xl text-text-secondary mb-4">
                  Pick the question that sounds like you. Each one opens onto
                  the courses, patterns and checklists that answer it, in the
                  order they make sense.
                </p>
                <p className="type-body text-text-secondary mb-10">
                  {guides.length} courses ·{' '}
                  {guides.reduce((sum, g) => sum + (g.lessons?.length || 0), 0)}{' '}
                  lessons · {PATTERN_COUNT} patterns · all free, no account
                </p>

                {/* Boxed chips in two columns, matching the reference. Each
                    jumps to its section; the arrow says "this goes down the
                    page" rather than off to another page. */}
                <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {learnMap.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="group flex h-full items-center gap-3 rounded-card border border-border-primary bg-surface-primary px-4 py-4 transition-colors hover:border-accent-primary/40"
                      >
                        <span
                          aria-hidden="true"
                          className="type-eyebrow font-mono text-text-secondary"
                        >
                          {section.ordinal}
                        </span>
                        <span className="type-body flex-1 font-semibold text-text-primary group-hover:text-accent-primary">
                          {section.question}
                        </span>
                        <span
                          aria-hidden="true"
                          className="type-body text-text-secondary group-hover:text-accent-primary"
                        >
                          ↓
                        </span>
                      </a>
                    </li>
                  ))}
            </ol>
          </div>
        </section>

        {/* The Learn Map — five questions, each opening onto the content that
            answers it, in the order it makes sense. Resolved server-side; the
            resolver throws on a dead slug so this can never render a card
            pointing at a 404. */}
        <div>
          {learnMap.map((section) => (
            <LearnSection
              key={section.id}
              section={resolveLearnSection(section)}
            />
          ))}
        </div>

        {/* Newsletter — placed after the map rather than in the hero. The
            hero's job is now navigation: read the question, pick a path. An
            email form there competes with that. By this point the visitor has
            either found their path or has not, and both are reasonable moments
            to offer a weekly digest. */}
        <section className="border-t border-border-primary py-12 md:py-16">
          <div className="rounded-card border border-border-primary bg-surface-primary p-6 md:grid md:grid-cols-2 md:items-center md:gap-10 md:p-8">
            <div>
              <p className="type-h3 text-text-primary">
                Not sure where to start?
              </p>
              <p className="type-body text-text-secondary mt-1">
                46,000+ reads · 50+ products analyzed daily
              </p>
            </div>
            <div className="mt-4 w-full md:mt-0">
              <InlineNewsletterSignup
                variant="hero"
                source="guides"
                customSubheading="Get daily AI product updates, pattern breakdowns & design insights"
                customButtonText="Solve my AI design overload →"
                customSuccessMessage="You're in! Watch for our next issue."
                stacked
              />
            </div>
          </div>
        </section>

        {/* All courses — the catalogue view. The map above is the
            recommendation; this is the complete list, and it is what
            guarantees every course keeps an internal link from this page
            however the curation is edited. Also the target for the map
            sections' "more" links. */}
        <section
          id="all-courses"
          className="py-12 md:py-16 scroll-mt-24"
        >
          <div className="mb-8 max-w-3xl">
            <h2 className="type-h2 text-text-primary mb-2">All courses</h2>
            <p className="type-body text-text-secondary">
              Every learning path on the site, {guides.length} in total. Free,
              no account needed.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cards.map((card) => (
              <Link
                key={card.slug}
                href={`/guides/${card.slug}`}
                className="block p-8 rounded-card border border-border-primary bg-surface-primary hover:border-accent-primary/40 hover:shadow-lg transition-all"
              >
                <GuideIconTile slug={card.slug} />
                <p className="type-caption font-medium text-accent-primary mb-1">
                  {card.tagline}
                </p>
                <h3 className="type-h3 text-text-primary mb-4">{card.title}</h3>
                {card.highlights.length > 0 && (
                  <ul className="space-y-2 mb-5">
                    {card.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 type-body text-text-secondary"
                      >
                        <span className="w-1.5 h-1.5 rounded-pill bg-accent-primary flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex items-center gap-4 type-body text-text-secondary pt-4 border-t border-border-primary">
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

        {/* Intro prose — SEO content block, placed below the cards as
            supporting content so the hero-to-cards flow matches /patterns.
            Outer max-w-7xl matches the cards container above; inner max-w-3xl
            stays narrow for readability and is left-aligned so it lines up
            with the cards' left edge instead of floating mid-viewport. */}
        <section className="pt-12 md:pt-16 pb-6 md:pb-8">
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
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-background-primary border border-border-primary">
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
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-background-primary border border-border-primary">
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
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-background-primary border border-border-primary">
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
        <section className="py-12 md:py-16">
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

        </div>
        </div>

        <Footer />
        <ScrollToTop />
      </main>
    </>
  );
}
