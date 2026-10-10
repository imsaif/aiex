/**
 * The band icons themselves: slug → title, image URL, and reading/swapping the
 * icon in a draft's HTML. Kept free of the pattern registry (pattern-slug.ts
 * imports all 38 pattern modules) because daily-email.ts and the admin's client
 * components import from here.
 *
 * A pattern added to the catalogue without a drawing is skipped by the picker
 * instead of shipping a broken image; band.test.ts fails until it exists.
 */

/** Slug → pattern title for every drawing. Titles live here rather than coming
 *  from the pattern registry so the admin's icon picker (a client component)
 *  doesn't pull all 38 pattern modules into its bundle. band.test.ts fails if a
 *  title drifts from the registry. */
export const BAND_ICONS: Readonly<Record<string, string>> = {
  'action-audit-trail': 'Action Audit Trail',
  'adaptive-interfaces': 'Adaptive Interfaces',
  'agent-reflection-learning': 'Agent Reflection & Learning',
  'agent-status-monitoring': 'Agent Status & Monitoring',
  'ambient-intelligence': 'Ambient Intelligence',
  'anti-manipulation-safeguards': 'Anti-Manipulation Safeguards',
  'augmented-creation': 'Augmented Creation',
  'autonomy-spectrum': 'Autonomy Spectrum',
  'collaborative-ai': 'Collaborative AI',
  'confidence-visualization': 'Confidence Visualization',
  'context-switching': 'Context Switching',
  'contextual-assistance': 'Contextual Assistance',
  'conversational-ui': 'Conversational UI',
  'crisis-detection-escalation': 'Crisis Detection & Escalation',
  'error-recovery': 'Error Recovery & Graceful Degradation',
  'escalation-pathways': 'Escalation Pathways',
  'explainable-ai': 'Explainable AI (XAI)',
  'feedback-loops': 'Feedback Loops',
  'graceful-handoff': 'Graceful Handoff',
  'guided-learning': 'Guided Learning',
  'human-in-the-loop': 'Human-in-the-Loop',
  'intelligent-caching': 'Intelligent Caching',
  'intent-preview': 'Intent Preview',
  'mixed-initiative-control': 'Mixed-Initiative Control',
  'multimodal-interaction': 'Multimodal Interaction',
  'plan-summary': 'Plan Summary',
  'predictive-anticipation': 'Predictive Anticipation',
  'privacy-first-design': 'Privacy-First Design',
  'progressive-disclosure': 'Progressive Disclosure',
  'progressive-enhancement': 'Progressive Enhancement',
  'responsible-ai-design': 'Responsible AI Design',
  'safe-exploration': 'Safe Exploration',
  'selective-memory': 'Selective Memory',
  'session-degradation-prevention': 'Session Degradation Prevention',
  'trust-calibration': 'Trust Calibration',
  'universal-access-patterns': 'Universal Access Patterns',
  'vulnerable-user-protection': 'Vulnerable User Protection',
  'workspace-native-agents': 'Workspace-Native Agent Integration',
};

export const BAND_DRAWINGS: ReadonlySet<string> = new Set(Object.keys(BAND_ICONS));

export function bandImageUrl(siteUrl: string, slug: string): string {
  return `${siteUrl}/images/newsletter/band/${slug}.png`;
}

// The band <img> as daily-email.ts renders it: class first, then src, then alt.
const BAND_IMG = /(<img class="aiux-band-art" src="[^"]*\/images\/newsletter\/band\/)([a-z0-9-]+)(\.png" alt=")[^"]*(")/;

/** The icon a draft's band currently shows, or null for HTML without a band
 *  (weekly issues, drafts from before the Oct 2026 layout). */
export function bandSlugFromHtml(html: string): string | null {
  return html.match(BAND_IMG)?.[2] ?? null;
}

/** Swaps the band icon (and its alt text) in a draft's HTML. The admin's icon
 *  picker uses this when the generated pick doesn't fit the issue. */
export function syncBandIcon(html: string, slug: string): string {
  const title = BAND_ICONS[slug];
  if (!title) return html;
  return html.replace(BAND_IMG, (_, start: string, _old: string, mid: string, end: string) => `${start}${slug}${mid}${title} pattern icon${end}`);
}
