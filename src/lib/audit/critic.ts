import { z } from 'zod';
import { extractJsonObject } from './parseAnalysis';
import type { ClaudeAnalysisResponse } from '@/types/audit';
import { AUDIT_QUALITY_RUBRIC } from './criticRubric';
import type Anthropic from '@anthropic-ai/sdk';

export const CriticVerdictSchema = z.object({
  verdicts: z
    .array(
      z.object({
        index: z.number().int().positive(),
        verdict: z.enum(['keep', 'sharpen', 'drop']),
        reason: z.string().optional().default(''),
        evidenceVisible: z.boolean(),
      }),
    )
    .optional()
    .default([]),
  overallNote: z.string().optional().default(''),
});
export type CriticVerdict = z.infer<typeof CriticVerdictSchema>;

export type CriticResult =
  | { ok: true; data: CriticVerdict }
  | { ok: false; reason: 'no-json' | 'invalid-json' | 'schema-mismatch'; detail: string };

/** Parse the critic's JSON verdicts. Never throws; mirrors parseAnalysisResponse. */
export function parseCriticResponse(text: string): CriticResult {
  const candidate = extractJsonObject(text ?? '');
  if (!candidate) return { ok: false, reason: 'no-json', detail: 'No JSON object found in critic response' };
  let parsed: unknown;
  try {
    parsed = JSON.parse(candidate);
  } catch (err) {
    return { ok: false, reason: 'invalid-json', detail: err instanceof Error ? err.message : 'JSON.parse threw' };
  }
  const result = CriticVerdictSchema.safeParse(parsed);
  if (!result.success) {
    return {
      ok: false,
      reason: 'schema-mismatch',
      detail: result.error.issues.slice(0, 5).map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    };
  }
  return { ok: true, data: result.data };
}

/** Revise only when the critic flagged at least one finding as sharpen or drop. */
export function needsRevision(v: CriticVerdict): boolean {
  return v.verdicts.some((x) => x.verdict !== 'keep');
}

/** Build the critic user prompt: rubric + the draft's findings, indexed 1-based. */
export function buildCriticPrompt(draft: ClaudeAnalysisResponse): string {
  const gaps = (draft.topGaps ?? []).map((g, i) => ({
    index: i + 1,
    pattern: g.pattern,
    finding: g.finding,
    evidence: g.evidence ?? '(none provided)',
    recommendation: g.recommendation ?? '',
  }));
  return `You are verifying an AI UX audit against the screenshot(s) it was generated from. You see the SAME image(s) plus the audit's findings below. Your ONLY job is per-finding verification, not rewriting.

${AUDIT_QUALITY_RUBRIC}

## Findings to verify (1-based index)
\`\`\`json
${JSON.stringify(gaps, null, 2)}
\`\`\`

For EACH finding, re-examine the image and decide:
- "keep": evidence is clearly visible in the image and the finding is specific and correct.
- "sharpen": the pattern fits and the issue is real, but the finding is generic or the evidence is vague. It should be re-grounded on a specific visible element.
- "drop": the evidence is NOT visible in the image (the claimed element is absent or the finding claims something is missing that is actually present). Set evidenceVisible=false.

Set \`evidenceVisible\` to whether the finding's evidence can actually be located in the image.

Return STRICT JSON only, no fences, no preamble:
{
  "verdicts": [
    { "index": <1-based>, "verdict": "keep" | "sharpen" | "drop", "reason": "<one line citing the visible/absent element>", "evidenceVisible": <boolean> }
  ],
  "overallNote": "<one line on the biggest problem, or empty>"
}`;
}

const CRITIC_MODEL = process.env.AUDIT_CRITIC_MODEL || 'claude-sonnet-4-6';

/**
 * The verification critic. Re-examines the screenshot(s) and returns per-finding
 * verdicts. Narrow by design (verification, not rewriting) because a same-model
 * self-critic is only reliable on the "does this evidence exist" subtask.
 * Never throws: returns a CriticResult; the caller falls back to the draft on ok:false.
 */
export async function verifyFindings(opts: {
  client: Anthropic;
  imageBlocks: Anthropic.ImageBlockParam[];
  draft: ClaudeAnalysisResponse;
  model?: string;
}): Promise<CriticResult> {
  if ((opts.draft.topGaps ?? []).length === 0) {
    return { ok: true, data: { verdicts: [], overallNote: '' } };
  }
  let response;
  try {
    response = await opts.client.messages.create({
      model: opts.model || CRITIC_MODEL,
      max_tokens: 1024,
      temperature: 0,
      messages: [
        { role: 'user', content: [...opts.imageBlocks, { type: 'text', text: buildCriticPrompt(opts.draft) }] },
      ],
    });
  } catch (err) {
    return { ok: false, reason: 'invalid-json', detail: err instanceof Error ? err.message : 'critic call threw' };
  }
  const block = response.content.find((b) => b.type === 'text');
  const raw = block && block.type === 'text' ? block.text : '';
  return parseCriticResponse(raw);
}
