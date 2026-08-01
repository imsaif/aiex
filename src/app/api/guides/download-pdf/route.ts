import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { generateGuideToken } from '@/lib/guide-token';
import { checkRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { validateEmailSecurity } from '@/lib/email-validation';
import { addSubscriberToBeehiiv } from '@/lib/beehiiv';

const requestSchema = z.object({
  email: z.string().email('Invalid email address'),
  guideSlug: z.string().min(1, 'Guide slug is required'),
  guideTitle: z.string().min(1, 'Guide title is required'),
});

/**
 * Handle guide PDF download requests. Subscribes the user (fire-and-forget
 * Beehiiv sync — Beehiiv sends the welcome email via Automation) and returns
 * a tokenized download URL for the client to open immediately.
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
    const body = await request.json();
    const { email, guideSlug } = requestSchema.parse(body);

    const securityError = validateEmailSecurity(email, body);
    if (securityError) {
      return NextResponse.json({ error: securityError }, { status: 400 });
    }

    const existingSubscriber = await prisma.subscriber.findUnique({ where: { email } });

    if (existingSubscriber && !existingSubscriber.active) {
      await prisma.subscriber.update({ where: { email }, data: { active: true, source: 'guides' } });
    } else if (!existingSubscriber) {
      await prisma.subscriber.create({ data: { email, source: 'guides' } });
    }

    // Await so the Beehiiv sync completes before the HTTP response returns.
    try {
      await addSubscriberToBeehiiv(email, { signupSource: 'guides', utmSource: 'guides' });
    } catch (err) {
      console.error('[guides/download-pdf] Beehiiv sync failed:', err);
    }

    const token = generateGuideToken(email, guideSlug);
    const downloadUrl = `${getBaseUrl(request)}/api/guides/download?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

    const redactedEmail = email.replace(/^(.{2}).*(@.*)$/, '$1***$2');
    console.log(`Guide PDF requested: ${guideSlug} by ${redactedEmail}`);

    return NextResponse.json({
      success: true,
      message: 'Your download is ready!',
      downloadUrl,
    });
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

function getBaseUrl(request: NextRequest): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}
