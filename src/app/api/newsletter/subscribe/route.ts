import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';

// Email validation schema
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);

    // Check if email already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.active) {
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
          await sendWelcomeEmail(email);
        } catch (emailError) {
          console.error('Email send failed but reactivation succeeded:', emailError);
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
      await sendWelcomeEmail(email);
    } catch (emailError) {
      console.error('Email send failed but subscription created:', emailError);
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

async function sendWelcomeEmail(email: string) {
  try {
    const result = await resend.emails.send({
      from: 'AI UX Patterns <noreply@aiuxdesign.guide>',
      to: email,
      subject: 'Welcome to AI UX Patterns Newsletter! 🎨',
      html: `
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
                <strong>🎁 Your AI Design Patterns Handbook is ready!</strong>
              </p>

              <p style="font-size: 16px; margin-bottom: 20px;">
                Download your free handbook with 6 essential AI design patterns, complete with code examples,
                real-world applications, and design guidance.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.aiuxdesign.guide/handbook"
                   style="display: inline-block; background: #000000;
                          color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px;
                          font-weight: 600; font-size: 16px; margin-bottom: 15px;">
                  Download Handbook
                </a>
              </div>

              <p style="font-size: 16px; margin-bottom: 20px;">
                Or explore our complete collection of <strong>24 AI design patterns</strong> across 7 categories
                at <a href="https://www.aiuxdesign.guide" style="color: #000000; text-decoration: underline;">aiuxdesign.guide</a>
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.aiuxdesign.guide"
                   style="display: inline-block; background: #ffffff; border: 2px solid #000000;
                          color: #000000; padding: 12px 30px; text-decoration: none; border-radius: 8px;
                          font-weight: 600; font-size: 16px;">
                  Explore All Patterns
                </a>
              </div>

            </div>
          </body>
        </html>
      `,
    });

    console.log('Welcome email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Throw error so we know email failed
    throw new Error(`Email delivery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
