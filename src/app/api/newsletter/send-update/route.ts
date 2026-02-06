import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';

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

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { patterns, apiKey } = patternUpdateSchema.parse(body);

    // Verify API key
    if (apiKey !== process.env.NEWSLETTER_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all active subscribers
    const subscribers = await prisma.subscriber.findMany({
      where: { active: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json(
        { message: 'No active subscribers found' },
        { status: 200 }
      );
    }

    // Send emails to all subscribers
    const emailPromises = subscribers.map((subscriber) =>
      sendPatternUpdateEmail(subscriber.email, subscriber.unsubscribeToken, patterns)
    );

    const results = await Promise.allSettled(emailPromises);
    const successCount = results.filter((r) => r.status === 'fulfilled').length;
    const failureCount = results.filter((r) => r.status === 'rejected').length;

    return NextResponse.json({
      message: 'Pattern update emails sent',
      totalSubscribers: subscribers.length,
      successCount,
      failureCount,
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
      { error: 'Failed to send update emails' },
      { status: 500 }
    );
  }
}

async function sendPatternUpdateEmail(
  email: string,
  unsubscribeToken: string,
  patterns: Array<{ id: string; title: string; description: string; slug: string; category: string }>
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxdesign.guide';
  const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;

  // Generate pattern cards HTML
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

  try {
    const result = await resend.emails.send({
      from: 'AI UX Patterns <imran@aiuxdesign.guide>',
      to: email,
      subject: `New AI Design Pattern${patterns.length > 1 ? 's' : ''} Added! 🎨`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New AI Design Patterns</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
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
                  Explore all <strong>24+ AI design patterns</strong> in our collection
                </p>
                <a href="${baseUrl}"
                   style="display: inline-block; background: #000000;
                          color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px;
                          font-weight: 600; font-size: 16px;">
                  View All Patterns
                </a>
              </div>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

              <p style="font-size: 12px; color: #999999; text-align: center;">
                <a href="${unsubscribeUrl}" style="color: #666666; text-decoration: underline;">
                  Unsubscribe from these emails
                </a>
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log('Pattern update email sent successfully:', { id: result.data?.id, timestamp: new Date().toISOString() });
    return result;
  } catch (error) {
    console.error('Failed to send pattern update email:', { error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() });
    throw error;
  }
}
