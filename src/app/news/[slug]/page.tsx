import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import {
  getNewsletterBySlug,
  getNewsletters,
  getAdjacentNewsletters,
  tags as defaultTags,
} from '@/data/newsletters';
import { prisma } from '@/lib/prisma';
import NewsletterDetailClient from './newsletter-detail-client';
import RelatedPatternsForNews from '@/components/PatternIntel/RelatedPatternsForNews';
import type { Newsletter } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600; // ISR: revalidate every hour
export const dynamicParams = true; // Allow DB-only slugs to render on-demand

async function getNewsletterFromDb(slug: string): Promise<Newsletter | undefined> {
  // Runtime: throw on Prisma error so Next's ISR keeps the last-known-good
  // prerender instead of caching notFound() for the full revalidate window.
  // Build: fail soft so a transient Neon outage doesn't kill the deploy —
  // dynamicParams=true means the slug renders lazily on first runtime request.
  let draft;
  try {
    draft = await prisma.newsletterDraft.findFirst({
      where: { slug, status: 'published' },
    });
  } catch (error) {
    // Opt out of caching so a transient Prisma error doesn't poison the ISR
    // cache (would otherwise serve a cached 404 OR 500 for the full
    // s-maxage=3600 window). noStore() marks this request as dynamic; the
    // next request retries against the DB. Same intent as the May 19 hardening
    // — surface the issue without trapping the user behind a cached error.
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      noStore();
      console.error(`[News slug] Runtime Prisma error for ${slug} — opting out of cache:`, error);
    } else {
      console.warn(`[News slug] Prisma error during BUILD for ${slug} — falling back.`, error);
    }
    return undefined;
  }

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxdesign.guide';
  const ogImageUrl = `${siteUrl}/api/newsletter/og?slug=${newsletter.slug}`;

  return {
    title: `${newsletter.title} | AI UX Newsletter`,
    description: newsletter.summary,
    openGraph: {
      title: newsletter.title,
      description: newsletter.summary,
      type: 'article',
      publishedTime: new Date(newsletter.publishedAt).toISOString(),
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: newsletter.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: newsletter.title,
      description: newsletter.summary,
      images: [ogImageUrl],
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
      <RelatedPatternsForNews newsletterId={newsletter.id} />
    </>
  );
}
