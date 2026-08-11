/**
 * Every valid pattern slug, as plain strings.
 *
 * Deliberately a literal list rather than `patterns.map(p => p.slug)`, for the
 * same reason `pattern-count.ts` hardcodes its number: the consumers are client
 * components (the navbar badge, the saved-items bar, the save hook), and
 * importing the pattern registry would pull all 38 pattern modules into the
 * client bundle.
 *
 * Why this exists at all: saved patterns live in localStorage as bare slugs.
 * When a pattern is renamed or removed, a stale slug lingers in a user's store
 * forever. The count then includes it, but the dashboard drops it when it maps
 * slugs to real patterns, so the saved count and the checkout page disagree with
 * no way for the user to fix it. Validating reads against this list prunes those
 * ghosts automatically.
 *
 * `src/data/__tests__/pattern-slugs.test.ts` fails if this ever drifts from the
 * real registry.
 */
export const PATTERN_SLUGS: readonly string[] = [
  'contextual-assistance',
  'progressive-disclosure',
  'human-in-the-loop',
  'explainable-ai',
  'conversational-ui',
  'adaptive-interfaces',
  'multimodal-interaction',
  'guided-learning',
  'augmented-creation',
  'responsible-ai-design',
  'error-recovery',
  'collaborative-ai',
  'ambient-intelligence',
  'safe-exploration',
  'predictive-anticipation',
  'confidence-visualization',
  'feedback-loops',
  'graceful-handoff',
  'context-switching',
  'intelligent-caching',
  'progressive-enhancement',
  'privacy-first-design',
  'selective-memory',
  'universal-access-patterns',
  'crisis-detection-escalation',
  'session-degradation-prevention',
  'anti-manipulation-safeguards',
  'vulnerable-user-protection',
  'autonomy-spectrum',
  'intent-preview',
  'plan-summary',
  'action-audit-trail',
  'escalation-pathways',
  'trust-calibration',
  'mixed-initiative-control',
  'agent-status-monitoring',
  'agent-reflection-learning',
  'workspace-native-agents',
];

const SLUG_SET = new Set(PATTERN_SLUGS);

/** True when the slug still names a real pattern. */
export function isKnownPatternSlug(slug: string): boolean {
  return SLUG_SET.has(slug);
}
