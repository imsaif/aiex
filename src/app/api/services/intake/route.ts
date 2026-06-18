import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';
import { checkRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { validateEmailSecurity } from '@/lib/email-validation';

// Quote-based "audit my product" service intake. Saves a ServiceLead + emails
// the admin via Resend. No payment happens here — the human replies with scope
// + a Dodo Static Payment Link. See the ServiceLead model in prisma/schema.prisma.

const intakeSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().email('Invalid email address'),
  company: z.string().trim().max(200).optional(),
  // NOTE: the honeypot is a *separate* hidden field named `website_url`
  // (see email-validation.ts) — this is the real, user-facing product URL.
  productUrl: z.string().trim().max(500).optional(),
  productType: z.string().trim().max(120).optional(),
  message: z.string().trim().min(1, 'Tell us what you want audited').max(4000),
  budget: z.string().trim().max(120).optional(),
  timeline: z.string().trim().max(120).optional(),
  source: z.enum(['services-page', 'post-audit-cta']).optional().default('services-page'),
});

function hashIp(ip: string | null | undefined): string | null {
  if (!ip || ip === 'unknown') return null;
  const salt = process.env.AUDIT_SAMPLE_IP_SALT || process.env.HANDBOOK_TOKEN_SECRET || 'aiux';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 16);
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const rateLimit = checkRateLimit(
    ip,
    'services-intake',
    RATE_LIMIT_PRESETS.SUBSCRIBE.limit,
    RATE_LIMIT_PRESETS.SUBSCRIBE.windowMs
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)) },
      }
    );
  }

  try {
    const body = await request.json();
    const data = intakeSchema.parse(body);

    // Bot protection: honeypot (website_url) + disposable email
    const securityError = validateEmailSecurity(data.email, body);
    if (securityError) {
      return NextResponse.json({ error: securityError }, { status: 400 });
    }

    const userAgent = request.headers.get('user-agent')?.slice(0, 200) || null;

    // Persist the lead. Best-effort: a DB hiccup shouldn't lose the lead, so we
    // still send the admin email below even if this throws.
    let saved = false;
    try {
      await prisma.serviceLead.create({
        data: {
          name: data.name,
          email: data.email,
          company: data.company || null,
          productUrl: data.productUrl || null,
          productType: data.productType || null,
          message: data.message,
          budget: data.budget || null,
          timeline: data.timeline || null,
          source: data.source,
          ipHash: hashIp(ip),
          userAgent,
        },
      });
      saved = true;
    } catch (err) {
      console.error('[services/intake] ServiceLead write failed:', err);
    }

    // Email the admin so a real human can reply with scope + a Dodo link.
    const rows: Array<[string, string | undefined]> = [
      ['Name', data.name],
      ['Email', data.email],
      ['Company', data.company],
      ['Product URL', data.productUrl],
      ['Product type', data.productType],
      ['Budget', data.budget],
      ['Timeline', data.timeline],
      ['Source', data.source],
    ];
    const detailHtml = rows
      .filter(([, v]) => v)
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:13px;">${k}</td><td style="padding:4px 0;color:#162036;font-size:14px;">${esc(String(v))}</td></tr>`
      )
      .join('');

    try {
      await resend.emails.send({
        from: 'AI UX Patterns <imran@aiuxdesign.guide>',
        replyTo: data.email,
        to: process.env.ADMIN_EMAIL || 'imranrizom@gmail.com',
        subject: `New audit-service lead: ${data.company || data.email}`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;">
            <h2 style="font-size:18px;color:#162036;margin:0 0 16px;">New "Audit my product" lead</h2>
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">${detailHtml}</table>
            <p style="margin:20px 0 6px;color:#64748b;font-size:13px;">What they want audited</p>
            <p style="margin:0;color:#162036;font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(data.message)}</p>
            <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;">${saved ? 'Saved to ServiceLead.' : '⚠ NOT saved to DB (write failed) — this email is the only record.'} Reply to this email to reach them, then send a Dodo payment link.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('[services/intake] admin email failed:', err);
      // If neither the DB write nor the email worked, surface a failure so the
      // user retries rather than silently losing their request.
      if (!saved) {
        return NextResponse.json(
          { error: 'Something went wrong. Please email us directly at imranrizom@gmail.com.' },
          { status: 500 }
        );
      }
    }

    // NOTE: deliberately NOT auto-subscribing service leads to the newsletter.
    // A "hire us" enquiry is a different intent than a newsletter signup, so we
    // don't opt them into the daily list without consent. If we later decide to,
    // re-add: addSubscriberToBeehiiv(data.email, { signupSource: 'services' }).

    return NextResponse.json(
      { message: "Thanks, we'll be in touch within 1-2 business days." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Invalid request data' },
        { status: 400 }
      );
    }

    console.error('Service intake error:', error);
    return NextResponse.json(
      { error: 'Failed to submit. Please try again.' },
      { status: 500 }
    );
  }
}
