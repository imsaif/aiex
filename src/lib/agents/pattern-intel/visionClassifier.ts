import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import type { PatternRef } from './types';
import type { ScreenshotCandidate } from '../sources/screenshotSource';

const SONNET_MODEL = 'claude-sonnet-4-5-20250929';
const MIN_CONFIDENCE = 0.7;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const VisionMatchSchema = z.object({
  slug: z.string(),
  confidence: z.number().min(0).max(1),
  exampleTitle: z.string().max(120),
  exampleDescription: z.string().max(400),
  rationale: z.string().max(300),
});

const VisionResponseSchema = z.object({
  matches: z.array(VisionMatchSchema).max(3),
});

export interface VisionMatch {
  slug: string;
  confidence: number;
  exampleTitle: string;
  exampleDescription: string;
  rationale: string;
}

function extractJson(text: string): unknown {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenceMatch ? fenceMatch[1] : text;
  const start = candidate.indexOf('{');
  if (start === -1) throw new Error('no JSON object found');
  let depth = 0;
  for (let i = start; i < candidate.length; i++) {
    const ch = candidate[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return JSON.parse(candidate.slice(start, i + 1));
    }
  }
  throw new Error('unbalanced JSON');
}

export async function classifyScreenshot(
  candidate: ScreenshotCandidate,
  patterns: PatternRef[],
  validSlugs: Set<string>,
): Promise<VisionMatch[]> {
  const list = patterns
    .map((p) => `- ${p.slug} | ${p.title}\n    problem: ${p.problem}\n    solution: ${p.solution}`)
    .join('\n');

  const systemPrompt = `You classify product UI screenshots against an AI UX pattern library.

Library (${patterns.length} patterns):
${list}

For the provided screenshot, identify up to 3 patterns from the list above that the UI visibly demonstrates. Only include a pattern if a designer reading the pattern page would find this screenshot useful as an example.

Return strict JSON: { "matches": [{ "slug": "exact-slug", "confidence": 0-1, "exampleTitle": "...", "exampleDescription": "what is visible and which design choice exemplifies the pattern", "rationale": "one sentence" }] }

Rules:
- Only cite patterns clearly evidenced by visible UI; do not infer from product reputation
- confidence >= 0.7 only when at least one visible affordance exemplifies the pattern's solution
- If nothing clears 0.7, return { "matches": [] }
- exampleDescription <= 360 chars, focused on what is visible
- Never wrap output in markdown fences`;

  const response = await anthropic.messages.create({
    model: SONNET_MODEL,
    max_tokens: 900,
    temperature: 0,
    system: [
      {
        type: 'text',
        text: systemPrompt,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: candidate.mediaType,
              data: candidate.imageBase64,
            },
          },
          {
            type: 'text',
            text: `Product: ${candidate.productName ?? 'unknown'}\nSource: ${candidate.sourceUrl}`,
          },
        ],
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  let parsed: z.infer<typeof VisionResponseSchema>;
  try {
    parsed = VisionResponseSchema.parse(extractJson(text));
  } catch (err) {
    console.warn('[pattern-intel] vision parse failed:', err, 'raw:', text.slice(0, 200));
    return [];
  }

  return parsed.matches
    .filter((m) => m.confidence >= MIN_CONFIDENCE && validSlugs.has(m.slug))
    .slice(0, 3);
}
