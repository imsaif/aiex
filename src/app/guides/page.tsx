import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';
import { guides } from '@/data/guides';
import { learnMap } from '@/data/learn-map';
import { resolveLearnSection } from '@/lib/learn-map';
import LearnSection from '@/components/learn/LearnSection';
import LearnSidebar from '@/components/learn/LearnSidebar';
import LearnShell from '@/components/learn/LearnShell';
import { PATTERN_COUNT } from '@/data/pattern-count';
import { siteConfig } from '@/config/seo';

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
        <Navbar inConsole />

        {/* One two-column shell for the whole page. The rail starts at the
            top, beside the hero, rather than below a full-width hero band —
            that is what makes the learn area read as one place. */}
        <LearnShell sidebar={<LearnSidebar />}>

        {/* Hero — question-led, following the aihero.dev/learn model. The
            page opens by asking the visitor what they want to do rather than
            announcing what the site has; the numbered list doubles as the
            table of contents and jumps into the matching section. Questions
            come from learnMap so the hero cannot drift from the map below. */}
        <section className="border-b border-border-primary pb-12 pt-10 md:pb-16">
          {/* Capped measure. The column runs ~1200px; prose set that wide is
              tiring to read and is what made this page feel busy. Rows and
              grids below keep the full width. */}
          <div className="max-w-[950px]">
                <p className="type-eyebrow font-semibold text-accent-primary mb-4">
                  The Map
                </p>
                {/* "AI UX" is bound with a non-breaking space so the line can
                    never break between them, and balance keeps the wrap even
                    rather than leaving one short word on the last line. */}
                {/* type-h1, not type-display: at 56px the question wrapped to
                    two lines inside the 950px measure, and a two-line question
                    reads as a paragraph rather than a prompt. */}
                <h1
                  className="type-h1 mb-6"
                  style={{ color: 'var(--text-hero)', textWrap: 'balance' }}
                >
                  What do you want to learn about AI&nbsp;UX?
                </h1>
                <p className="type-lead text-text-secondary mb-4">
                  Pick the question that sounds like you. Each one opens onto
                  the courses, patterns and checklists that answer it.
                </p>
                <p className="type-caption text-text-secondary mb-10">
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

        {/* Supporting prose. Left-aligned on the same 950px measure and the
            same top rule as the map sections above — centred at a different
            width it read as a different page stapled on the end. */}
        <section className="border-t border-border-primary py-12 md:py-16">
          <div className="max-w-[950px]">
            <h2
              id="why-guides"
              className="type-h2 scroll-mt-24 text-text-primary mb-6"
            >
              Why guides
            </h2>
            <div className="type-body space-y-4 text-text-secondary">
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

          </div>
        </section>

        {/* FAQ — the visible counterpart the FAQPage markup requires. Same
            measure and rule as every other section. */}
        <section className="border-t border-border-primary py-12 md:py-16">
          <div className="max-w-[950px]">
            <h2
              id="faq"
              className="type-h2 scroll-mt-24 text-text-primary mb-8"
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="type-lead font-semibold text-text-primary mb-3">
                  Which AI tool should designers learn first?
                </h3>
                <p className="type-body text-text-secondary">
                  Start with Claude Code. It has the most forgiving learning
                  curve, works with Figma via MCP for design-to-code
                  workflows, and lets you describe what you want in plain
                  English instead of memorizing syntax. Cursor is great if
                  you already know a bit of code. GitHub Copilot is best for
                  people already using VS Code.
                </p>
              </div>
              <div>
                <h3 className="type-lead font-semibold text-text-primary mb-3">
                  Do I need to know how to code to use these guides?
                </h3>
                <p className="type-body text-text-secondary">
                  No. Every guide is written for designers with zero coding
                  background. We cover everything from terminal basics to
                  version control to shipping real prototypes. You describe
                  what you want to build; the AI handles the implementation
                  details.
                </p>
              </div>
              <div>
                <h3 className="type-lead font-semibold text-text-primary mb-3">
                  Are these guides really free?
                </h3>
                <p className="type-body text-text-secondary">
                  Yes, all guides are free. No email required to read them.
                  The tools themselves (Claude Code, Cursor, GitHub Copilot)
                  have free tiers, so we recommend starting with those and
                  upgrading only when you hit limits.
                </p>
              </div>
            </div>
          </div>
        </section>

        </LearnShell>

        <Footer />
        <ScrollToTop />
      </main>
    </>
  );
}
