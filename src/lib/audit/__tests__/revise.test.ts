import type Anthropic from '@anthropic-ai/sdk';
import { reviseAudit } from '../revise';
import { CriticVerdictSchema } from '../critic';

const DRAFT = {
  score: 3, maxScore: 4, productTypeSummary: 's', surfaceDescription: 'd',
  applicablePatterns: ['A', 'B'],
  topGaps: [
    { pattern: 'A', status: 'missing', finding: 'real', evidence: 'visible', recommendation: 'fix', resource: null },
    { pattern: 'B', status: 'missing', finding: 'fabricated', evidence: 'not there', recommendation: 'fix', resource: null },
  ],
  quickWins: [], generalObservations: [], chatContext: '',
} as any;
const VERDICTS = CriticVerdictSchema.parse({
  verdicts: [
    { index: 1, verdict: 'keep', evidenceVisible: true },
    { index: 2, verdict: 'drop', evidenceVisible: false },
  ],
  overallNote: 'one fabricated finding',
});
function client(text: string): Anthropic {
  return { messages: { create: async () => ({ content: [{ type: 'text', text }] }) } } as unknown as Anthropic;
}

describe('reviseAudit', () => {
  it('returns the revised audit when the revise reply parses and keeps findings', async () => {
    const revised = JSON.stringify({ ...JSON.parse(JSON.stringify(DRAFT)), topGaps: [DRAFT.topGaps[0]] });
    const out = await reviseAudit({ client: client(revised), imageBlocks: [], draft: DRAFT, verdicts: VERDICTS });
    expect(out.topGaps).toHaveLength(1);
    expect(out.topGaps![0].pattern).toBe('A');
  });

  it('falls back to the draft when the revise reply is unparseable', async () => {
    const out = await reviseAudit({ client: client('sorry, no JSON'), imageBlocks: [], draft: DRAFT, verdicts: VERDICTS });
    expect(out.topGaps).toHaveLength(2);
  });

  it('falls back to the draft when revise empties a non-empty audit', async () => {
    const emptied = JSON.stringify({ ...JSON.parse(JSON.stringify(DRAFT)), topGaps: [] });
    const out = await reviseAudit({ client: client(emptied), imageBlocks: [], draft: DRAFT, verdicts: VERDICTS });
    expect(out.topGaps).toHaveLength(2); // fell back, did not accept the empty-out
  });

  it('falls back to the draft when the revise call throws', async () => {
    const throwing = { messages: { create: async () => { throw new Error('boom'); } } } as unknown as Anthropic;
    const out = await reviseAudit({ client: throwing, imageBlocks: [], draft: DRAFT, verdicts: VERDICTS });
    expect(out.topGaps).toHaveLength(2);
  });

  it('preserves all non-topGaps fields from the draft, taking only topGaps from the revise', async () => {
    const revisedText = JSON.stringify({
      ...JSON.parse(JSON.stringify(DRAFT)),
      score: 99,
      applicablePatterns: [],
      topGaps: [DRAFT.topGaps[0]],
    });
    const out = await reviseAudit({ client: client(revisedText), imageBlocks: [], draft: DRAFT, verdicts: VERDICTS });
    expect(out.topGaps).toHaveLength(1);
    expect(out.score).toBe(DRAFT.score);
    expect(out.applicablePatterns).toEqual(DRAFT.applicablePatterns);
  });
});
