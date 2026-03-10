/**
 * Utility to map pattern IDs from analysis to URL slugs for pattern detail pages
 */

// Map from analysis pattern ID to URL slug
// Analysis IDs are shorter, URL slugs match the pattern directory names
const PATTERN_ID_TO_SLUG: Record<string, string> = {
  'adaptive-interfaces': 'adaptive-interfaces',
  'ambient-intelligence': 'ambient-intelligence',
  'anti-manipulation': 'anti-manipulation-safeguards',
  'augmented-creation': 'augmented-creation',
  'collaborative-ai': 'collaborative-ai',
  'confidence-visualization': 'confidence-visualization',
  'context-switching': 'context-switching',
  'contextual-assistance': 'contextual-assistance',
  'conversational-ui': 'conversational-ui',
  'crisis-detection': 'crisis-detection-escalation',
  'error-recovery': 'error-recovery',
  'explainable-ai': 'explainable-ai',
  'feedback-loops': 'feedback-loops',
  'graceful-handoff': 'graceful-handoff',
  'guided-learning': 'guided-learning',
  'human-in-the-loop': 'human-in-the-loop',
  'intelligent-caching': 'intelligent-caching',
  'multimodal-interaction': 'multimodal-interaction',
  'predictive-anticipation': 'predictive-anticipation',
  'privacy-first': 'privacy-first-design',
  'progressive-disclosure': 'progressive-disclosure',
  'progressive-enhancement': 'progressive-enhancement',
  'responsible-ai': 'responsible-ai-design',
  'safe-exploration': 'safe-exploration',
  'selective-memory': 'selective-memory',
  'session-degradation': 'session-degradation-prevention',
  'universal-access': 'universal-access-patterns',
  'vulnerable-user-protection': 'vulnerable-user-protection',
  // Agentic patterns (Feb 2026)
  'action-audit-trail': 'action-audit-trail',
  'agent-status-monitoring': 'agent-status-monitoring',
  'autonomy-spectrum': 'autonomy-spectrum',
  'escalation-pathways': 'escalation-pathways',
  'intent-preview': 'intent-preview',
  'mixed-initiative-control': 'mixed-initiative-control',
  'plan-summary': 'plan-summary',
  'trust-calibration': 'trust-calibration',
};

/**
 * Get the URL path for a pattern detail page
 * @param patternId - The pattern ID from analysis results
 * @returns The full URL path or null if pattern not found
 */
export function getPatternUrl(patternId: string): string | null {
  const slug = PATTERN_ID_TO_SLUG[patternId];
  if (!slug) {
    // Try using the ID directly as slug (in case it's already the full slug)
    // Check if it looks like a valid slug
    if (patternId.match(/^[a-z0-9-]+$/)) {
      return `/patterns/${patternId}`;
    }
    return null;
  }
  return `/patterns/${slug}`;
}

/**
 * Get the slug for a pattern
 * @param patternId - The pattern ID from analysis results
 * @returns The slug or the original ID if not found in mapping
 */
export function getPatternSlug(patternId: string): string {
  return PATTERN_ID_TO_SLUG[patternId] || patternId;
}
