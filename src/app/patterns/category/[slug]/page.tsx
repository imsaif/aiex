import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import SavedItemsBar from '@/components/handoff/SavedItemsBar';
import patterns from '@/data/patterns';
import categories from '@/data/categories';
import { siteConfig } from '@/config/seo';
import type { Category } from '@/types';
import { PATTERN_COUNT } from '@/data/pattern-count';

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Hand-tuned SEO metadata per category. These target specific long-tail
 * queries instead of a generic "{Category} Patterns" template. Keys match
 * category slugs in src/data/categories.ts.
 */
const customCategoryMetadata: Record<
  string,
  { title: string; description: string; intro: string; keywords: string[] }
> = {
  'adaptive-intelligent-systems': {
    title:
      'Adaptive & Intelligent AI Patterns — UX for Personalized, Context-Aware AI',
    description:
      'Design AI interfaces that adapt to individual users in real time. Patterns for personalization, predictive behavior, ambient intelligence, and guided learning — with real examples from Spotify, Notion, Netflix, and Apple.',
    intro:
      'Adaptive intelligent systems learn user behavior and adjust the interface to match. These patterns show how to design AI that personalizes without being creepy, anticipates without being wrong, and teaches without being condescending.',
    keywords: [
      'adaptive AI UX',
      'personalization patterns',
      'predictive interfaces',
      'ambient intelligence design',
      'context-aware AI',
    ],
  },
  'human-ai-collaboration': {
    title: 'Human-AI Collaboration Patterns — UX for Working With AI',
    description:
      'Design AI that works with humans, not for them. Patterns for augmented creation, collaborative editing, agent handoffs, human-in-the-loop approval, and mixed-initiative control. Real examples from GitHub Copilot, Figma, Notion, and Claude.',
    intro:
      'Human-AI collaboration patterns define how control is shared between people and AI. These patterns cover when AI should act, when it should ask, and how it should hand off gracefully — the design decisions that make AI feel like a teammate instead of a tool.',
    keywords: [
      'human AI collaboration',
      'copilot UX patterns',
      'AI agent handoff',
      'human in the loop design',
      'mixed initiative UI',
    ],
  },
  'trustworthy-reliable-ai': {
    title: 'Trustworthy AI Design Patterns — UX for Transparent, Reliable AI',
    description:
      'Design AI users can actually trust. Patterns for explainable AI, confidence visualization, trust calibration, error recovery, safe exploration, and action audit trails. Real examples from healthcare AI, GitHub Copilot, and Midjourney.',
    intro:
      'Trustworthy AI patterns are the UX primitives for building AI that communicates its limits honestly. These patterns cover how to show confidence, explain decisions, recover from errors, and build calibrated trust — the difference between users who rely on AI and users who override it on every task.',
    keywords: [
      'trustworthy AI design',
      'explainable AI UX',
      'AI confidence scores',
      'AI trust calibration',
      'responsible AI patterns',
    ],
  },
  'natural-interaction': {
    title:
      'Natural Interaction AI Patterns — Chat, Voice, Multimodal & Progressive Disclosure',
    description:
      'Design AI that feels natural to use. Patterns for conversational UI, multimodal input, context switching, and progressive disclosure. Real examples from ChatGPT, Claude, Siri, and Google Lens with implementation guidance.',
    intro:
      'Natural interaction patterns are about removing friction between human intent and AI response. Chat, voice, gesture, text, image — these patterns show how to design interfaces where users express themselves the way they want, and the AI meets them where they are.',
    keywords: [
      'conversational UI patterns',
      'multimodal AI design',
      'chat interface design',
      'voice AI UX',
      'progressive disclosure AI',
    ],
  },
  'performance-efficiency': {
    title: 'AI Performance & Efficiency Patterns — Fast, Resilient AI UX',
    description:
      'Design AI products that stay fast and usable under real conditions. Patterns for intelligent caching, progressive enhancement, graceful degradation, and agent status monitoring. Real implementation examples and code demos.',
    intro:
      'Performance and efficiency patterns address what happens when AI is slow, offline, or overloaded. These patterns show how to design for latency, build fallbacks, cache predictively, and keep users informed without creating panic.',
    keywords: [
      'AI performance UX',
      'intelligent caching patterns',
      'progressive enhancement AI',
      'AI fallback design',
      'agent monitoring UX',
    ],
  },
  'privacy-control': {
    title:
      'AI Privacy & Control Patterns — Let Users Own What AI Knows About Them',
    description:
      'Design AI that respects privacy and gives users real control. Patterns for privacy-first design, selective memory, data minimization, and consent UX. Real examples from Apple, Signal, DuckDuckGo, and Anthropic.',
    intro:
      'Privacy and control patterns define how AI products collect, remember, and forget. These patterns cover on-device processing, user-controlled memory, granular consent, and the small design choices that make users feel safe sharing data — or justifiably suspicious when they should.',
    keywords: [
      'AI privacy UX',
      'privacy first AI',
      'AI memory controls',
      'data minimization UX',
      'consent design AI',
    ],
  },
  'accessibility-inclusion': {
    title: 'Accessible AI Design Patterns — Inclusive UX for Diverse Users',
    description:
      'Design AI interfaces that work for everyone. Universal access patterns for screen readers, motor impairments, cognitive accessibility, and inclusive interaction design. WCAG-aligned guidance with real examples.',
    intro:
      'Accessibility and inclusion patterns make AI usable across the full range of human ability and context. These patterns show how to design AI that doesn\'t assume a default user — how to accommodate screen readers, voice-only users, cognitive variance, and edge cases that mainstream AI products routinely fail.',
    keywords: [
      'accessible AI design',
      'inclusive AI UX',
      'WCAG AI patterns',
      'AI for screen readers',
      'universal design AI',
    ],
  },
  'safety-patterns-nextjs-implementation': {
    title:
      'AI Safety & Harm Prevention Patterns — Design for At-Risk Users and Crisis Moments',
    description:
      'Design AI that protects users in sensitive situations. Patterns for crisis detection, anti-manipulation safeguards, session degradation prevention, and vulnerable user protection. Guidance for mental health, safety, and high-stakes AI products.',
    intro:
      'Safety and harm prevention patterns address the hardest parts of AI design — moments when a user is in crisis, manipulable, or vulnerable. These patterns cover detection, escalation, guardrails, and the specific UX decisions that separate products that help from products that harm.',
    keywords: [
      'AI safety UX',
      'anti-manipulation design',
      'AI crisis detection',
      'vulnerable user protection',
      'safe AI design',
    ],
  },
};

function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return { title: 'Category Not Found' };
  }
  const custom = customCategoryMetadata[slug];
  const pageUrl = `${siteConfig.url}/patterns/category/${slug}`;

  return {
    title: custom
      ? { absolute: custom.title }
      : `${category.title} — AI UX Patterns`,
    description: custom?.description || category.description,
    keywords: custom?.keywords,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'website',
      url: pageUrl,
      title: custom?.title || `${category.title} — AI UX Patterns`,
      description: custom?.description || category.description,
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}/images/og/og-home.png`,
          width: 1200,
          height: 630,
          alt: category.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: custom?.title || `${category.title} — AI UX Patterns`,
      description: custom?.description || category.description,
      images: [`${siteConfig.url}/images/og/og-home.png`],
      creator: siteConfig.creator.twitter,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const custom = customCategoryMetadata[slug];
  const categoryPatterns = patterns.filter((p) => p.category === category.title);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category.title} — AI UX Patterns`,
      url: `${siteConfig.url}/patterns/category/${slug}`,
      description: custom?.description || category.description,
      isPartOf: {
        '@type': 'WebSite',
        name: siteConfig.name,
        url: siteConfig.url,
      },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: categoryPatterns.length,
        itemListElement: categoryPatterns.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.title,
          url: `${siteConfig.url}/patterns/${p.slug}`,
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
          name: 'Patterns',
          item: `${siteConfig.url}/patterns`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category.title,
          item: `${siteConfig.url}/patterns/category/${slug}`,
        },
      ],
    },
  ];

  return (
    <>
      {structuredData.map((schema, i) => (
        <script
          key={`category-ld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="min-h-screen bg-background-primary text-text-primary">
        <Navbar />

        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto px-6 pt-20 md:pt-24">
          <nav className="text-sm text-text-secondary" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/patterns" className="hover:text-text-primary">
                  Patterns
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-text-primary font-medium">{category.title}</li>
            </ol>
          </nav>
        </div>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 pt-8 pb-12 md:pb-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-primary mb-4">
            Pattern Category
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {category.title}
          </h1>
          <p className="text-xl text-text-secondary mb-6 leading-relaxed max-w-3xl">
            {custom?.intro || category.description}
          </p>
          <p className="text-base text-text-secondary">
            {categoryPatterns.length}{' '}
            {categoryPatterns.length === 1 ? 'pattern' : 'patterns'} in this
            category
          </p>
        </section>

        {/* Patterns in this category */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryPatterns.map((pattern) => (
              <Link
                key={pattern.slug}
                href={`/patterns/${pattern.slug}`}
                className="block p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-surface-primary hover:border-accent-primary/40 hover:shadow-card-hover transition-all"
              >
                <h2 className="text-xl font-semibold mb-2 text-text-primary group-hover:text-accent-primary">
                  {pattern.title}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                  {pattern.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Back to all patterns */}
        <section className="max-w-5xl mx-auto px-6 pb-16 text-center">
          <Link
            href="/patterns"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
          >
            ← Browse all {PATTERN_COUNT} AI UX patterns
          </Link>
        </section>

        <Footer />
        {/* Raised above SavedItemsBar, which is fixed to the bottom on this route. */}
        <ScrollToTop bottom={88} />
        <SavedItemsBar />
      </main>
    </>
  );
}
