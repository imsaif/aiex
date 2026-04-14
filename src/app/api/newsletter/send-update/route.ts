import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

/**
 * Generate a pattern-update newsletter HTML blob for the admin to paste into a
 * new Beehiiv post. Beehiiv free/Launch tier has no Posts API, so actual
 * delivery happens by copy-paste.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patterns, apiKey } = patternUpdateSchema.parse(body);

    if (apiKey !== process.env.NEWSLETTER_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxdesign.guide';
    const patternsHtml = patterns
      .map(
        (pattern) => `
        <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #000000;">
          <h3 style="margin: 0 0 10px 0; color: #000000; font-size: 20px; font-weight: 600;">
            ${pattern.title}
          </h3>
          <p style="color: #666666; margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; font-weight: 600;">
            ${pattern.category}
          </p>
          <p style="color: #1a1a1a; margin: 0 0 15px 0; line-height: 1.6;">
            ${pattern.description}
          </p>
          <a href="${baseUrl}/patterns/${pattern.slug}"
             style="display: inline-block; background: #000000;
                    color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 6px;
                    font-weight: 600; font-size: 14px;">
            View Pattern →
          </a>
        </div>
      `
      )
      .join('');

    const subject = `New AI Design Pattern${patterns.length > 1 ? 's' : ''} Added! 🎨`;

    const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #000000; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
              New Pattern${patterns.length > 1 ? 's' : ''} Added! 🎨
            </h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
              ${patterns.length} new AI design pattern${patterns.length > 1 ? 's' : ''} ${patterns.length > 1 ? 'are' : 'is'} now available
            </p>
          </div>

          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 30px;">
              We've just added ${patterns.length > 1 ? 'some exciting new patterns' : 'a new pattern'} to our AI UX Patterns collection!
            </p>

            ${patternsHtml}

            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center; border-left: 4px solid #000000;">
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #1a1a1a;">
                Explore all AI design patterns in our collection
              </p>
              <a href="${baseUrl}"
                 style="display: inline-block; background: #000000;
                        color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px;
                        font-weight: 600; font-size: 16px;">
                View All Patterns
              </a>
            </div>
          </div>
        </div>
      `;

    return NextResponse.json({
      message: 'Pattern-update HTML generated. Copy this into a new Beehiiv post to send.',
      subject,
      html,
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
      { error: 'Failed to generate update HTML' },
      { status: 500 }
    );
  }
}
