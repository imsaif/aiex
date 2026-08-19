import type Anthropic from '@anthropic-ai/sdk';
import { runVerificationLoop, REVISE_MIN_MS } from '../verifyLoop';

const DRAFT = {
  applicablePatterns: ['A', 'B'],
  topGaps: [
    { pattern: 'A', status: 'missing', finding: 'real', evidence: 'visible', recommendation: 'fix', resource: null },
    { pattern: 'B', status: 'missing', finding: 'fabricated', evidence: 'not there', recommendation: 'fix', resource: null },
  ],
} as never;

// A client whose two sequential calls (critic then revise) return scripted text.
function scriptedClient(texts: string[]): Anthropic {
  let i = 0;
  return { messages: { create: async () => ({ content: [{ type: 'text', text: texts[i++] ?? '' }] }) } } as unknown as Anthropic;
}

const ALL_KEEP = '{"verdicts":[{"index":1,"verdict":"keep","evidenceVisible":true},{"index":2,"verdict":"keep","evidenceVisible":true}],"overallNote":""}';
const DROP_2 = '{"verdicts":[{"index":1,"verdict":"keep","evidenceVisible":true},{"index":2,"verdict":"drop","evidenceVisible":false}],"overallNote":"one fabricated"}';
const REVISED_ONE = JSON.stringify({ applicablePatterns: ['A', 'B'], topGaps: [DRAFT.topGaps[0]], quickWins: [], generalObservations: [], chatContext: '' });

describe('runVerificationLoop', () => {
  it('skips revise when every finding is keep', async () => {
    const out = await runVerificationLoop({
      client: scriptedClient([ALL_KEEP]), imageBlocks: [], draft: DRAFT,
      deadlineMs: 1_000_000, now: () => 0,
    });
    expect(out.revised).toBe(false);
    expect(out.result.topGaps).toHaveLength(2);
  });

  it('revises when a finding is dropped', async () => {
    const out = await runVerificationLoop({
      client: scriptedClient([DROP_2, REVISED_ONE]), imageBlocks: [], draft: DRAFT,
      deadlineMs: 1_000_000, now: () => 0,
    });
    expect(out.revised).toBe(true);
    expect(out.result.topGaps).toHaveLength(1);
  });

  it('returns the draft unchanged when the critic call fails', async () => {
    const out = await runVerificationLoop({
      client: scriptedClient(['not json']), imageBlocks: [], draft: DRAFT,
      deadlineMs: 1_000_000, now: () => 0,
    });
    expect(out.revised).toBe(false);
    expect(out.result.topGaps).toHaveLength(2);
  });

  it('skips the whole loop when the deadline is already too close', async () => {
    let calls = 0;
    const client = { messages: { create: async () => { calls++; return { content: [{ type: 'text', text: ALL_KEEP }] }; } } } as unknown as Anthropic;
    const out = await runVerificationLoop({
      client, imageBlocks: [], draft: DRAFT,
      deadlineMs: 5000, now: () => 5000 - (REVISE_MIN_MS - 1), // less than REVISE_MIN_MS left
    });
    expect(calls).toBe(0);
    expect(out.revised).toBe(false);
    expect(out.result.topGaps).toHaveLength(2);
  });

  it('threads a per-call abort budget into the critic call', async () => {
    let secondArg: unknown;
    const client = {
      messages: {
        create: async (_body: unknown, options: unknown) => {
          secondArg = options;
          return { content: [{ type: 'text', text: ALL_KEEP }] };
        },
      },
    } as unknown as Anthropic;
    const out = await runVerificationLoop({
      client, imageBlocks: [], draft: DRAFT,
      deadlineMs: 1_000_000, now: () => 0,
    });
    expect(out.revised).toBe(false);
    expect(secondArg).toBeDefined();
    expect((secondArg as { maxRetries?: number }).maxRetries).toBe(0);
    expect((secondArg as { signal?: AbortSignal }).signal).toBeDefined();
  });

  // `reviseAudit` returns a fresh object ({...draft, topGaps}) even when it
  // changes nothing, so a reference-identity check reported every completed
  // revise as a change. That number is what the AUDIT_VERIFY_LOOP
  // enable/disable decision rests on, so it has to reflect real edits only.
  it('reports revised=false when the revise pass returns identical findings', async () => {
    const unchanged = JSON.stringify({
      applicablePatterns: ['A', 'B'],
      topGaps: DRAFT.topGaps,
      quickWins: [],
      generalObservations: [],
      chatContext: '',
    });
    const out = await runVerificationLoop({
      client: scriptedClient([DROP_2, unchanged]), imageBlocks: [], draft: DRAFT,
      deadlineMs: 1_000_000, now: () => 0,
    });
    expect(out.outcome).toBe('revise-attempted');
    expect(out.revised).toBe(false);
    expect(out.result.topGaps).toHaveLength(2);
  });

  describe('outcome', () => {
    it('distinguishes a clean draft from a failed critic', async () => {
      const clean = await runVerificationLoop({
        client: scriptedClient([ALL_KEEP]), imageBlocks: [], draft: DRAFT,
        deadlineMs: 1_000_000, now: () => 0,
      });
      expect(clean.outcome).toBe('no-revision-needed');
      expect(clean.verdict).not.toBeNull();

      const failed = await runVerificationLoop({
        client: scriptedClient(['not json']), imageBlocks: [], draft: DRAFT,
        deadlineMs: 1_000_000, now: () => 0,
      });
      expect(failed.outcome).toBe('critic-failed');
      expect(failed.verdict).toBeNull();
    });

    it('reports budget-precritic when there was never enough time', async () => {
      const out = await runVerificationLoop({
        client: scriptedClient([ALL_KEEP]), imageBlocks: [], draft: DRAFT,
        deadlineMs: 5000, now: () => 5000 - (REVISE_MIN_MS - 1),
      });
      expect(out.outcome).toBe('budget-precritic');
    });

    it('reports budget-prerevise when the critic used up the budget', async () => {
      // Enough headroom for the critic, none left by the time it returns.
      let t = 0;
      const out = await runVerificationLoop({
        client: scriptedClient([DROP_2]), imageBlocks: [], draft: DRAFT,
        deadlineMs: REVISE_MIN_MS + 1000,
        now: () => {
          const v = t;
          t = REVISE_MIN_MS + 1000; // critic call consumed the remaining budget
          return v;
        },
      });
      expect(out.outcome).toBe('budget-prerevise');
      expect(out.revised).toBe(false);
      expect(out.verdict).not.toBeNull();
      expect(out.result.topGaps).toHaveLength(2);
    });

    it('reports revise-attempted when the revise pass ran', async () => {
      const out = await runVerificationLoop({
        client: scriptedClient([DROP_2, REVISED_ONE]), imageBlocks: [], draft: DRAFT,
        deadlineMs: 1_000_000, now: () => 0,
      });
      expect(out.outcome).toBe('revise-attempted');
      expect(out.revised).toBe(true);
    });
  });
});
