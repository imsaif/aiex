/**
 * Bidirectional cross-links between guides and patterns.
 *
 * Used to create internal link equity between indexed pattern pages and
 * new lesson pages, accelerating Google's crawl of the ~66 lesson URLs
 * shipped in the Apr 2026 SEO refactor.
 */

/** Guide slug → related pattern slugs (semantically curated). */
const GUIDE_TO_PATTERNS: Record<string, string[]> = {
  'claude-code-learning-path': [
    'contextual-assistance',
    'augmented-creation',
    'progressive-disclosure',
    'collaborative-ai',
    'error-recovery',
    'guided-learning',
    'human-in-the-loop',
    'explainable-ai',
    'plan-summary',
    'action-audit-trail',
  ],
  'cursor-learning-path': [
    'contextual-assistance',
    'augmented-creation',
    'adaptive-interfaces',
    'predictive-anticipation',
    'progressive-disclosure',
    'confidence-visualization',
    'intelligent-caching',
  ],
  'github-copilot-learning-path': [
    'contextual-assistance',
    'augmented-creation',
    'guided-learning',
    'progressive-disclosure',
    'confidence-visualization',
    'adaptive-interfaces',
  ],
  'github-learning-path': [
    'collaborative-ai',
    'contextual-assistance',
    'error-recovery',
    'human-in-the-loop',
    'feedback-loops',
  ],
  'conversational-ui-guide': [
    'conversational-ui',
    'contextual-assistance',
    'progressive-disclosure',
    'graceful-handoff',
    'context-switching',
    'multimodal-interaction',
    'selective-memory',
    'feedback-loops',
  ],
  'claude-design-learning-path': [
    'augmented-creation',
    'collaborative-ai',
    'contextual-assistance',
    'progressive-disclosure',
    'human-in-the-loop',
    'explainable-ai',
    'confidence-visualization',
  ],
};

/** For a given pattern slug, return guide slugs that teach it in practice. */
export function getGuidesForPattern(patternSlug: string): string[] {
  const guides: string[] = [];
  for (const [guideSlug, patterns] of Object.entries(GUIDE_TO_PATTERNS)) {
    if (patterns.includes(patternSlug)) {
      guides.push(guideSlug);
    }
  }
  return guides;
}

/** For a given guide slug, return the related pattern slugs. */
export function getPatternsForGuide(guideSlug: string): string[] {
  return GUIDE_TO_PATTERNS[guideSlug] ?? [];
}
