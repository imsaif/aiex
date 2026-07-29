import { render, screen } from '@testing-library/react';
import ClientPage from '../client-page';
import type { Pattern } from '@/types';

/**
 * Structure guard for the pattern detail page.
 *
 * Why this exists: on 2026-05-29 an "inline interactive demo slot" was added with
 * a default placement of 'after-problem-solution'. Because no pattern overrode the
 * default, EVERY pattern page silently rendered the same demo twice — once under a
 * "See it in action" heading and again under "Implementation" — across every pattern page,
 * with no signal of what caused it. This test locks the canonical section order and
 * fails loudly if a duplicate demo section (or any structural drift) reappears.
 *
 * Canonical order: Problem -> Solution -> Real-World Examples -> Implementation.
 * The interactive demo lives ONLY in the Implementation section.
 */

// The page's section CONTENT comes from dynamically-imported children (Carousel,
// CodeExampleBlock, ProductsSection, etc.), but the section HEADINGS this test
// asserts on are rendered by ClientPage itself. Stub next/dynamic so those heavy
// children resolve to no-ops and the test stays focused on page structure.
jest.mock('next/dynamic', () => () => {
  const Stub = () => null;
  Stub.displayName = 'DynamicStub';
  return Stub;
});

// Direct (non-dynamic) children — stub to keep the test light and isolated.
jest.mock('@/components/newsletter/InlineNewsletterSignup', () => ({
  InlineNewsletterSignup: () => null,
}));
jest.mock('@/components/audit/InlineAuditCTA', () => ({
  InlineAuditCTA: () => null,
}));
jest.mock('@/components/handoff/SaveToDashboardButton', () => ({
  __esModule: true,
  default: () => null,
}));

function makePattern(overrides: Partial<Pattern['content']> = {}): Pattern {
  return {
    id: 'test-pattern',
    title: 'Test Pattern',
    slug: 'test-pattern',
    description: 'A pattern used purely for the structure guard test.',
    category: 'Trustworthy & Reliable AI',
    introduction: 'Test Pattern is a fixture for the pattern-page structure test.',
    content: {
      problem: 'The problem statement.',
      solution: 'The solution statement.',
      guidelines: ['Guideline one.'],
      considerations: ['Consideration one.'],
      examples: [
        {
          title: 'Example One',
          description: 'An example.',
          image: '/images/examples/test.png',
          altText: 'Test example',
        },
      ],
      codeExamples: [
        {
          title: 'Test Pattern — Implementation',
          description: 'Demo code.',
          code: 'export const x = 1;',
          language: 'tsx',
          // A registered live demo: under the old bug this is exactly the case
          // that rendered twice (preview + Implementation).
          componentId: 'explainable-ai-demo',
        },
      ],
      relatedPatterns: [],
      ...overrides,
    },
    hideFAQ: true,
  };
}

function headingTexts(): string[] {
  return screen
    .getAllByRole('heading')
    .map((h) => (h.textContent || '').trim());
}

describe('pattern page structure', () => {
  it('renders sections in canonical order with the demo only under Implementation', () => {
    render(
      <ClientPage
        pattern={makePattern()}
        previousPattern={null}
        nextPattern={null}
        categoryPatterns={[]}
        relatedGuides={[]}
      />
    );

    const headings = headingTexts();

    // No duplicate demo section — the regression this test guards against.
    expect(headings).not.toContain('See it in action');

    // The demo lives in exactly one section heading: "Implementation".
    // (Exact match so the legacy "Implementation Guidelines" sub-heading doesn't count.)
    expect(
      screen.getAllByRole('heading', { name: 'Implementation' })
    ).toHaveLength(1);

    // Canonical order: Problem -> Solution -> Real-World Examples -> Implementation.
    const order = ['Problem', 'Solution', 'Real-World Examples', 'Implementation'];
    const indices = order.map((label) => headings.indexOf(label));
    // Every canonical heading is present (indexOf >= 0)...
    expect(indices.every((idx) => idx >= 0)).toBe(true);
    // ...and they appear in the canonical order.
    const sorted = [...indices].sort((a, b) => a - b);
    expect(indices).toEqual(sorted);
  });

  it('omits the Implementation section when a pattern has no code examples (and never shows the demo slot)', () => {
    render(
      <ClientPage
        pattern={makePattern({ codeExamples: [] })}
        previousPattern={null}
        nextPattern={null}
        categoryPatterns={[]}
        relatedGuides={[]}
      />
    );

    const headings = headingTexts();
    expect(headings).not.toContain('See it in action');
    expect(headings).not.toContain('Implementation');
    // Problem/Solution still render — no crash, page structure intact.
    expect(headings).toContain('Problem');
    expect(headings).toContain('Solution');
  });
});
