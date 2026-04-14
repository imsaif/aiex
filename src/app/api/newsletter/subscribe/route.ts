import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { addSubscriberToBeehiiv } from '@/lib/beehiiv';
import { validateEmailSecurity } from '@/lib/email-validation';
import { NEWSLETTER_SOURCES, PDF_DOWNLOAD_SOURCES } from '@/types/newsletter';
import type { NewsletterSource } from '@/types/newsletter';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.enum(NEWSLETTER_SOURCES as unknown as [string, ...string[]]).optional().default('direct'),
});

export async function POST(request: NextRequest) {
  // Rate limiting by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const rateLimit = checkRateLimit(
    ip,
    'newsletter-subscribe',
    RATE_LIMIT_PRESETS.SUBSCRIBE.limit,
    RATE_LIMIT_PRESETS.SUBSCRIBE.windowMs
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many subscription attempts. Please try again later.' },
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
    const { email, source } = subscribeSchema.parse(body);

    // Bot protection: honeypot + disposable email check
    const securityError = validateEmailSecurity(email, body);
    if (securityError) {
      return NextResponse.json({ error: securityError }, { status: 400 });
    }

    const isPdfFlow = PDF_DOWNLOAD_SOURCES.includes(source as NewsletterSource);
    const existingSubscriber = await prisma.subscriber.findUnique({ where: { email } });

    if (existingSubscriber?.active) {
      // For PDF flows, don't block re-downloads — caller delivers the PDF on-page.
      if (isPdfFlow) {
        return NextResponse.json(
          { message: 'Your download is ready!' },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter.' },
        { status: 400 }
      );
    }

    if (existingSubscriber && !existingSubscriber.active) {
      // Reactivate soft-deleted subscriber
      await prisma.subscriber.update({ where: { email }, data: { active: true } });
    } else {
      await prisma.subscriber.create({ data: { email } });
    }

    // Sync to Beehiiv (fire-and-forget). Beehiiv Automations — keyed on
    // signup_source — handle the welcome email.
    addSubscriberToBeehiiv(email, { utmSource: source, signupSource: source }).catch(() => {});

    const message = isPdfFlow
      ? 'Your download is ready!'
      : existingSubscriber
        ? 'Welcome back! Your subscription has been reactivated.'
        : 'Successfully subscribed!';

    return NextResponse.json({ message }, { status: existingSubscriber ? 200 : 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
