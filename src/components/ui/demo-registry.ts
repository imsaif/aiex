import { scaffoldedDemos } from '@/components/examples/scaffolded/registry';

/**
 * Lightweight registry of which componentIds have a live interactive demo.
 * Kept separate from CodeExampleBlock (which is heavy and dynamically imported)
 * so callers can cheaply check demo availability without bundling the demos.
 *
 * The scaffolded demos are themselves lazy (`dynamic()`), so importing this
 * module does not pull demo code into the initial bundle.
 */
export const REGISTERED_DEMOS = new Set([
  'contextual-assistance-editor', 'human-in-the-loop-moderation', 'progressive-disclosure-email', 'progressive-disclosure-email-demo', 'conversational-ui-bot', 'conversational-ui-guided', 'confidence-indicator', 'adaptive-dashboard', 'adaptive-learning', 'multimodal-search', 'guided-learning-tutorial', 'augmented-creation-demo', 'responsible-ai-design-demo', 'error-recovery-demo', 'collaborative-ai-demo', 'ambient-intelligence-demo', 'safe-exploration-demo', 'explainable-ai-demo', 'predictive-anticipation-demo', 'confidence-visualization-demo', 'selective-memory-demo', 'feedback-loops-demo', 'graceful-handoff-demo', 'context-switching-demo', 'intelligent-caching-demo', 'privacy-first-design-demo', 'progressive-enhancement-demo', 'universal-access-patterns-demo', 'crisis-detection-escalation-demo', 'multi-layer-crisis-detection', 'session-degradation-prevention-example-0', 'anti-manipulation-safeguards-demo', 'VulnerableUserProtectionDemo', 'autonomy-spectrum-demo', 'intent-preview-demo', 'plan-summary-demo', 'action-audit-trail-demo', 'escalation-pathways-demo', 'trust-calibration-demo', 'mixed-initiative-control-demo', 'agent-status-monitoring-demo',
]);

/** Whether a componentId resolves to a live interactive demo (registered or scaffolded). */
export function hasLiveDemo(componentId: string | undefined | null): boolean {
  if (!componentId) return false;
  return REGISTERED_DEMOS.has(componentId) || !!scaffoldedDemos[componentId];
}
