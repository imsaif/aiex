import type { Pattern } from '@/types';
import { companyLogos } from '@/data/company-logos';

export interface UsedByProduct {
  name: string;
  logo?: string;
}

/**
 * Derives the "Used by" products for a pattern from its real-world examples.
 * A known company name appearing in an example title gets its self-hosted
 * logo; anything else degrades to a text-only name. Must never throw: the
 * directory renders one row per pattern regardless of example data quality.
 */
export function exampleProducts(pattern: Pattern, limit = 4): UsedByProduct[] {
  const examples = pattern.content.examples ?? [];
  const seen = new Set<string>();
  const products: UsedByProduct[] = [];
  for (const example of examples) {
    const title = (example.title ?? '').trim();
    if (!title) continue;
    const match = companyLogos.find((company) =>
      title.toLowerCase().includes(company.name.toLowerCase())
    );
    const name = match ? match.name : title;
    if (seen.has(name)) continue;
    seen.add(name);
    products.push(match ? { name, logo: match.logo } : { name });
    if (products.length >= limit) break;
  }
  return products;
}
