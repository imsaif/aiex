import { buildSystemPrompt, buildUserPrompt } from '../prompts';
import type { ProductType } from '@/types/audit';

const PRODUCT_TYPES: ProductType[] = [
  'chat-interface',
  'ai-agent',
  'recommendation-system',
  'content-generation',
  'other',
];

describe('buildSystemPrompt', () => {
  it.each(PRODUCT_TYPES)('matches snapshot for productType=%s', (productType) => {
    expect(buildSystemPrompt(productType)).toMatchSnapshot();
  });

  it('includes the agentic pattern block ONLY for ai-agent', () => {
    for (const pt of PRODUCT_TYPES) {
      const out = buildSystemPrompt(pt);
      if (pt === 'ai-agent') {
        expect(out).toMatch(/Agentic patterns/);
        expect(out).toMatch(/Autonomy Spectrum/);
        expect(out).toMatch(/Action Audit Trail/);
      } else {
        expect(out).not.toMatch(/Agentic patterns/);
        expect(out).not.toMatch(/Autonomy Spectrum/);
      }
    }
  });

  it('enforces the evidence-first hard rules (regression guard for Apr 28 incident)', () => {
    const out = buildSystemPrompt('chat-interface');
    // The Apr 28 prompt regression was "lead with pattern X" steering. These
    // assertions guard the core rules that replaced it.
    expect(out).toMatch(/evidence/i);
    expect(out).toMatch(/Describe each surface/);
    expect(out).toMatch(/Select applicable patterns/);
    expect(out).toMatch(/NEVER pad to hit a target count/);
    expect(out).toMatch(/empty `topGaps` array/);
    expect(out).toMatch(/No evidence → drop the finding/);
  });

  it('requires ranked, de-duplicated findings with impact + effort (P0 output rewrite)', () => {
    const out = buildSystemPrompt('chat-interface');
    // New per-gap fields are in the JSON schema...
    expect(out).toMatch(/"impact"/);
    expect(out).toMatch(/"effort"/);
    // ...and required as hard rules.
    expect(out).toMatch(/Every finding needs an `impact` and an `effort`/);
    // Ranking: best-first, don't lead with the most generic finding.
    expect(out).toMatch(/ordered best-first/);
    // De-duplication of same-root-cause findings.
    expect(out).toMatch(/Merge findings that share one root cause/);
    // Severity is argued, not just labelled.
    expect(out).toMatch(/Reserve `status: "missing"`/);
  });

  it('documents the strict JSON output schema', () => {
    const out = buildSystemPrompt('chat-interface');
    expect(out).toMatch(/Output format \(strict JSON\)/);
    expect(out).toMatch(/"topGaps"/);
    expect(out).toMatch(/"applicablePatterns"/);
    expect(out).toMatch(/"surfaceDescription"/);
    expect(out).toMatch(/"score"/);
    expect(out).toMatch(/"maxScore"/);
    expect(out).toMatch(/"quickWins"/);
    expect(out).toMatch(/"chatContext"/);
    expect(out).toMatch(/Return ONLY valid JSON/);
  });
});

describe('buildUserPrompt', () => {
  it.each(PRODUCT_TYPES)('matches snapshot for productType=%s', (productType) => {
    expect(buildUserPrompt(productType)).toMatchSnapshot();
  });

  it('warns against flagging agentic patterns on non-agent surfaces of agent products', () => {
    const out = buildUserPrompt('ai-agent');
    expect(out).toMatch(/Do not flag agentic patterns on settings or billing/);
  });

  it('warns against assuming agentic patterns on non-agent products', () => {
    for (const pt of PRODUCT_TYPES.filter((p) => p !== 'ai-agent')) {
      const out = buildUserPrompt(pt);
      expect(out).toMatch(/agentic pattern set probably does NOT apply/);
    }
  });

  it('reminds Claude that screenshots may show any surface (regression guard against "all chats need confidence viz")', () => {
    const out = buildUserPrompt('chat-interface');
    expect(out).toMatch(/DO NOT assume every screen needs the same set of patterns/);
  });
});
