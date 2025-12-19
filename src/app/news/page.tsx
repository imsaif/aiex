import { Metadata } from 'next';
import { getNewsletters, getAllTags } from '@/data/newsletters';
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

export default function NewsPage() {
  const newsletters = getNewsletters();
  const tags = getAllTags();

  return <NewsClient initialNewsletters={newsletters} availableTags={tags} />;
}
