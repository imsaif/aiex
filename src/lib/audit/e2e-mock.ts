/**
 * Deterministic mock responses for the analyze route, used by Playwright
 * E2E specs so tests don't burn Anthropic spend or vary by model output.
 *
 * Activated by `E2E_MODE=true` env var. The `x-e2e-scenario` request
 * header picks which canned shape to return so a single spec can exercise
 * gaps-present, gaps-empty, and multi-screenshot branches in FullPageResults.
 */

import type { ProductType } from '@/types/audit';

export type E2EScenario = 'success' | 'empty' | 'multi';

export function isE2EMode(): boolean {
  return process.env.E2E_MODE === 'true';
}

export function pickScenario(header: string | null): E2EScenario {
  if (header === 'empty' || header === 'multi') return header;
  return 'success';
}

interface MockArgs {
  scenario: E2EScenario;
  productType: ProductType | null;
  imageCount: number;
}

export function buildMockResponse({ scenario, productType, imageCount }: MockArgs) {
  const id = `e2e-${scenario}-${Date.now()}`;
  const baseProductType: ProductType = productType ?? 'chat-interface';

  if (scenario === 'empty') {
    return {
      id,
      score: 0,
      maxScore: 36,
      productTypeSummary: '',
      surfaceDescription: 'A static marketing landing page. No AI surfaces detected.',
      applicablePatterns: [],
      topGaps: [],
      quickWins: [],
      chatContext: '',
      productContext: {
        productType: baseProductType,
        productDescription: '',
        aiRole: [],
      },
      context: { interfaceType: 'other', mainConcern: 'usability', userGoal: 'exploring-options', deviceType: 'desktop' },
      detectedComponent: baseProductType,
      componentDescription: '',
      patterns: {},
      summary: '',
      criticalMissing: [],
      timestamp: new Date().toISOString(),
    };
  }

  const baseGaps = [
    {
      pattern: 'Confidence Visualization',
      status: 'missing' as const,
      finding: 'No visible confidence indicators for AI responses.',
      recommendation: 'Add confidence scores or uncertainty indicators next to responses.',
      resource: 'https://aiuxdesign.guide/patterns/confidence-visualization',
    },
    {
      pattern: 'Error Recovery',
      status: 'needs-improvement' as const,
      finding: 'Basic error messages without recovery options.',
      recommendation: 'Add retry buttons and clear next steps when errors occur.',
      resource: 'https://aiuxdesign.guide/patterns/error-recovery',
    },
    {
      pattern: 'Explainable AI',
      status: 'needs-improvement' as const,
      finding: 'AI reasoning is opaque to the user.',
      recommendation: 'Add "Show sources" or "Why this response?" affordance.',
      resource: 'https://aiuxdesign.guide/patterns/explainable-ai',
    },
  ];

  const multiSuffix = scenario === 'multi'
    ? ` Analysed ${imageCount} screenshots together for cross-screen consistency.`
    : '';

  return {
    id,
    score: 18,
    maxScore: 36,
    productTypeSummary: `An AI ${baseProductType} surface.${multiSuffix}`,
    surfaceDescription: `A conversational AI assistant with chat input and response panel.${multiSuffix}`,
    applicablePatterns: [
      'Confidence Visualization',
      'Error Recovery',
      'Explainable AI',
      'Conversational UI',
      'Feedback Loops',
    ],
    topGaps: baseGaps,
    quickWins: [
      'Add a confidence badge next to each response',
      'Add a Talk-to-a-human escape hatch',
      'Cite sources beneath generated answers',
    ],
    chatContext: 'You are reviewing an AI chat surface.',
    productContext: {
      productType: baseProductType,
      productDescription: '',
      aiRole: [],
    },
    context: { interfaceType: 'chatbot', mainConcern: 'usability', userGoal: 'getting-answers', deviceType: 'desktop' },
    detectedComponent: baseProductType,
    componentDescription: '',
    patterns: {},
    summary: 'E2E mock summary',
    criticalMissing: ['Confidence Visualization'],
    timestamp: new Date().toISOString(),
  };
}
