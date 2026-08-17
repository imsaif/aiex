import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { ProductType } from '@/types/audit';
import { isE2EMode } from '@/lib/audit/e2e-mock';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const VALID_TYPES: ProductType[] = [
  'chat-interface',
  'ai-agent',
  'recommendation-system',
  'content-generation',
  'dashboard-analytics',
  'embedded-ai-feature',
  'search-discovery',
  'reports-documents',
];

function detectMediaType(base64: string): 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif' {
  if (base64.startsWith('/9j/')) return 'image/jpeg';
  if (base64.startsWith('iVBORw')) return 'image/png';
  if (base64.startsWith('UklGR')) return 'image/webp';
  if (base64.startsWith('R0lGOD')) return 'image/gif';
  return 'image/jpeg';
}

export async function POST(request: NextRequest) {
  // E2E_MODE short-circuit — mirrors the analyze route. Playwright specs hit
  // this branch so auto-detect is deterministic and costs no Anthropic spend.
  //
  // This is load-bearing, not just a spend optimisation. CI runs with
  // `ANTHROPIC_API_KEY: sk-e2e-placeholder`, so the real call 401s; the caller
  // in ScreenshotUpload swallows that (`.catch(() => {})`), productType stays
  // null, and because the manual tiles sit behind `showPicker` the funnel has
  // no way forward at all. That is what left E2E red from 2026-07-13.
  //
  // `x-e2e-product-type` lets a spec pin a specific type; default is
  // chat-interface, matching runOneAudit's default productLabel.
  if (isE2EMode()) {
    const pinned = VALID_TYPES.find((t) => t === request.headers.get('x-e2e-product-type'));
    return NextResponse.json({ productType: pinned ?? 'chat-interface' });
  }

  try {
    const { image } = (await request.json()) as { image?: string };
    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: 'Missing image' }, { status: 400 });
    }

    const base64 = image.includes(',') ? image.split(',')[1] : image;
    const mediaType = detectMediaType(base64);

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 50,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 },
            },
            {
              type: 'text',
              text: `Classify this product UI screenshot into ONE of:
- chat-interface (conversational AI like ChatGPT, Claude, Gemini)
- ai-agent (autonomous task agents, browser agents, coding agents)
- recommendation-system (feeds, suggestions, personalized lists)
- content-generation (image/video/text generation tools)
- dashboard-analytics (AI insights, metrics, admin overviews)
- embedded-ai-feature (an AI copilot/assist inside an existing tool, e.g. a side panel)
- search-discovery (AI or semantic search, discovery feeds)
- reports-documents (AI-generated reports, data extraction, enrichment)

Respond with ONLY the slug, nothing else. If none fit, respond with: general`,
            },
          ],
        },
      ],
    });

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { text: string }).text)
      .join('')
      .trim()
      .toLowerCase();

    const match = VALID_TYPES.find((t) => text.includes(t));
    return NextResponse.json({ productType: match ?? 'general' });
  } catch (err) {
    console.error('[classify-product] error:', err);
    return NextResponse.json({ error: 'Classification failed' }, { status: 500 });
  }
}
