import { buildSystemPrompt, buildUserPrompt } from '../prompts';
import type { ProductType } from '@/types/audit';

const PRODUCT_TYPES: ProductType[] = [
  'chat-interface',
  'ai-agent',
  'recommendation-system',
  'content-generation',
  'dashboard-analytics',
  'embedded-ai-feature',
  'search-discovery',
  'reports-documents',
  'general',
];

describe('buildSystemPrompt', () => {
  it.each(PRODUCT_TYPES)('matches snapshot for productType=%s', (productType) => {
    expect(buildSystemPrompt(productType)).toMatchSnapshot();
  });

  it('offers the full library whatever the product-type guess (a wrong guess must not remove patterns)', () => {
    for (const pt of PRODUCT_TYPES) {
      const out = buildSystemPrompt(pt);
      expect(out).toMatch(/Agentic patterns \(only for agentic/);
      expect(out).toMatch(/Autonomy Spectrum/);
      expect(out).toMatch(/Action Audit Trail/);
      expect(out).toMatch(/Workspace-Native Agent Integration/);
    }
  });

  it('advertises the library as 38 patterns', () => {
    expect(buildSystemPrompt('chat-interface')).toMatch(/38 research-backed AI UX patterns/);
  });

  it('adds a per-type emphasis block for concrete types but not the general fallback', () => {
    expect(buildSystemPrompt('dashboard-analytics')).toMatch(/Emphasis for this surface type/);
    expect(buildSystemPrompt('search-discovery')).toMatch(/Emphasis for this surface type/);
    expect(buildSystemPrompt('general')).not.toMatch(/Emphasis for this surface type/);
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

  it('ties agentic patterns to what the surface shows, not to the guessed product type', () => {
    // embedded-ai-feature gets its own caveat, so it's excluded here.
    for (const pt of PRODUCT_TYPES.filter((p) => p !== 'ai-agent' && p !== 'embedded-ai-feature')) {
      const out = buildUserPrompt(pt);
      expect(out).toMatch(/product type is only a guess/);
      expect(out).toMatch(/only if the surface itself clearly shows/);
      expect(out).not.toMatch(/probably does NOT apply/);
    }
  });

  it('gives embedded-ai-feature an embedded-specific caveat', () => {
    const out = buildUserPrompt('embedded-ai-feature');
    expect(out).toMatch(/Workspace-Native Agent Integration/);
    expect(out).toMatch(/autonomous-agent pattern set/);
  });

  it('reminds Claude that screenshots may show any surface (regression guard against "all chats need confidence viz")', () => {
    const out = buildUserPrompt('chat-interface');
    expect(out).toMatch(/DO NOT assume every screen needs the same set of patterns/);
  });
});
