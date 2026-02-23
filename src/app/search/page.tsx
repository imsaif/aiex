import { Metadata } from 'next';
import { generateSearchMetadata } from '@/utils/metadata';
import allPatterns from '@/data/patterns';
import SearchResultsClient from './search-client';

export const metadata: Metadata = generateSearchMetadata();

export default function SearchResultsPage() {
  // Extract only the lightweight fields needed for client-side search
  const patterns = allPatterns.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
  }));

  return <SearchResultsClient patterns={patterns} />;
}
