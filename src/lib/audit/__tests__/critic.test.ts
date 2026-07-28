import {
  CriticVerdictSchema,
  parseCriticResponse,
  needsRevision,
  buildCriticPrompt,
} from '../critic';

describe('parseCriticResponse', () => {
  it('parses a fenced JSON verdict block', () => {
    const text = '```json\n{"verdicts":[{"index":1,"verdict":"drop","reason":"no such icon","evidenceVisible":false}],"overallNote":"one fabricated finding"}\n```';
    const r = parseCriticResponse(text);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.verdicts).toHaveLength(1);
      expect(r.data.verdicts[0].verdict).toBe('drop');
      expect(r.data.verdicts[0].evidenceVisible).toBe(false);
    }
  });

  it('returns no-json when there is no object', () => {
    expect(parseCriticResponse('I could not evaluate this.').ok).toBe(false);
  });

  it('returns schema-mismatch when verdict enum is wrong', () => {
    const r = parseCriticResponse('{"verdicts":[{"index":1,"verdict":"maybe","evidenceVisible":true}],"overallNote":""}');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('schema-mismatch');
  });
});

describe('needsRevision', () => {
  it('is false when every verdict is keep', () => {
    const v = CriticVerdictSchema.parse({ verdicts: [{ index: 1, verdict: 'keep', evidenceVisible: true }], overallNote: '' });
    expect(needsRevision(v)).toBe(false);
  });
  it('is true when any verdict is drop or sharpen', () => {
    const v = CriticVerdictSchema.parse({ verdicts: [
      { index: 1, verdict: 'keep', evidenceVisible: true },
      { index: 2, verdict: 'sharpen', evidenceVisible: true },
    ], overallNote: '' });
    expect(needsRevision(v)).toBe(true);
  });
  it('is false on an empty verdict list', () => {
    const v = CriticVerdictSchema.parse({ verdicts: [], overallNote: '' });
    expect(needsRevision(v)).toBe(false);
  });
});

describe('buildCriticPrompt', () => {
  it('includes the finding index and evidence so the critic can check them', () => {
    const prompt = buildCriticPrompt({
      topGaps: [{ pattern: 'Feedback Loops', status: 'missing', finding: 'no thumbs up/down', evidence: 'message area', recommendation: 'add icons', resource: null }],
      applicablePatterns: ['Feedback Loops'],
    } as never);
    expect(prompt).toContain('Feedback Loops');
    expect(prompt).toContain('index');
    expect(prompt).toMatch(/keep.*sharpen.*drop/s);
  });
});

import type Anthropic from '@anthropic-ai/sdk';
import { verifyFindings } from '../critic';

function fakeClient(text: string): Anthropic {
  return { messages: { create: async () => ({ content: [{ type: 'text', text }] }) } } as unknown as Anthropic;
}
const DRAFT = { topGaps: [{ pattern: 'Feedback Loops', status: 'missing', finding: 'x', evidence: 'y', recommendation: 'z', resource: null }], applicablePatterns: ['Feedback Loops'] } as never;

describe('verifyFindings', () => {
  it('returns parsed verdicts on a well-formed critic reply', async () => {
    const client = fakeClient('{"verdicts":[{"index":1,"verdict":"keep","evidenceVisible":true}],"overallNote":""}');
    const r = await verifyFindings({ client, imageBlocks: [], draft: DRAFT });
    expect(r.ok).toBe(true);
  });

  it('returns ok:false when the critic call throws', async () => {
    const client = { messages: { create: async () => { throw new Error('boom'); } } } as unknown as Anthropic;
    const r = await verifyFindings({ client, imageBlocks: [], draft: DRAFT });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('invalid-json');
  });
});
