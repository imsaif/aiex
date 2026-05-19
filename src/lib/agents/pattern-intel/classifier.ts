import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import {
  ClassifierResponseSchema,
  NewsItem,
  PatternMatch,
  PatternRef,
} from './types';

const HAIKU_MODEL = 'claude-haiku-4-5-20251001';
const MIN_CONFIDENCE = 0.6;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildSystemPrompt(patterns: PatternRef[]): string {
  const list = patterns
    .map(
      (p) =>
        `- ${p.slug} | ${p.title} (${p.category})\n    problem: ${p.problem}\n    solution: ${p.solution}`,
    )
    .join('\n');

  return `You are a pattern-matching classifier for an AI UX pattern library.

You will be given a single news item (title + summary + url). The library contains exactly the following ${patterns.length} patterns:

${list}

For each news item, identify up to 3 patterns from this list that the item meaningfully demonstrates, advances, or critiques. Return ONLY patterns from the list above; never invent new ones.

Confidence guidance:
- 0.9+ : item is explicitly about this pattern or shows a clear concrete instance
- 0.75 : item discusses a feature or design move that exemplifies the pattern
- 0.6  : item touches on the pattern's problem space but is not a direct example
- <0.6 : do not include

Return strict JSON matching: { "matches": [{ "slug": "exact-slug-from-list", "confidence": 0-1, "rationale": "one sentence, <=240 chars, cite what in the item triggered the match" }] }

If nothing matches at >=0.6, return { "matches": [] }. Never wrap output in markdown fences.`;
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
      if (depth === 0) {
        return JSON.parse(candidate.slice(start, i + 1));
      }
    }
  }
  throw new Error('unbalanced JSON');
}

export async function classifyNewsItem(
  item: NewsItem,
  patterns: PatternRef[],
  validSlugs: Set<string>,
): Promise<PatternMatch[]> {
  const systemPrompt = buildSystemPrompt(patterns);

  const response = await anthropic.messages.create({
    model: HAIKU_MODEL,
    max_tokens: 600,
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
        content: `Title: ${item.title}\nSummary: ${item.summary}\nURL: https://www.aiuxdesign.guide/news/${item.slug}`,
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  let parsed: z.infer<typeof ClassifierResponseSchema>;
  try {
    parsed = ClassifierResponseSchema.parse(extractJson(text));
  } catch (err) {
    console.warn('[pattern-intel] classifier parse failed:', err, 'raw:', text.slice(0, 200));
    return [];
  }

  return parsed.matches
    .filter((m) => m.confidence >= MIN_CONFIDENCE && validSlugs.has(m.slug))
    .slice(0, 3);
}
