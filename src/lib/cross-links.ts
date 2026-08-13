/**
 * Bidirectional cross-links between guides and patterns.
 *
 * Used to create internal link equity between indexed pattern pages and
 * new lesson pages, accelerating Google's crawl of the ~66 lesson URLs
 * shipped in the Apr 2026 SEO refactor.
 */

/** Guide slug → related pattern slugs (semantically curated). Every pattern
 *  in the 36-pattern catalogue must appear in at least one entry below so the
 *  pattern detail page renders a "Practice in Courses" cross-link card. */
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
    'ambient-intelligence',
    'autonomy-spectrum',
    'intent-preview',
    'agent-status-monitoring',
    'trust-calibration',
    'safe-exploration',
    'session-degradation-prevention',
    'mixed-initiative-control',
    'responsible-ai-design',
    'escalation-pathways',
  ],
  // Inserted second (right after claude-code-learning-path) on purpose: pattern
  // pages cap "Practice in Courses" at 3 entries in insertion order, so a later
  // placement here would never surface on human-in-the-loop (already in 3
  // guides) or progressive-disclosure (already in 5).
  'ai-ux-skills-guide': ['human-in-the-loop', 'progressive-disclosure', 'error-recovery'],
  'cursor-learning-path': [
    'contextual-assistance',
    'augmented-creation',
    'adaptive-interfaces',
    'predictive-anticipation',
    'progressive-disclosure',
    'confidence-visualization',
    'intelligent-caching',
    'ambient-intelligence',
    'progressive-enhancement',
    'safe-exploration',
    'intent-preview',
    'trust-calibration',
  ],
  'github-copilot-learning-path': [
    'contextual-assistance',
    'augmented-creation',
    'guided-learning',
    'progressive-disclosure',
    'confidence-visualization',
    'adaptive-interfaces',
    'ambient-intelligence',
    'progressive-enhancement',
    'trust-calibration',
  ],
  'github-learning-path': [
    'collaborative-ai',
    'contextual-assistance',
    'error-recovery',
    'human-in-the-loop',
    'feedback-loops',
    'session-degradation-prevention',
    'escalation-pathways',
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
    'crisis-detection-escalation',
    'vulnerable-user-protection',
    'anti-manipulation-safeguards',
    'escalation-pathways',
  ],
  'claude-design-learning-path': [
    'augmented-creation',
    'collaborative-ai',
    'contextual-assistance',
    'progressive-disclosure',
    'human-in-the-loop',
    'explainable-ai',
    'confidence-visualization',
    'anti-manipulation-safeguards',
    'crisis-detection-escalation',
    'privacy-first-design',
    'responsible-ai-design',
    'universal-access-patterns',
    'vulnerable-user-protection',
    'mixed-initiative-control',
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
