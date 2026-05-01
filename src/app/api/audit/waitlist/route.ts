import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
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

    const securityError = validateEmailSecurity(body.email || '', body);
    if (securityError) {
      return NextResponse.json({ error: securityError }, { status: 400 });
    }

    const { email } = waitlistSchema.parse(body);

    // Upsert into Prisma — re-submits and existing newsletter subscribers
    // are valid waitlist joins, just not new rows.
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (!existing) {
      await prisma.subscriber.create({ data: { email } });
    } else if (!existing.active) {
      await prisma.subscriber.update({ where: { email }, data: { active: true } });
    }

    // Re-stamp signup_source on every submit so existing subscribers from
    // other sources get filterable as waitlist members in Beehiiv.
    await addSubscriberToBeehiiv(email, {
      utmSource: 'audit-waitlist',
      signupSource: 'audit-waitlist',
    });

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
