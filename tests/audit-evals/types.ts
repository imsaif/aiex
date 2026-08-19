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

/* -------------------------------------------------------------------------
 * Paired A/B eval (run-ab.ts)
 *
 * Measures what the verification loop CONTRIBUTES, which the single-arm runner
 * cannot. The single-arm runner makes its own analyze call per arm, so a
 * baseline run and an EVAL_WITH_LOOP=1 run start from two different drafts —
 * any score difference conflates the loop's effect with run-to-run vision
 * variance. The paired runner analyzes ONCE and sends that one draft down both
 * arms, so the only difference between them is the loop itself.
 * ---------------------------------------------------------------------- */

export type HardAsserts = FixtureResult['hardAsserts'];

/** One scored arm of the pair (baseline draft, or the post-loop result). */
export interface ArmResult {
  auditResponse: unknown;
  hardAsserts: HardAsserts;
  hardAssertsPassed: boolean;
  judge: JudgeScores | null;
  judgeError: string | null;
}

/**
 * What the loop actually did. This is the decision-critical output — at small
 * corpus sizes an axis delta of ±0.5 is noise, but "the critic dropped 3
 * findings whose evidence it could not locate" is signal even at n=2.
 */
export interface LoopTelemetry {
  /** Where the loop stopped. Distinguishes budget bail from critic failure
   *  from a genuinely clean draft — all three look like "no revision". */
  outcome: string;
  /** False means the critic call failed or was skipped, NOT that it approved
   *  the draft. Without this the two are indistinguishable in the report. */
  hadVerdict: boolean;
  /** True only when findings actually changed. */
  revised: boolean;
  verdictCounts: { keep: number; sharpen: number; drop: number };
  /** Findings the critic could not locate in the screenshot. The false-absence
   *  rate is the specific failure the loop exists to catch. */
  evidenceNotVisible: number;
  overallNote: string;
  loopMs: number;
  gapCountBefore: number;
  gapCountAfter: number;
}

export interface AbFixtureResult {
  slug: string;
  description: string;
  productType: string;
  baseline: ArmResult | null;
  withLoop: ArmResult | null;
  loop: LoopTelemetry | null;
  /** Set when the shared analyze call failed and neither arm could be scored. */
  error: string | null;
}

export interface AbRunReport {
  startedAt: string;
  durationMs: number;
  models: {
    analyze: string;
    critic: string;
    revise: string;
    judge: string;
  };
  fixtures: AbFixtureResult[];
  baselineAxisMeans: Record<JudgeAxis, number> | null;
  withLoopAxisMeans: Record<JudgeAxis, number> | null;
  /** withLoop minus baseline, per axis. Positive = the loop improved that axis. */
  axisDeltas: Record<JudgeAxis, number> | null;
  baselineHardPassed: number;
  withLoopHardPassed: number;
  totalFixtures: number;
  loopSummary: {
    /** Fixtures where the loop reached the revise call. */
    reviseAttempted: number;
    /** Fixtures where findings actually changed. */
    revisedCount: number;
    outcomes: Record<string, number>;
    totalKeep: number;
    totalSharpen: number;
    totalDrop: number;
    totalEvidenceNotVisible: number;
  };
}
