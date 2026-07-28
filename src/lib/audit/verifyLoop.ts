import type Anthropic from '@anthropic-ai/sdk';
import { verifyFindings, needsRevision, type CriticVerdict } from './critic';
import { reviseAudit } from './revise';
import type { ClaudeAnalysisResponse } from '@/types/audit';

/** Minimum headroom (ms) required before the deadline to attempt the revise call. */
export const REVISE_MIN_MS = 12000;

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
}): Promise<{ result: ClaudeAnalysisResponse; revised: boolean; verdict: CriticVerdict | null }> {
  const now = opts.now ?? Date.now;

  // Not enough budget to even run the critic + a possible revise: bail early.
  if (opts.deadlineMs - now() < REVISE_MIN_MS) {
    return { result: opts.draft, revised: false, verdict: null };
  }

  const critic = await verifyFindings({
    client: opts.client,
    imageBlocks: opts.imageBlocks,
    draft: opts.draft,
    model: opts.criticModel,
  });
  if (!critic.ok) return { result: opts.draft, revised: false, verdict: null };
  if (!needsRevision(critic.data)) return { result: opts.draft, revised: false, verdict: critic.data };

  // Re-check budget before the (larger) revise call.
  if (opts.deadlineMs - now() < REVISE_MIN_MS) {
    return { result: opts.draft, revised: false, verdict: critic.data };
  }

  const revised = await reviseAudit({
    client: opts.client,
    imageBlocks: opts.imageBlocks,
    systemPrompt: opts.systemPrompt,
    draft: opts.draft,
    verdicts: critic.data,
    model: opts.reviseModel,
  });
  const changed = revised !== opts.draft;
  return { result: revised, revised: changed, verdict: critic.data };
}
