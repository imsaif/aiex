import { Metadata } from 'next';
import { generateHomeMetadata } from '@/utils/metadata';
import HomeClient from './home-client';
import patterns from '@/data/patterns';
import categories from '@/data/categories';
import { getAllProducts, getProductsForPattern } from '@/data/utils/product-utils';
import { getAllIndustries, getIndustriesForPattern } from '@/data/utils/industry-utils';
import { PatternSummary } from '@/types';

export const metadata: Metadata = generateHomeMetadata();

// Compute lightweight pattern summaries server-side to avoid sending
// full pattern data (code examples, guidelines, figma prompts) to the client
const patternSummaries: PatternSummary[] = patterns.map(p => ({
  id: p.id,
  title: p.title,
  slug: p.slug,
  description: p.description,
  category: p.category,
  tags: p.tags,
  thumbnail: p.thumbnail,
  products: getProductsForPattern(p),
  industries: getIndustriesForPattern(p),
}));

const allProducts = getAllProducts(patterns);
const allIndustries = getAllIndustries(patterns);

export default function Home() {
  return (
    <HomeClient
      patterns={patternSummaries}
      categories={categories}
      allProducts={allProducts}
      allIndustries={allIndustries}
    />
  );
}
