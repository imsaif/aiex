import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';
import { generateGuideToken } from '@/lib/guide-token';
import { checkRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';

// Request validation schema
const requestSchema = z.object({
  email: z.string().email('Invalid email address'),
  guideSlug: z.string().min(1, 'Guide slug is required'),
  guideTitle: z.string().min(1, 'Guide title is required'),
});

/**
 * Handle guide PDF download requests
 * Subscribes user to newsletter and sends email with download link
 */
export async function POST(request: NextRequest) {
  // Rate limiting by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const rateLimit = checkRateLimit(
    ip,
    'guide-download',
    RATE_LIMIT_PRESETS.SUBSCRIBE.limit,
    RATE_LIMIT_PRESETS.SUBSCRIBE.windowMs
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many download attempts. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)),
        },
      }
    );
  }

  try {
    // Parse and validate request body
    const body = await request.json();
    const { email, guideSlug, guideTitle } = requestSchema.parse(body);

    // Check if email already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (!existingSubscriber.active) {
        // Reactivate subscription
        await prisma.subscriber.update({
          where: { email },
          data: { active: true },
        });
      }
      // Subscriber exists (active or just reactivated) - send download email
    } else {
      // Create new subscriber
      await prisma.subscriber.create({
        data: { email },
      });
    }

    // Generate download token valid for 30 days
    const token = generateGuideToken(email, guideSlug);
    const downloadUrl = `${getBaseUrl(request)}/api/guides/download?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

    // Send email with download link
    try {
      await resend.emails.send({
        from: 'AI UX Design Guide <imran@aiuxdesign.guide>',
        to: email,
        subject: `Your ${guideTitle} PDF is Ready`,
        html: getGuideDownloadEmail(guideTitle, downloadUrl, email),
      });

      const redactedEmail = email.replace(/^(.{2}).*(@.*)$/, '$1***$2');
      console.log(`Guide PDF requested: ${guideSlug} by ${redactedEmail}`);

      return NextResponse.json({
        success: true,
        message: 'Check your email for the download link!',
        downloadUrl, // Also return URL for immediate download option
      });
    } catch (emailError) {
      console.error('Failed to send guide download email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send download email. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Guide download request error:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Get base URL from request
 */
function getBaseUrl(request: NextRequest): string {
  // Use NEXT_PUBLIC_SITE_URL if available, otherwise construct from request
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

/**
 * Generate HTML email for guide download
 */
function getGuideDownloadEmail(guideTitle: string, downloadUrl: string, email: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Guide PDF is Ready</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #000000; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Your Guide is Ready!</h1>
        </div>

        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Thank you for downloading <strong>${guideTitle}</strong>!
          </p>

          <p style="font-size: 16px; margin-bottom: 20px;">
            Your PDF is ready. Click the button below to download it now (or use the link anytime within the next 30 days).
          </p>

          <div style="margin: 30px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
              <tr>
                <td style="text-align: center;">
                  <a href="${downloadUrl}"
                     style="display: inline-block; background: #000000; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 18px; border: 2px solid #000000;">
                    Download PDF
                  </a>
                </td>
              </tr>
            </table>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #000000;">
            <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #000000; font-weight: 600;">What's Inside:</h2>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Step-by-step lessons</li>
              <li style="margin-bottom: 8px;">Practical exercises</li>
              <li style="margin-bottom: 8px;">Best practices & tips</li>
              <li style="margin-bottom: 8px;">Real-world examples</li>
            </ul>
          </div>

          <p style="font-size: 16px; margin-bottom: 20px;">
            You're now subscribed to our newsletter and will receive updates about new guides and AI design patterns.
          </p>

          <p style="font-size: 16px; margin-bottom: 20px;">
            Explore more learning resources:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.aiuxdesign.guide/guides"
               style="display: inline-block; background: #ffffff; border: 2px solid #000000;
                      color: #000000; padding: 12px 30px; text-decoration: none; border-radius: 8px;
                      font-weight: 600; font-size: 16px;">
              Browse All Guides
            </a>
          </div>

          <p style="font-size: 12px; color: #999999; text-align: center; margin-top: 30px;">
            Download link valid for 30 days
          </p>
        </div>
      </body>
    </html>
  `;
}
