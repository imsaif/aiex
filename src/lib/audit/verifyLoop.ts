import type Anthropic from '@anthropic-ai/sdk';
import { verifyFindings, needsRevision, type CriticVerdict } from './critic';
import { reviseAudit } from './revise';
import type { ClaudeAnalysisResponse } from '@/types/audit';

/** Minimum headroom (ms) required before the deadline to attempt the revise call. */
export const REVISE_MIN_MS = 12000;

/**
 * Wall-clock headroom the loop must respect so the analyze function never
 * hard-times-out. Vercel Hobby caps at 60s; this leaves ~5s for JSON
 * serialization and the after() sample write.
 *
 * Lives here rather than in the analyze route so the offline eval can budget
 * the loop exactly the way production does. A deadline computed from a
 * different start point measures a loop that engages far more often than the
 * real one does.
 */
export const LOOP_DEADLINE_MS = 55000;

/**
 * Why the loop ended where it did. Distinguishes the three ways a run can
 * produce no revision, which a null verdict alone cannot: out of budget before
 * the critic, critic call failed, or the critic genuinely found nothing to fix.
 */
export type VerifyLoopOutcome =
  | 'budget-precritic'
  | 'critic-failed'
  | 'no-revision-needed'
  | 'budget-prerevise'
  | 'revise-attempted';

export interface VerifyLoopResult {
  result: ClaudeAnalysisResponse;
  /** True only when the revise pass actually changed the findings. */
  revised: boolean;
  verdict: CriticVerdict | null;
  outcome: VerifyLoopOutcome;
}

/**
 * Did the revise pass actually change the findings? `reviseAudit` returns a
 * fresh object (`{...draft, topGaps}`) even when it changes nothing, so
 * reference identity reports every completed revise as a change.
 */
function topGapsChanged(before: ClaudeAnalysisResponse, after: ClaudeAnalysisResponse): boolean {
  return JSON.stringify(before.topGaps ?? []) !== JSON.stringify(after.topGaps ?? []);
}

export async function runVerificationLoop(opts: {
  client: Anthropic;
  imageBlocks: Anthropic.ImageBlockParam[];
  systemPrompt?: string;
  draft: ClaudeAnalysisResponse;
  /** Absolute epoch-ms wall-clock budget. */
  deadlineMs: number;
  now?: () => number;
  criticModel?: string;
  reviseModel?: string;
}): Promise<VerifyLoopResult> {
  const now = opts.now ?? Date.now;

  // Not enough budget to even run the critic + a possible revise: bail early.
  if (opts.deadlineMs - now() < REVISE_MIN_MS) {
    return { result: opts.draft, revised: false, verdict: null, outcome: 'budget-precritic' };
  }

  const criticTimeoutMs = Math.max(0, opts.deadlineMs - now());
  const critic = await verifyFindings({
    client: opts.client,
    imageBlocks: opts.imageBlocks,
    draft: opts.draft,
    model: opts.criticModel,
    timeoutMs: criticTimeoutMs,
  });
  if (!critic.ok) {
    return { result: opts.draft, revised: false, verdict: null, outcome: 'critic-failed' };
  }
  if (!needsRevision(critic.data)) {
    return { result: opts.draft, revised: false, verdict: critic.data, outcome: 'no-revision-needed' };
  }

  // Re-check budget before the (larger) revise call.
  if (opts.deadlineMs - now() < REVISE_MIN_MS) {
    return { result: opts.draft, revised: false, verdict: critic.data, outcome: 'budget-prerevise' };
  }

  const reviseTimeoutMs = Math.max(0, opts.deadlineMs - now());
  const revised = await reviseAudit({
    client: opts.client,
    imageBlocks: opts.imageBlocks,
    systemPrompt: opts.systemPrompt,
    draft: opts.draft,
    verdicts: critic.data,
    model: opts.reviseModel,
    timeoutMs: reviseTimeoutMs,
  });
  return {
    result: revised,
    revised: topGapsChanged(opts.draft, revised),
    verdict: critic.data,
    outcome: 'revise-attempted',
  };
}
