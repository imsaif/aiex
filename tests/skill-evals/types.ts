import { z } from 'zod';

/** The two arms. The ONLY difference between them is whether `.claude/skills/aiux-*` exists. */
export type Arm = 'with' | 'without';
export const ARMS: Arm[] = ['with', 'without'];

/**
 * One eval task: a design problem phrased the way a designer would actually type it.
 *
 * `expectedPattern` is reporting metadata only. It never reaches the judge, and no score
 * depends on it — it exists so a run can say "the pack helped most on the tasks it should
 * have covered" without that claim leaking into the scoring.
 */
export interface EvalTask {
  slug: string;
  /** Verbatim designer request. Identical in both arms. */
  prompt: string;
  /** Which aiux pattern, if any, ought to cover this. `null` = deliberate negative case. */
  expectedPattern: string | null;
  /** Why this task is in the corpus. Read by humans, never by the judge. */
  notes: string;
}

export const JUDGE_AXES = [
  'diagnosis',
  'specificity',
  'tradeoff',
  'actionability',
  'groundedness',
] as const;
export type JudgeAxis = (typeof JUDGE_AXES)[number];

const axisScore = z.number().min(0).max(5);

export const ResponseScoresSchema = z.object({
  diagnosis: axisScore,
  specificity: axisScore,
  tradeoff: axisScore,
  actionability: axisScore,
  groundedness: axisScore,
});
export type ResponseScores = z.infer<typeof ResponseScoresSchema>;

export const JudgeVerdictSchema = z.object({
  responseOne: ResponseScoresSchema,
  responseTwo: ResponseScoresSchema,
  /** Forced choice. 'tie' is allowed but the judge is told to use it sparingly. */
  preferred: z.enum(['one', 'two', 'tie']),
  /** One or two sentences. Must justify the preference without naming any skill system. */
  reasoning: z.string().default(''),
});
export type JudgeVerdict = z.infer<typeof JudgeVerdictSchema>;

/** One `claude -p` execution. */
export interface RunResult {
  task: string;
  arm: Arm;
  repeat: number;
  /** Raw stdout from the CLI. */
  output: string;
  /** Skills the run actually loaded, parsed from the transcript. Proves the arms differ. */
  skillsLoaded: string[];
  ms: number;
  ok: boolean;
  error?: string;
}

/** A judged pair: one 'with' run against one 'without' run for the same task. */
export interface PairResult {
  task: string;
  repeat: number;
  /** Which display slot the 'with' arm occupied. Randomised; needed to decode `preferred`. */
  withShownAs: 'one' | 'two';
  verdict: JudgeVerdict;
  withScores: ResponseScores;
  withoutScores: ResponseScores;
  /** Decoded: did the 'with' arm win this pair? */
  winner: Arm | 'tie';
}
