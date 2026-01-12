import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getNewsletterBySlug,
  getNewsletters,
  getAdjacentNewsletters,
  tags as defaultTags,
} from '@/data/newsletters';
import { prisma } from '@/lib/prisma';
import NewsletterDetailClient from './newsletter-detail-client';
import type { Newsletter } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

async function getNewsletterFromDb(slug: string): Promise<Newsletter | undefined> {
  try {
    const draft = await prisma.newsletterDraft.findFirst({
      where: { slug, status: 'published' },
    });

    if (!draft) return undefined;

    return {
      id: draft.id,
      title: draft.title,
      slug: draft.slug,
      summary: draft.summary,
      content: draft.content,
      publishedAt: draft.publishDate.toISOString().split('T')[0],
      published: true,
      tags: defaultTags.filter((t) => t.slug === 'ai-design' || t.slug === 'ux-patterns'),
    };
  } catch {
    return undefined;
  }
}

export function generateStaticParams() {
  const newsletters = getNewsletters();
  return newsletters.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let newsletter = getNewsletterBySlug(slug);

  // Try database if not in static file
  if (!newsletter) {
    newsletter = await getNewsletterFromDb(slug);
  }

  if (!newsletter) {
    return { title: 'Newsletter Not Found' };
  }

  return {
    title: `${newsletter.title} | AI UX Newsletter`,
    description: newsletter.summary,
    openGraph: {
      title: newsletter.title,
      description: newsletter.summary,
      type: 'article',
      publishedTime: new Date(newsletter.publishedAt).toISOString(),
    },
  };
}

export default async function NewsletterPage({ params }: PageProps) {
  const { slug } = await params;
  let newsletter = getNewsletterBySlug(slug);

  // Try database if not in static file
  if (!newsletter) {
    newsletter = await getNewsletterFromDb(slug);
  }

  if (!newsletter) {
    notFound();
  }

  // Redirect to news list if newsletter has no content (quiet day entries)
  if (!newsletter.content || newsletter.content.trim() === '') {
    notFound();
  }

  // Get adjacent newsletters for navigation (static only for now)
  const { previous, next } = getAdjacentNewsletters(slug);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: newsletter.title,
    datePublished: new Date(newsletter.publishedAt).toISOString(),
    author: {
      '@type': 'Person',
      name: 'Imran',
      url: 'https://www.aiuxdesign.guide/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI UX Design Guide',
    },
    description: newsletter.summary || newsletter.title,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.aiuxdesign.guide/news/${newsletter.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <NewsletterDetailClient
        newsletter={newsletter}
        previousNewsletter={previous}
        nextNewsletter={next}
      />
    </>
  );
}
