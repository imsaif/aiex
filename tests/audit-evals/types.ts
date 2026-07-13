import { z } from 'zod';

/**
 * Schema for a fixture's `expected.json`. Authored by hand when curating the
 * golden corpus. Used by run.ts to drive hard assertions on each Claude
 * response and to scope the LLM-as-judge rubric.
 */
export const ExpectedFixtureSchema = z.object({
  description: z.string().min(1),
  productType: z.enum([
    'chat-interface',
    'ai-agent',
    'recommendation-system',
    'content-generation',
    'dashboard-analytics',
    'embedded-ai-feature',
    'search-discovery',
    'reports-documents',
    'general',
  ]),
  productDescription: z.string().default(''),
  /** Patterns the audit MUST surface (in topGaps) for this fixture. */
  mustFindPatterns: z.array(z.string()).default([]),
  /** Patterns the audit MUST NOT surface — anti-assertions for known false-positive surfaces. */
  mustNotFindPatterns: z.array(z.string()).default([]),
  /** Optional: an `applicablePatterns` cap. If set, audit must not list more than this count. */
  maxApplicablePatterns: z.number().int().positive().optional(),
  /** Optional: if true, expect topGaps to be empty (e.g., a pure billing/settings page in a chat product). */
  expectEmptyTopGaps: z.boolean().default(false),
  /** Free-form notes — surface description, why these patterns, what to look out for. */
  notes: z.string().default(''),
});
export type ExpectedFixture = z.infer<typeof ExpectedFixtureSchema>;

export const JUDGE_AXES = [
  'faithfulness',
  'specificity',
  'patternFit',
  'actionability',
  'noFabrication',
] as const;
export type JudgeAxis = (typeof JUDGE_AXES)[number];

export const JudgeScoresSchema = z.object({
  faithfulness: z.number().min(0).max(5),
  specificity: z.number().min(0).max(5),
  patternFit: z.number().min(0).max(5),
  actionability: z.number().min(0).max(5),
  noFabrication: z.number().min(0).max(5),
  comments: z.string().default(''),
});
export type JudgeScores = z.infer<typeof JudgeScoresSchema>;

export interface FixtureResult {
  slug: string;
  description: string;
  productType: string;
  /** The audit response Claude returned (parsed). Captured so we can read findings
   *  after a run without re-burning vision calls. */
  auditResponse: unknown;
  hardAsserts: {
    schemaValid: boolean;
    mustFindHits: string[];
    mustFindMisses: string[];
    mustNotFindViolations: string[];
    emptyTopGapsRespected: boolean | null;
    applicablePatternsOverflow: number | null;
  };
  judge: JudgeScores | null;
  judgeError: string | null;
  hardAssertsPassed: boolean;
}

export interface EvalRunReport {
  startedAt: string;
  durationMs: number;
  fixtures: FixtureResult[];
  axisMeans: Record<JudgeAxis, number> | null;
  passedHardAsserts: number;
  totalFixtures: number;
}
