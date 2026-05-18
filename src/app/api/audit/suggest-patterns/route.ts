import { after, NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { patterns } from '@/data/patterns';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SuggestionSchema = z.object({
  suggestions: z
    .array(
      z.object({
        slug: z.string(),
        title: z.string(),
        why: z.string(),
      }),
    )
    .min(1)
    .max(6),
});

function hashIp(ip: string | null | undefined): string | null {
  if (!ip || ip === 'unknown') return null;
  const salt = process.env.AUDIT_SAMPLE_IP_SALT || process.env.HANDBOOK_TOKEN_SECRET || 'aiux';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 16);
}

function extractJson(text: string): string | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) return null;
  return text.slice(first, last + 1);
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent');

  const rate = checkRateLimit(ip, 'suggest-patterns', 10, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', resetIn: rate.resetIn },
      { status: 429 },
    );
  }

  let body: { intent?: string; productType?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const intent = (body.intent ?? '').trim();
  if (intent.length < 8) {
    return NextResponse.json(
      { error: 'Tell us a bit more about what you are designing (at least 8 characters).' },
      { status: 400 },
    );
  }
  if (intent.length > 1000) {
    return NextResponse.json({ error: 'Description is too long (max 1000 characters).' }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  const library = patterns
    .map((p) => `- ${p.title} (${p.slug}) — ${p.description}`)
    .join('\n');

  const system = `You are an AI UX pattern librarian for aiuxdesign.guide. The user describes what they're trying to design. Recommend 3 to 5 of the most relevant patterns from the library below.

Rank by relevance to the user's stated intent. Skip patterns that don't apply. For each suggestion, write one short sentence (max 22 words) explaining specifically why it's relevant to THIS intent — not a generic pattern definition.

## Pattern library
${library}

## Output format (strict JSON, no markdown fences, no preamble)
{
  "suggestions": [
    { "slug": "<exact slug from library>", "title": "<exact title from library>", "why": "<one sentence tied to the user's intent>" }
  ]
}

Hard rules:
- 3 to 5 suggestions. Quality over quantity.
- "slug" MUST match a slug from the library exactly.
- Never invent patterns. Never duplicate.
- "why" must reference the user's intent, not just restate the pattern.`;

  let parsed: z.infer<typeof SuggestionSchema> | null = null;
  let rawText = '';

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      temperature: 0,
      system,
      messages: [{ role: 'user', content: intent }],
    });
    const block = response.content.find((b) => b.type === 'text');
    rawText = block?.type === 'text' ? block.text : '';
    const jsonText = extractJson(rawText);
    if (!jsonText) throw new Error('No JSON object in response');
    const obj = JSON.parse(jsonText);
    parsed = SuggestionSchema.parse(obj);
  } catch (err) {
    console.error('[suggest-patterns] failed:', err instanceof Error ? err.message : err, '\n--- raw ---\n', rawText.slice(0, 1000));
    return NextResponse.json({ error: 'Could not generate suggestions. Please try again.' }, { status: 502 });
  }

  const validSlugs = new Set(patterns.map((p) => p.slug));
  const filtered = parsed.suggestions
    .filter((s) => validSlugs.has(s.slug))
    .slice(0, 5);

  if (filtered.length === 0) {
    return NextResponse.json({ error: 'No matching patterns found. Try rephrasing.' }, { status: 502 });
  }

  const suggestions = filtered.map((s) => {
    const p = patterns.find((pp) => pp.slug === s.slug)!;
    return {
      slug: p.slug,
      title: p.title,
      category: p.category,
      description: p.description,
      why: s.why,
      url: `/patterns/${p.slug}`,
    };
  });

  after(() =>
    prisma.patternIntent
      .create({
        data: {
          intent: intent.slice(0, 1000),
          source: 'audit_empty_state',
          productType: body.productType ?? null,
          suggestedPatterns: JSON.stringify(suggestions.map((s) => s.slug)),
          latencyMs: Date.now() - startedAt,
          ipHash: hashIp(ip),
          userAgent: userAgent ? userAgent.slice(0, 200) : null,
        },
      })
      .catch((e) => console.error('[PatternIntent] write failed:', e instanceof Error ? e.message : e)),
  );

  return NextResponse.json({ suggestions });
}
