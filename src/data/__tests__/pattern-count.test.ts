import patterns from '@/data/patterns';
import { PATTERN_COUNT } from '@/data/pattern-count';
import { DETECTION_PATTERN_COUNT } from '@/lib/patterns/detection-prompts';
import { PANEL_PATTERN_COUNT } from '@/components/audit/PatternCheckingPanel';

/**
 * Guards the three places a pattern count can live. In May 2026 two patterns
 * (workspace-native-agents, agent-reflection-learning) were added to the library
 * but never to the audit's detection list, so the site advertised 38 patterns on
 * /patterns while the audit scored against 36 and the homepage said 36. Nothing
 * failed. These assertions make that drift a red test.
 */
describe('pattern count', () => {
  it('matches the number of patterns in the library', () => {
    expect(PATTERN_COUNT).toBe(patterns.length);
  });

  it('matches the number of patterns the audit actually evaluates', () => {
    expect(DETECTION_PATTERN_COUNT).toBe(patterns.length);
  });

  it('matches the number of patterns the checking panel lists', () => {
    expect(PANEL_PATTERN_COUNT).toBe(patterns.length);
  });
});
