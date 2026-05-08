import { Metadata } from 'next';
import { getNewsletters, getAllTags } from '@/data/newsletters';
import { prisma } from '@/lib/prisma';
import NewsClient from './news-client';
import type { Newsletter } from '@/types';

export const metadata: Metadata = {
  title: 'AI UX News | Daily Updates on ChatGPT, Claude, Cursor & AI Design',
  description:
    'Track what\'s happening in AI products daily. UX-focused updates on ChatGPT, Claude, Gemini, Cursor and more — filtered for what designers need to know.',
  openGraph: {
    title: 'AI UX News | Daily Updates on ChatGPT, Claude, Cursor & AI Design',
    description:
      'Track what\'s happening in AI products daily. UX-focused updates on ChatGPT, Claude, Gemini, Cursor and more.',
    type: 'website',
    images: [{ url: '/api/og/page?slug=news', width: 1200, height: 630 }],
  },
};

// ISR with a short TTL + on-demand revalidatePath('/news') in publish/route.ts.
// force-dynamic killed the edge cache and caused LCP >4.5s; a 60s TTL serves
// cached HTML while admin publishes still propagate immediately via revalidatePath.
export const revalidate = 60;

const PRODUCT_KEYWORDS: Record<string, string[]> = {
  'ChatGPT': ['ChatGPT'],
  'Claude': ['Claude', 'Anthropic'],
  'Gemini': ['Gemini'],
  'Cursor': ['Cursor'],
  'Copilot': ['Copilot'],
  'Perplexity': ['Perplexity'],
  'Midjourney': ['Midjourney'],
  'Figma': ['Figma'],
  'v0': ['v0 '],
  'OpenAI': ['OpenAI'],
  'Google': ['Google AI', 'Google DeepMind'],
  'Meta': ['Meta AI', 'Llama'],
  'Apple': ['Apple Intelligence'],
};

function extractProducts(title: string, summary: string): string[] {
  const text = `${title} ${summary}`;
  return Object.entries(PRODUCT_KEYWORDS)
    .filter(([, keywords]) => keywords.some((kw) => text.includes(kw)))
    .map(([product]) => product);
}

async function getPublishedDrafts(): Promise<Newsletter[]> {
  try {
    // Project only the columns the list view renders. `structuredData`
    // (50-200KB JSON per row) and `sources`/`createdAt`/`updatedAt` aren't
    // used on /news — without an explicit `select`, Prisma streams them all
    // and the page took 800-1700ms cold. Cap at 60 rows since older
    // newsletters drop off the list anyway and the user can drill into a
    // specific slug if needed.
    const drafts = await prisma.newsletterDraft.findMany({
      where: { status: 'published' },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        content: true,
        publishDate: true,
        type: true,
      },
      orderBy: { publishDate: 'desc' },
      take: 60,
    });

    return drafts.map((draft) => ({
      id: draft.id,
      title: draft.title,
      slug: draft.slug,
      summary: draft.summary,
      content: draft.content,
      publishedAt: draft.publishDate.toISOString().split('T')[0],
      published: true,
      tags: [], // Auto-generated newsletters don't have curated tags
      type: (draft.type as 'daily' | 'weekly') || 'daily',
    }));
  } catch (error) {
    console.error('[News] CRITICAL: Failed to fetch published drafts — /news will render stale static fallback only.', error);
    return [];
  }
}

export default async function NewsPage() {
  // Get newsletters from static file
  const staticNewsletters = getNewsletters();

  // Get published drafts from database
  const dbNewsletters = await getPublishedDrafts();

  // Merge and deduplicate (prefer static file if slug exists in both)
  const staticSlugs = new Set(staticNewsletters.map((n) => n.slug));
  const uniqueDbNewsletters = dbNewsletters.filter((n) => !staticSlugs.has(n.slug));

  // Combine, enrich with products, and sort by date (newest first)
  const allNewsletters = [...staticNewsletters, ...uniqueDbNewsletters]
    .map((n) => ({ ...n, products: extractProducts(n.title, n.summary) }))
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      return dateB.getTime() - dateA.getTime();
    });

  const tags = getAllTags();

  const newsPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'AI UX News',
    description: 'Daily AI product updates for designers',
    url: 'https://www.aiuxdesign.guide/news',
    publisher: {
      '@type': 'Organization',
      name: 'AI UX Design Guide',
      url: 'https://www.aiuxdesign.guide',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsPageSchema) }}
      />
      <NewsClient initialNewsletters={allNewsletters} availableTags={tags} />
    </>
  );
}
