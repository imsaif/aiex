import patterns from '@/data/patterns';
import { Pattern } from '@/types';

/**
 * Get all patterns that have Figma Make prompts
 */
export function getPatternsWithPrompts(): Pattern[] {
  return patterns.filter(pattern => pattern.content.figmaPrompt);
}

/**
 * Get patterns with prompts by category
 */
export function getPromptsByCategory(category: string): Pattern[] {
  const patternsWithPrompts = getPatternsWithPrompts();

  if (category === 'All Categories') {
    return patternsWithPrompts;
  }

  return patternsWithPrompts.filter(
    pattern => pattern.category === category
  );
}

/**
 * Search prompts by title, description, or prompt content
 */
export function searchPrompts(query: string): Pattern[] {
  const patternsWithPrompts = getPatternsWithPrompts();
  const lowerQuery = query.toLowerCase();

  return patternsWithPrompts.filter(pattern =>
    pattern.title.toLowerCase().includes(lowerQuery) ||
    pattern.description.toLowerCase().includes(lowerQuery) ||
    pattern.content.figmaPrompt?.prompt.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get related patterns with prompts (same category, excluding current)
 */
export function getRelatedPrompts(
  currentPattern: Pattern,
  limit: number = 3
): Pattern[] {
  return getPatternsWithPrompts()
    .filter(p =>
      p.id !== currentPattern.id &&
      p.category === currentPattern.category
    )
    .slice(0, limit);
}

/**
 * Get prompt by pattern slug
 */
export function getPromptBySlug(slug: string): Pattern | undefined {
  return getPatternsWithPrompts().find(pattern => pattern.slug === slug);
}

/**
 * Get count of patterns with prompts by category
 */
export function getPromptCountByCategory(): Record<string, number> {
  const patternsWithPrompts = getPatternsWithPrompts();
  const counts: Record<string, number> = { 'All Categories': patternsWithPrompts.length };

  patternsWithPrompts.forEach(pattern => {
    counts[pattern.category] = (counts[pattern.category] || 0) + 1;
  });

  return counts;
}
