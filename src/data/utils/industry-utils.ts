import { Pattern } from '../../types';
import { getProductsForPattern } from './product-utils';

/**
 * Represents an industry with its metadata
 */
export interface Industry {
  name: string;
  count: number; // Number of patterns that have products in this industry
}

/**
 * Product to Industry mapping
 * Maps product names (first word from example titles) to their industries
 */
const productToIndustryMap: Record<string, string> = {
  // AI/ML Platforms
  'ChatGPT': 'AI/ML',
  'Claude': 'AI/ML',
  'Anthropic': 'AI/ML',
  'OpenAI': 'AI/ML',
  'GPTZero': 'AI/ML',
  'Perplexity': 'AI/ML',
  'Midjourney': 'AI/ML',
  'Dall-E': 'AI/ML',
  'DuckDuckGo': 'AI/ML',
  'Hugging': 'AI/ML',
  'PinwheelGPT': 'AI/ML',

  // Developer Tools
  'GitHub': 'Developer Tools',
  'Cursor': 'Developer Tools',
  'AWS': 'Developer Tools',
  'IBM': 'Developer Tools',

  // Technology
  'Google': 'Technology',
  'Apple': 'Technology',
  'Microsoft': 'Technology',
  'Meta-Intent': 'Technology',
  'Bing': 'Technology',

  // Productivity
  'Notion': 'Productivity',
  'Slack': 'Productivity',
  'Grammarly': 'Productivity',
  'Loom': 'Productivity',
  'Superhuman': 'Productivity',

  // Entertainment
  'Netflix': 'Entertainment',
  'Spotify': 'Entertainment',

  // Design
  'Adobe': 'Design',
  'Photoshop': 'Design',
  'Figma': 'Design',

  // Education
  'Duolingo': 'Education',

  // Healthcare/Wellness
  'Woebot': 'Healthcare',
  'Wysa': 'Healthcare',
  'Crisis': 'Healthcare',
  'Be': 'Healthcare', // Be My Eyes

  // Automotive
  'Tesla': 'Automotive',

  // Communication
  'Signal': 'Communication',
  'Siri': 'Technology',

  // iPad/devices map to Technology
  'iPad': 'Technology',
};

/**
 * Get the industry for a given product name
 * Returns 'Other' if no mapping exists
 */
export function getIndustryForProduct(productName: string): string {
  return productToIndustryMap[productName] || 'Other';
}

/**
 * Get all industries for a specific pattern based on its products
 */
export function getIndustriesForPattern(pattern: Pattern): string[] {
  const products = getProductsForPattern(pattern);
  const industries = new Set<string>();

  products.forEach(product => {
    const industry = getIndustryForProduct(product);
    industries.add(industry);
  });

  return Array.from(industries).sort();
}

/**
 * Get all unique industries from patterns
 * Returns a sorted list of industries with counts
 */
export function getAllIndustries(patterns: Pattern[]): Industry[] {
  const industryMap = new Map<string, Set<string>>(); // industry -> set of pattern IDs

  patterns.forEach((pattern) => {
    const industries = getIndustriesForPattern(pattern);
    industries.forEach(industry => {
      if (!industryMap.has(industry)) {
        industryMap.set(industry, new Set());
      }
      industryMap.get(industry)!.add(pattern.id);
    });
  });

  // Convert to array and sort by count (descending), then by name
  return Array.from(industryMap.entries())
    .map(([name, patternIds]) => ({ name, count: patternIds.size }))
    .filter(industry => industry.name !== 'Other') // Exclude 'Other' from filters
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });
}

/**
 * Filter patterns by industry
 * Case-insensitive matching
 */
export function filterPatternsByIndustry(
  patterns: Pattern[],
  industryName: string
): Pattern[] {
  if (!industryName) return patterns;

  const lowerIndustryName = industryName.toLowerCase();

  return patterns.filter((pattern) => {
    const industries = getIndustriesForPattern(pattern);
    return industries.some(i => i.toLowerCase() === lowerIndustryName);
  });
}

/**
 * Filter patterns by multiple industries (OR condition)
 * If selectedIndustries is empty, returns all patterns
 */
export function filterPatternsByIndustries(
  patterns: Pattern[],
  selectedIndustries: string[]
): Pattern[] {
  if (!selectedIndustries || selectedIndustries.length === 0) return patterns;

  const lowerSelectedIndustries = selectedIndustries.map(i => i.toLowerCase());

  return patterns.filter((pattern) => {
    const industries = getIndustriesForPattern(pattern);
    return industries.some(i => lowerSelectedIndustries.includes(i.toLowerCase()));
  });
}
