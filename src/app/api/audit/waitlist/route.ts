import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { validateEmailSecurity } from '@/lib/email-validation';
import { addSubscriberToBeehiiv } from '@/lib/beehiiv';

const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const rateLimit = checkRateLimit(
    ip,
    'audit-waitlist',
    RATE_LIMIT_PRESETS.SUBSCRIBE.limit,
    RATE_LIMIT_PRESETS.SUBSCRIBE.windowMs
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Security checks
    const securityError = validateEmailSecurity(body.email || '', body);
    if (securityError) {
      return NextResponse.json({ error: securityError }, { status: 400 });
    }

    const { email } = waitlistSchema.parse(body);

    // Sync to Beehiiv with paywall-waitlist source tag
    addSubscriberToBeehiiv(email, { utmSource: 'paywall-waitlist' });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    console.error('Waitlist signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
