import { patterns } from '@/data/patterns';
import { guides } from '@/data/guides';
import { promptTemplates } from '@/data/promptTemplates';
import { newsletters } from '@/data/newsletters';
import { Pattern, Guide, Newsletter } from '@/types';
import { PromptTemplate } from '@/types/promptBuilder';

export interface SearchResult {
  type: 'pattern' | 'guide' | 'prompt' | 'newsletter';
  id: string;
  title: string;
  description: string;
  slug: string;
  href: string;
  category?: string;
}

export interface UnifiedSearchResults {
  patterns: SearchResult[];
  guides: SearchResult[];
  prompts: SearchResult[];
  newsletters: SearchResult[];
  totalCount: number;
}

/**
 * Search across all content types
 */
export function unifiedSearch(query: string, limit: number = 3): UnifiedSearchResults {
  if (!query || query.trim().length < 2) {
    return {
      patterns: [],
      guides: [],
      prompts: [],
      newsletters: [],
      totalCount: 0,
    };
  }

  const normalizedQuery = query.toLowerCase().trim();
  const terms = normalizedQuery.split(/\s+/);

  // Search patterns
  const patternResults = patterns
    .filter((p) => matchesPattern(p, terms))
    .slice(0, limit)
    .map((p) => ({
      type: 'pattern' as const,
      id: p.id,
      title: p.title,
      description: p.description,
      slug: p.slug,
      href: `/patterns/${p.slug}`,
      category: p.category,
    }));

  // Search guides
  const guideResults = guides
    .filter((g) => matchesGuide(g, terms))
    .slice(0, limit)
    .map((g) => ({
      type: 'guide' as const,
      id: g.id,
      title: g.title,
      description: g.description,
      slug: g.slug,
      href: `/guides/${g.slug}`,
      category: g.tool,
    }));

  // Search prompts
  const promptResults = promptTemplates
    .filter((p) => matchesPrompt(p, terms))
    .slice(0, limit)
    .map((p) => ({
      type: 'prompt' as const,
      id: p.id,
      title: p.name,
      description: p.description,
      slug: p.id,
      href: `/prompts?template=${p.id}`,
      category: p.category,
    }));

  // Search newsletters
  const publishedNewsletters = newsletters.filter((n) => n.published);
  const newsletterResults = publishedNewsletters
    .filter((n) => matchesNewsletter(n, terms))
    .slice(0, limit)
    .map((n) => ({
      type: 'newsletter' as const,
      id: n.id,
      title: n.title,
      description: n.summary,
      slug: n.slug,
      href: `/news/${n.slug}`,
    }));

  return {
    patterns: patternResults,
    guides: guideResults,
    prompts: promptResults,
    newsletters: newsletterResults,
    totalCount:
      patternResults.length +
      guideResults.length +
      promptResults.length +
      newsletterResults.length,
  };
}

function matchesPattern(pattern: Pattern, terms: string[]): boolean {
  const searchableText = [
    pattern.title,
    pattern.description,
    pattern.category,
    pattern.content?.problem,
    pattern.content?.solution,
    ...(pattern.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return terms.every((term) => searchableText.includes(term));
}

function matchesGuide(guide: Guide, terms: string[]): boolean {
  const searchableText = [
    guide.title,
    guide.description,
    guide.tool,
    guide.useCase,
    guide.designDomain,
    ...(guide.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return terms.every((term) => searchableText.includes(term));
}

function matchesPrompt(prompt: PromptTemplate, terms: string[]): boolean {
  const searchableText = [prompt.name, prompt.description, prompt.category]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return terms.every((term) => searchableText.includes(term));
}

function matchesNewsletter(newsletter: Newsletter, terms: string[]): boolean {
  const searchableText = [
    newsletter.title,
    newsletter.summary,
    ...(newsletter.tags?.map((t) => t.name) || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return terms.every((term) => searchableText.includes(term));
}
