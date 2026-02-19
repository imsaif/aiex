import { NextRequest, NextResponse } from 'next/server';
import { generateHandbookToken } from '@/lib/handbook-token';
import { z } from 'zod';
import { validateEmailSecurity } from '@/lib/email-validation';
import { checkRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';

const emailSchema = z.object({
  email: z.string().email('Invalid email format'),
});

/**
 * Generate download token and subscribe user to handbook
 * Returns token that can be used with /api/handbook/download
 */
export async function POST(request: NextRequest) {
  // Rate limiting by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const rateLimit = checkRateLimit(
    ip,
    'handbook-generate-pdf',
    RATE_LIMIT_PRESETS.SUBSCRIBE.limit,
    RATE_LIMIT_PRESETS.SUBSCRIBE.windowMs
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
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

    // Validate email using Zod
    const validation = emailSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Bot protection: honeypot + disposable email check
    const securityError = validateEmailSecurity(email, body);
    if (securityError) {
      return NextResponse.json({ error: securityError }, { status: 400 });
    }

    // Subscribe user to newsletter (forward client IP so rate limiting works correctly)
    const subscribeResponse = await fetch(
      new URL('/api/newsletter/subscribe', request.url),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': ip,
        },
        body: JSON.stringify({ email, source: 'handbook' }),
      }
    );

    if (!subscribeResponse.ok) {
      const subscribeData = await subscribeResponse.json();
      console.error('Newsletter subscription failed:', subscribeData);
      // Continue even if subscription fails - still generate token
    } else {
      const redactedEmail = email.replace(/^(.{2}).*(@.*)$/, '$1***$2');
      console.log(`Handbook PDF requested by: ${redactedEmail}`);
    }

    // Generate download token valid for 30 days
    const token = generateHandbookToken(email);

    return NextResponse.json({
      success: true,
      message: 'Handbook ready for download',
      token: token,
      email: email,
      downloadUrl: `/api/handbook/download?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
    });
  } catch (error) {
    console.error('Error processing handbook request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
