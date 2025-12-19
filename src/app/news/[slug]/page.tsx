import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNewsletterBySlug, getNewsletters, getAdjacentNewsletters } from '@/data/newsletters';
import NewsletterDetailClient from './newsletter-detail-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const newsletters = getNewsletters();
  return newsletters.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const newsletter = getNewsletterBySlug(slug);

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
  const newsletter = getNewsletterBySlug(slug);

  if (!newsletter) {
    notFound();
  }

  // Get adjacent newsletters for navigation
  const { previous, next } = getAdjacentNewsletters(slug);

  return (
    <NewsletterDetailClient
      newsletter={newsletter}
      previousNewsletter={previous}
      nextNewsletter={next}
    />
  );
}
