import { Pattern, Example } from '../../types';
import patterns from '../patterns';

/**
 * Get a pattern by its ID/slug
 */
export function getPatternById(patternId: string): Pattern | undefined {
  return patterns.find(p => p.id === patternId || p.slug === patternId);
}

/**
 * Get examples for a specific pattern by its ID
 * Returns an empty array if the pattern is not found or has no examples
 */
export function getPatternExamples(patternId: string): Example[] {
  const pattern = getPatternById(patternId);

  if (!pattern || !pattern.content?.examples) {
    return [];
  }

  return pattern.content.examples;
}

/**
 * Get a limited number of examples for a pattern
 * Useful for displaying thumbnails in compact views
 */
export function getPatternExamplesLimited(patternId: string, limit: number = 2): Example[] {
  const examples = getPatternExamples(patternId);
  return examples.slice(0, limit);
}

/**
 * Get pattern title by ID
 */
export function getPatternTitle(patternId: string): string | undefined {
  const pattern = getPatternById(patternId);
  return pattern?.title;
}
