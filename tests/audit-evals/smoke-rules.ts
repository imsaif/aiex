/**
 * Plain pass-or-fail rules for the small automatic audit check. No AI judge: each
 * rule locks in a behaviour the 41-screenshot study established. Add a rule only
 * if it passes today.
 */
import type { ClaudeAnalysisResponse, ProductType } from '../../src/types/audit';

const AGENT_PATTERNS = new Set([
  'Autonomy Spectrum',
  'Intent Preview',
  'Plan Summary',
  'Action Audit Trail',
  'Escalation Pathways',
  'Trust Calibration',
  'Mixed-Initiative Control',
  'Agent Status & Monitoring',
]);

type Expectation = 'agent-screen' | 'ordinary-reply';

export const SMOKE_CASES: ReadonlyArray<{ id: string; productType: ProductType; expect: Expectation }> = [
  // Deliberately the wrong guess: the audit must still reach the agent patterns.
  { id: 'agent-claude-code', productType: 'reports-documents', expect: 'agent-screen' },
  { id: 'chat-claude', productType: 'chat-interface', expect: 'ordinary-reply' },
  { id: 'research-citations', productType: 'search-discovery', expect: 'ordinary-reply' },
];

export function checkSmokeRules(id: string, answer: ClaudeAnalysisResponse | null): string[] {
  if (!answer) return ['The answer could not be read'];
  const smokeCase = SMOKE_CASES.find((c) => c.id === id);
  if (!smokeCase) return [`No smoke case named ${id}`];

  const applicable = answer.applicablePatterns ?? [];
  const failures: string[] = [];
  const hasAgentPattern = applicable.some((p) => AGENT_PATTERNS.has(p));

  if (smokeCase.expect === 'agent-screen' && !hasAgentPattern) {
    failures.push('Expected an agent pattern on an agent screen');
  }
  if (smokeCase.expect === 'ordinary-reply') {
    if (applicable.includes('Confidence Visualization')) {
      failures.push('Confidence Visualization does not belong on an ordinary reply');
    }
    if (hasAgentPattern) failures.push('Agent patterns do not belong on an ordinary reply');
  }
  return failures;
}
