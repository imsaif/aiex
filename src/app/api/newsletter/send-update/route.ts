import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Pattern update validation schema
const patternUpdateSchema = z.object({
  patterns: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      slug: z.string(),
      category: z.string(),
    })
  ),
  apiKey: z.string(),
});

// POST - Log pattern updates for newsletter inclusion
// Bulk email sending has moved to Beehiiv dashboard.
// This route now validates the request and returns pattern info
// for manual inclusion in the next Beehiiv newsletter.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patterns, apiKey } = patternUpdateSchema.parse(body);

    // Verify API key
    if (apiKey !== process.env.NEWSLETTER_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(
      'Pattern update registered:',
      patterns.map((p) => p.title).join(', ')
    );

    return NextResponse.json({
      message: 'Pattern update registered. Send notification via Beehiiv dashboard.',
      patterns: patterns.map((p) => ({ title: p.title, slug: p.slug, category: p.category })),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Newsletter send-update error:', error);
    return NextResponse.json(
      { error: 'Failed to process update' },
      { status: 500 }
    );
  }
}
