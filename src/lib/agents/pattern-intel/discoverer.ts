import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import type { NewsItem, PatternRef } from './types';

const SONNET_MODEL = 'claude-sonnet-4-5-20250929';
const MIN_CLUSTER_SIZE = 3;
const MAX_PROPOSALS = 2;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ProposalSchema = z.object({
  proposedSlug: z.string().regex(/^[a-z][a-z0-9-]{2,60}$/),
  proposedTitle: z.string().min(3).max(80),
  proposedCategory: z.string().min(3).max(60),
  problem: z.string().min(20).max(600),
  solution: z.string().min(20).max(600),
  rationale: z.string().min(20).max(600),
  supportingItemIds: z.array(z.string()).min(MIN_CLUSTER_SIZE).max(20),
});

const DiscovererResponseSchema = z.object({
  proposals: z.array(ProposalSchema).max(MAX_PROPOSALS),
});

export interface ClusterProposal {
  proposedSlug: string;
  proposedTitle: string;
  proposedCategory: string;
  problem: string;
  solution: string;
  rationale: string;
  supportingSources: { newsletterId: string; title: string; slug: string }[];
  clusterSize: number;
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

export async function discoverNewPatterns(
  unmatchedItems: NewsItem[],
  existingPatterns: PatternRef[],
): Promise<ClusterProposal[]> {
  if (unmatchedItems.length < MIN_CLUSTER_SIZE) return [];

  const existingList = existingPatterns.map((p) => `${p.slug} (${p.category})`).join(', ');
  const itemsBlock = unmatchedItems
    .map((it) => `[${it.id}] ${it.title}\n    ${it.summary}`)
    .join('\n');

  const categories = Array.from(new Set(existingPatterns.map((p) => p.category)));

  const response = await anthropic.messages.create({
    model: SONNET_MODEL,
    max_tokens: 2000,
    temperature: 0,
    system: `You discover emerging AI UX patterns from news clusters.

Existing pattern slugs (do not re-propose any concept that overlaps these): ${existingList}

Existing categories: ${categories.join(', ')}

Given a list of news items that the per-item classifier could NOT match to any existing pattern, identify up to ${MAX_PROPOSALS} concrete recurring UX patterns evidenced by clusters of these items. Each proposal must:
- be supported by AT LEAST ${MIN_CLUSTER_SIZE} of the items (cite their bracketed ids)
- name a specific UX behavior, not a technology trend, not a model capability
- not duplicate or trivially restate any existing pattern
- use one of the existing categories (do not invent new ones)
- propose a kebab-case slug

Return strict JSON: { "proposals": [{ "proposedSlug": "...", "proposedTitle": "...", "proposedCategory": "...", "problem": "...", "solution": "...", "rationale": "why this clusters and why it's missing from the library", "supportingItemIds": ["id1","id2",...] }] }

If no genuine pattern emerges, return { "proposals": [] }. Never wrap output in markdown fences.`,
    messages: [
      {
        role: 'user',
        content: `Unmatched items from the last 7 days:\n\n${itemsBlock}`,
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  let parsed: z.infer<typeof DiscovererResponseSchema>;
  try {
    parsed = DiscovererResponseSchema.parse(extractJson(text));
  } catch (err) {
    console.warn('[pattern-intel] discoverer parse failed:', err, 'raw:', text.slice(0, 300));
    return [];
  }

  const itemById = new Map(unmatchedItems.map((it) => [it.id, it]));
  const validSlugs = new Set(existingPatterns.map((p) => p.slug));
  const validCategories = new Set(categories);

  return parsed.proposals
    .filter((p) => !validSlugs.has(p.proposedSlug))
    .filter((p) => validCategories.has(p.proposedCategory))
    .map((p) => {
      const supporting = p.supportingItemIds
        .map((id) => itemById.get(id))
        .filter((it): it is NewsItem => it !== undefined)
        .map((it) => ({ newsletterId: it.id, title: it.title, slug: it.slug }));
      return {
        proposedSlug: p.proposedSlug,
        proposedTitle: p.proposedTitle,
        proposedCategory: p.proposedCategory,
        problem: p.problem,
        solution: p.solution,
        rationale: p.rationale,
        supportingSources: supporting,
        clusterSize: supporting.length,
      };
    })
    .filter((p) => p.clusterSize >= MIN_CLUSTER_SIZE);
}
