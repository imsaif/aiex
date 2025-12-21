import { Metadata } from 'next';
import { getNewsletters, getAllTags, tags as defaultTags } from '@/data/newsletters';
import { prisma } from '@/lib/prisma';
import NewsClient from './news-client';
import type { Newsletter } from '@/types';

export const metadata: Metadata = {
  title: 'Newsletter Archive | AI UX Design Patterns',
  description:
    'Browse our archive of newsletters covering AI design patterns, UX insights, and industry updates. Filter by tags and search for specific topics.',
  openGraph: {
    title: 'Newsletter Archive | AI UX Design Patterns',
    description:
      'Browse our archive of newsletters covering AI design patterns, UX insights, and industry updates.',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

async function getPublishedDrafts(): Promise<Newsletter[]> {
  try {
    const drafts = await prisma.newsletterDraft.findMany({
      where: { status: 'published' },
      orderBy: { publishDate: 'desc' },
    });

    // Convert database drafts to Newsletter format
    return drafts.map((draft) => ({
      id: draft.id,
      title: draft.title,
      slug: draft.slug,
      summary: draft.summary,
      content: draft.content,
      publishedAt: draft.publishDate.toISOString().split('T')[0],
      published: true,
      tags: defaultTags.filter((t) => t.slug === 'ai-design' || t.slug === 'ux-patterns'), // Default tags
    }));
  } catch {
    // If database is not available, return empty array
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

  // Combine and sort by date (newest first)
  const allNewsletters = [...staticNewsletters, ...uniqueDbNewsletters].sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });

  const tags = getAllTags();

  return <NewsClient initialNewsletters={allNewsletters} availableTags={tags} />;
}
