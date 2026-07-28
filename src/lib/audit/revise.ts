import type Anthropic from '@anthropic-ai/sdk';
import { parseAnalysisResponse } from './parseAnalysis';
import type { CriticVerdict } from './critic';
import type { ClaudeAnalysisResponse } from '@/types/audit';

const REVISE_MODEL = process.env.AUDIT_REVISE_MODEL || 'claude-sonnet-4-6';

function buildRevisePrompt(draft: ClaudeAnalysisResponse, verdicts: CriticVerdict): string {
  return `You previously produced this AI UX audit as strict JSON. A verifier re-checked each finding against the screenshot(s) and returned verdicts. Apply the verdicts and re-emit the COMPLETE audit JSON.

Rules for applying verdicts (by 1-based topGaps index):
- "drop": REMOVE that finding entirely. Do not replace it. A shorter, honest audit is the goal.
- "sharpen": keep the finding but re-ground it on a specific visible UI element, fixing vague or generic wording. Do not invent new evidence.
- "keep": leave that finding unchanged.
Do NOT add any new findings. Do NOT change findings that were kept. Keep the exact same JSON shape and all other fields (score, maxScore, applicablePatterns, quickWins, generalObservations, chatContext, surfaceDescription, productTypeSummary). If you drop findings, recompute nothing else except leaving score/maxScore as-is.

## Current audit JSON
\`\`\`json
${JSON.stringify(draft, null, 2)}
\`\`\`

## Verifier verdicts
\`\`\`json
${JSON.stringify(verdicts, null, 2)}
\`\`\`

Return ONLY the revised audit as valid JSON. No preamble, no markdown fences.`;
}

/**
 * One bounded revise pass. Returns the revised audit, or the ORIGINAL draft on
 * any failure. Guards against the revise call emptying a previously non-empty
 * audit (a common failure mode when the model over-drops).
 */
export async function reviseAudit(opts: {
  client: Anthropic;
  imageBlocks: Anthropic.ImageBlockParam[];
  systemPrompt?: string;
  draft: ClaudeAnalysisResponse;
  verdicts: CriticVerdict;
  model?: string;
}): Promise<ClaudeAnalysisResponse> {
  const draftGapCount = (opts.draft.topGaps ?? []).length;
  let response;
  try {
    response = await opts.client.messages.create({
      model: opts.model || REVISE_MODEL,
      max_tokens: 4096,
      temperature: 0,
      ...(opts.systemPrompt
        ? { system: [{ type: 'text', text: opts.systemPrompt, cache_control: { type: 'ephemeral' } }] }
        : {}),
      messages: [
        { role: 'user', content: [...opts.imageBlocks, { type: 'text', text: buildRevisePrompt(opts.draft, opts.verdicts) }] },
      ],
    });
  } catch {
    return opts.draft;
  }
  const block = response.content.find((b) => b.type === 'text');
  const raw = block && block.type === 'text' ? block.text : '';
  const parsed = parseAnalysisResponse(raw);
  if (!parsed.ok) return opts.draft;
  // Reject an empty-out: if the draft had findings but the revise returned none,
  // that is almost always over-dropping, not a legitimately clean surface.
  if (draftGapCount > 0 && (parsed.data.topGaps ?? []).length === 0) return opts.draft;
  return parsed.data;
}
