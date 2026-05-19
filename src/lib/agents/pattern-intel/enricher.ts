import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { EnricherResponseSchema, NewsItem, PatternMatch, PatternRef } from './types';

const SONNET_MODEL = 'claude-sonnet-4-5-20250929';
const ENRICH_CONFIDENCE_FLOOR = 0.75;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

export interface EnricherProposal {
  shouldEnrich: boolean;
  exampleTitle?: string;
  exampleDescription?: string;
  rationale?: string;
}

/**
 * Decides whether a news item is a strong enough concrete example
 * to attach as an example candidate to the matched pattern.
 */
export async function proposeExampleFromNews(
  item: NewsItem,
  match: PatternMatch,
  pattern: PatternRef,
): Promise<EnricherProposal | null> {
  if (match.confidence < ENRICH_CONFIDENCE_FLOOR) return null;

  const response = await anthropic.messages.create({
    model: SONNET_MODEL,
    max_tokens: 600,
    temperature: 0,
    system: `You curate concrete examples for an AI UX pattern library. Examples must be specific products with shipping features that demonstrate the pattern in production — not opinion pieces, not roadmap announcements, not theoretical discussions.

Return strict JSON: { "shouldEnrich": boolean, "exampleTitle": "...", "exampleDescription": "...", "rationale": "..." }

shouldEnrich = true ONLY if all hold:
- the item names a specific product or feature that exists in production
- the feature visibly demonstrates the pattern's solution
- a designer reading the pattern page would find this example genuinely useful (not redundant with stock examples)

If shouldEnrich is false, return { "shouldEnrich": false } and omit other fields.
exampleTitle <= 90 chars, exampleDescription one paragraph <= 360 chars focused on what is visible and which design choice exemplifies the pattern.
Never wrap output in markdown.`,
    messages: [
      {
        role: 'user',
        content: `Pattern: ${pattern.title} (${pattern.slug})
Problem: ${pattern.problem}
Solution: ${pattern.solution}

Candidate news item:
Title: ${item.title}
Summary: ${item.summary}

Classifier rationale: ${match.rationale}
Confidence: ${match.confidence}`,
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  let parsed: z.infer<typeof EnricherResponseSchema>;
  try {
    parsed = EnricherResponseSchema.parse(extractJson(text));
  } catch (err) {
    console.warn('[pattern-intel] enricher parse failed:', err, 'raw:', text.slice(0, 200));
    return null;
  }

  if (!parsed.shouldEnrich || !parsed.exampleTitle || !parsed.exampleDescription) {
    return { shouldEnrich: false };
  }

  return {
    shouldEnrich: true,
    exampleTitle: parsed.exampleTitle,
    exampleDescription: parsed.exampleDescription,
    rationale: parsed.rationale,
  };
}
