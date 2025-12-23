import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';
import { generateHandbookToken } from '@/lib/handbook-token';
import { checkRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';

// Email validation schema
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.enum(['footer', 'handbook', 'direct', 'news', 'audit']).optional().default('direct'),
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
    // Parse and validate request body
    const body = await request.json();
    const { email, source } = subscribeSchema.parse(body);

    // Check if email already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.active) {
        // If they're already subscribed and requesting handbook, send handbook email
        if (source === 'handbook') {
          try {
            await sendWelcomeEmail(email, source);
            return NextResponse.json(
              { message: 'Your handbook is ready! Check your email for confirmation.' },
              { status: 200 }
            );
          } catch (emailError) {
            console.error('Email send failed for existing handbook request:', { email: email.replace(/^(.{2}).*(@.*)$/, '$1***$2'), source, error: emailError instanceof Error ? emailError.message : 'Unknown error', timestamp: new Date().toISOString() });
            return NextResponse.json(
              {
                message: 'Your handbook is ready, but we\'re having trouble sending the confirmation email right now.',
                emailWarning: true
              },
              { status: 200 }
            );
          }
        }

        // For other sources, return existing subscriber error
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter.' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        await prisma.subscriber.update({
          where: { email },
          data: { active: true },
        });

        // Send welcome email
        try {
          await sendWelcomeEmail(email, source);
        } catch (emailError) {
          console.error('Email send failed but reactivation succeeded:', { email: email.replace(/^(.{2}).*(@.*)$/, '$1***$2'), source, error: emailError instanceof Error ? emailError.message : 'Unknown error', timestamp: new Date().toISOString() });
          return NextResponse.json(
            {
              message: 'Welcome back! Your subscription has been reactivated. We\'re having trouble sending the confirmation email right now.',
              emailWarning: true
            },
            { status: 200 }
          );
        }

        return NextResponse.json(
          { message: 'Welcome back! Your subscription has been reactivated. Check your email for confirmation.' },
          { status: 200 }
        );
      }
    }

    // Create new subscriber
    const subscriber = await prisma.subscriber.create({
      data: { email },
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(email, source);
    } catch (emailError) {
      console.error('Email send failed but subscription created:', { subscriberId: subscriber.id, email: email.replace(/^(.{2}).*(@.*)$/, '$1***$2'), source, error: emailError instanceof Error ? emailError.message : 'Unknown error', timestamp: new Date().toISOString() });
      // Return success but note email issue
      return NextResponse.json(
        {
          message: 'Successfully subscribed! We\'re having trouble sending the confirmation email right now. Your subscription is active.',
          subscriberId: subscriber.id,
          emailWarning: true
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        message: 'Successfully subscribed! Check your email for confirmation.',
        subscriberId: subscriber.id
      },
      { status: 201 }
    );
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

async function sendWelcomeEmail(email: string, source: 'footer' | 'handbook' | 'direct' | 'news' | 'audit' = 'direct') {
  try {
    const isHandbookFlow = source === 'handbook';
    const isNewsFlow = source === 'news';
    const isAuditFlow = source === 'audit';
    const token = isHandbookFlow ? generateHandbookToken(email) : null;

    let subject: string;
    let html: string;

    if (isHandbookFlow) {
      subject = '🎨 Your AI Design Patterns Handbook is Ready!';
      html = getHandbookWelcomeEmail(email, token);
    } else if (isNewsFlow) {
      subject = '📱 Welcome to AIUX News!';
      html = getNewsWelcomeEmail();
    } else if (isAuditFlow) {
      subject = '🔍 Your AI UX Audit Report is Saved!';
      html = getAuditWelcomeEmail();
    } else {
      subject = 'Welcome to AI UX Patterns Newsletter! 🎨';
      html = getNewsletterWelcomeEmail();
    }

    const result = await resend.emails.send({
      from: 'AI UX Patterns <noreply@aiuxdesign.guide>',
      to: email,
      subject,
      html,
    });

    console.log('Welcome email sent successfully:', { id: result.data?.id, source, timestamp: new Date().toISOString() });
    return result;
  } catch (error) {
    console.error('Failed to send welcome email:', { source, error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() });
    // Throw error so we know email failed
    throw new Error(`Email delivery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function getNewsletterWelcomeEmail(): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to AI UX Patterns</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #000000; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to AI UX Patterns! 🎨</h1>
        </div>

        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Thank you for subscribing to our newsletter!
          </p>

          <p style="font-size: 16px; margin-bottom: 20px;">
            You'll now receive updates whenever we add new AI design patterns to our collection.
            We're building a comprehensive library of patterns to help designers and developers
            create better AI-powered experiences.
          </p>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #000000;">
            <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #000000; font-weight: 600;">What to expect:</h2>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">New AI design pattern announcements</li>
              <li style="margin-bottom: 8px;">Code examples and implementation guides</li>
              <li style="margin-bottom: 8px;">Best practices and design considerations</li>
              <li style="margin-bottom: 8px;">Interactive demos and Figma resources</li>
            </ul>
          </div>

          <p style="font-size: 16px; margin-bottom: 20px;">
            Explore our complete collection of <strong>24 AI design patterns</strong> across 7 categories:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.aiuxdesign.guide"
               style="display: inline-block; background: #000000;
                      color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px;
                      font-weight: 600; font-size: 16px; margin-bottom: 15px;">
              Explore All Patterns
            </a>
          </div>

          <p style="font-size: 14px; margin-bottom: 20px; text-align: center;">
            Want a quick overview? Check out our <a href="https://www.aiuxdesign.guide/handbook" style="color: #000000; text-decoration: underline;">6 Essential Patterns Handbook</a>
          </p>

        </div>
      </body>
    </html>
  `;
}

function getNewsWelcomeEmail(): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to AIUX News</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0f172a; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">📱 Welcome to AIUX News!</h1>
        </div>

        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            You're in! Every week, we'll send you a curated roundup of what's new in AI design.
          </p>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #0f172a;">
            <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #0f172a; font-weight: 600;">What you'll get:</h2>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;"><strong>Weekly roundups</strong> of what's new in ChatGPT, Claude, Gemini, Cursor, and more</li>
              <li style="margin-bottom: 8px;"><strong>Pattern breakdowns</strong> showing the UX thinking behind each update</li>
              <li style="margin-bottom: 8px;"><strong>Actionable insights</strong> you can apply to your own AI products</li>
            </ul>
          </div>

          <p style="font-size: 16px; margin-bottom: 20px;">
            While you wait for the next issue, catch up on our latest:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.aiuxdesign.guide/news"
               style="display: inline-block; background: #0f172a;
                      color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px;
                      font-weight: 600; font-size: 16px;">
              Read Latest Issue →
            </a>
          </div>

          <p style="font-size: 14px; color: #64748b; text-align: center; margin-top: 30px;">
            Questions? Just reply to this email.
          </p>
        </div>
      </body>
    </html>
  `;
}

function getHandbookWelcomeEmail(email: string, token: string | null): string {
  const downloadUrl = token
    ? `https://www.aiuxdesign.guide/api/handbook/download?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
    : 'https://www.aiuxdesign.guide/handbook';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your AI Design Patterns Handbook</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #000000; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">🎁 Your Handbook is Ready!</h1>
        </div>

        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Thank you for downloading the <strong>6 Essential AI Design Patterns Handbook</strong>!
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
                    📥 Download Handbook PDF
                  </a>
                </td>
              </tr>
            </table>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #000000;">
            <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #000000; font-weight: 600;">What's Inside:</h2>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">6 essential AI design patterns</li>
              <li style="margin-bottom: 8px;">Real-world product examples</li>
              <li style="margin-bottom: 8px;">Implementation guidance</li>
              <li style="margin-bottom: 8px;">Best practices from industry leaders</li>
            </ul>
          </div>

          <p style="font-size: 16px; margin-bottom: 20px;">
            You're now subscribed to our newsletter and will receive updates whenever we add new AI design patterns to our collection.
          </p>

          <p style="font-size: 16px; margin-bottom: 20px;">
            Want to explore more? We have a complete collection of <strong>28 AI design patterns</strong> with interactive demos:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.aiuxdesign.guide"
               style="display: inline-block; background: #ffffff; border: 2px solid #000000;
                      color: #000000; padding: 12px 30px; text-decoration: none; border-radius: 8px;
                      font-weight: 600; font-size: 16px;">
              Explore All 28 Patterns
            </a>
          </div>

          <p style="font-size: 14px; margin-bottom: 20px; text-align: center;">
            Or try our <a href="https://www.aiuxdesign.guide/audit" style="color: #000000; text-decoration: underline;">AI Design Audit Tool</a>
          </p>

          <p style="font-size: 12px; color: #999999; text-align: center; margin-top: 30px;">
            Download link valid for 30 days
          </p>

        </div>
      </body>
    </html>
  `;
}

function getAuditWelcomeEmail(): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your AI UX Audit Report is Saved</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Your Audit Report is Saved!</h1>
        </div>

        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Thanks for using our AI UX Design Audit tool! Your report has been downloaded.
          </p>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #1e293b;">
            <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #1e293b; font-weight: 600;">What's next?</h2>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Review your report and focus on the <strong>top 3 priorities</strong></li>
              <li style="margin-bottom: 8px;">Use the pattern links to see real examples and implementation tips</li>
              <li style="margin-bottom: 8px;">Re-run the audit after making changes to track your progress</li>
            </ul>
          </div>

          <p style="font-size: 16px; margin-bottom: 20px;">
            You're now subscribed to receive AI UX tips and pattern updates. We'll help you build better AI experiences.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.aiuxdesign.guide/audit"
               style="display: inline-block; background: #1e293b;
                      color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px;
                      font-weight: 600; font-size: 16px; margin-bottom: 15px;">
              Run Another Audit
            </a>
          </div>

          <p style="font-size: 14px; text-align: center;">
            Explore all <a href="https://www.aiuxdesign.guide" style="color: #1e293b; text-decoration: underline;">28 AI design patterns</a>
          </p>

        </div>
      </body>
    </html>
  `;
}
