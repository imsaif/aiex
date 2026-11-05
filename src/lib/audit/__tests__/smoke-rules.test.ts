import { checkSmokeRules, SMOKE_CASES } from '../../../../tests/audit-evals/smoke-rules';
import type { ClaudeAnalysisResponse } from '@/types/audit';

const answer = (applicablePatterns: string[]) => ({ applicablePatterns, topGaps: [] }) as unknown as ClaudeAnalysisResponse;

describe('checkSmokeRules', () => {
  it('fails Claude Code when no agent pattern applies, even with a wrong product guess', () => {
    expect(checkSmokeRules('agent-claude-code', answer(['Progressive Disclosure']))).toEqual([
      'Expected an agent pattern on an agent screen',
    ]);
  });

  it('passes Claude Code with an agent pattern', () => {
    expect(checkSmokeRules('agent-claude-code', answer(['Action Audit Trail']))).toEqual([]);
  });

  it('fails ordinary chat that lists Confidence Visualization', () => {
    expect(checkSmokeRules('chat-claude', answer(['Conversational UI', 'Confidence Visualization']))).toEqual([
      'Confidence Visualization does not belong on an ordinary reply',
    ]);
  });

  it('fails ordinary chat that gets agent patterns', () => {
    expect(checkSmokeRules('chat-claude', answer(['Plan Summary']))).toEqual([
      'Agent patterns do not belong on an ordinary reply',
    ]);
  });

  it('fails an answer that could not be read', () => {
    expect(checkSmokeRules('chat-claude', null)).toEqual(['The answer could not be read']);
  });

  it('pins Claude Code to the wrong guess, so the case guards the fix', () => {
    expect(SMOKE_CASES.find((c) => c.id === 'agent-claude-code')?.productType).toBe('reports-documents');
  });
});
