import { Metadata } from 'next';
import { generateSearchMetadata } from '@/utils/metadata';
import SearchResultsClient from './search-client';

export const metadata: Metadata = generateSearchMetadata();

export default function SearchResultsPage() {
  return <SearchResultsClient />;
}
