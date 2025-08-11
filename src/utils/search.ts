import { Pattern } from '../types';
import patterns from '../data/patterns';

// Lazy load Fuse.js to reduce initial bundle size
type FuseType = any;
let fuseInstance: FuseType | null = null;
let FuseClass: new (list: Pattern[], options: object) => FuseType = null as any;

const initializeFuse = async () => {
  if (!FuseClass) {
    const FuseModule = await import('fuse.js');
    FuseClass = FuseModule.default;
  }
  
  if (!fuseInstance) {
    fuseInstance = new FuseClass(patterns, fuseOptions);
  }
  
  return fuseInstance;
};

// Fuse.js configuration for pattern search
const fuseOptions = {
  keys: [
    {
      name: 'title',
      weight: 0.3
    },
    {
      name: 'description',
      weight: 0.2
    },
    {
      name: 'category',
      weight: 0.2
    },
    {
      name: 'tags',
      weight: 0.15
    },
    {
      name: 'content.overview',
      weight: 0.1
    },
    {
      name: 'content.guidelines',
      weight: 0.05
    }
  ],
  threshold: 0.4, // 0.0 = perfect match, 1.0 = match anything
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
  ignoreLocation: true,
};

export interface SearchResult {
  item: Pattern;
  score?: number;
  matches?: Array<{ key: string; indices: [number, number][]; value: string }>;
}

export interface SearchOptions {
  limit?: number;
  category?: string;
  minScore?: number;
}

/**
 * Search patterns using fuzzy search
 */
export async function searchPatterns(
  query: string, 
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) {
    return patterns.map(pattern => ({ item: pattern }));
  }

  const {
    limit = 10,
    category,
    minScore = 0.1
  } = options;

  const fuse = await initializeFuse();
  let results = (fuse as any).search(query, { limit: limit * 2 }); // Get more results to filter

  // Filter by category if specified
  if (category) {
    results = results.filter((result: { item: Pattern; score?: number }) => 
      result.item.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by minimum score
  results = results.filter((result: { score?: number }) => 
    !result.score || result.score <= minScore
  );

  // Limit results
  results = results.slice(0, limit);

  return results.map((result: { item: Pattern; score?: number; matches?: unknown[] }) => ({
    item: result.item,
    score: result.score,
    matches: result.matches as Array<{ key: string; indices: [number, number][]; value: string }>
  }));
}

/**
 * Get all unique categories from patterns
 */
export function getCategories(): string[] {
  const categories = patterns.map(pattern => pattern.category);
  return Array.from(new Set(categories)).sort();
}

/**
 * Get patterns by category
 */
export function getPatternsByCategory(category: string): Pattern[] {
  return patterns.filter(pattern => 
    pattern.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get pattern suggestions based on current pattern
 */
export function getRelatedPatterns(currentPattern: Pattern, limit: number = 3): Pattern[] {
  // Find patterns with similar tags or category
  const related = patterns.filter(pattern => {
    if (pattern.id === currentPattern.id) return false;
    
    // Same category gets higher priority
    if (pattern.category === currentPattern.category) return true;
    
    // Check for tag overlap
    const currentTags = currentPattern.tags || [];
    const patternTags = pattern.tags || [];
    const commonTags = currentTags.filter(tag => patternTags.includes(tag));
    
    return commonTags.length > 0;
  });

  // Sort by relevance (same category first, then by tag overlap)
  related.sort((a, b) => {
    const aIsSameCategory = a.category === currentPattern.category ? 1 : 0;
    const bIsSameCategory = b.category === currentPattern.category ? 1 : 0;
    
    if (aIsSameCategory !== bIsSameCategory) {
      return bIsSameCategory - aIsSameCategory;
    }
    
    // Count tag overlaps
    const currentTags = currentPattern.tags || [];
    const aTagOverlap = (a.tags || []).filter(tag => currentTags.includes(tag)).length;
    const bTagOverlap = (b.tags || []).filter(tag => currentTags.includes(tag)).length;
    
    return bTagOverlap - aTagOverlap;
  });

  return related.slice(0, limit);
}

/**
 * Highlight search matches in text
 */
export function highlightMatches(text: string, matches: Array<{ key: string; indices: [number, number][]; value: string }>, key: string): string {
  const match = matches.find(m => m.key === key);
  if (!match || !match.indices) return text;

  let highlightedText = text;
  const indices = [...match.indices].reverse(); // Reverse to avoid index shifting

  indices.forEach(([start, end]) => {
    const before = highlightedText.slice(0, start);
    const matched = highlightedText.slice(start, end + 1);
    const after = highlightedText.slice(end + 1);
    
    highlightedText = before + `<mark class="bg-yellow-200 text-yellow-900 rounded px-1">${matched}</mark>` + after;
  });

  return highlightedText;
}