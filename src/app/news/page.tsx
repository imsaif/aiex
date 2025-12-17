import { Metadata } from 'next';
import { getNewsletters, getAllTags } from '@/lib/newsletter';
import NewsClient from './news-client';

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

// Force dynamic rendering since this depends on database
export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  // Fetch initial data server-side with error handling
  let newsletters: Awaited<ReturnType<typeof getNewsletters>>['newsletters'] = [];
  let tags: Awaited<ReturnType<typeof getAllTags>> = [];

  try {
    const [newsletterResult, tagsResult] = await Promise.all([getNewsletters(), getAllTags()]);
    newsletters = newsletterResult.newsletters;
    tags = tagsResult;
  } catch (error) {
    console.error('Failed to fetch newsletters:', error);
  }

  return <NewsClient initialNewsletters={newsletters} availableTags={tags} />;
}
