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
        await sendWelcomeEmail(email);

        return NextResponse.json(
          { message: 'Welcome back! Your subscription has been reactivated.' },
          { status: 200 }
        );
      }
    }

    // Create new subscriber
    const subscriber = await prisma.subscriber.create({
      data: { email },
    });

    // Send welcome email
    await sendWelcomeEmail(email);

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
    await resend.emails.send({
      from: 'AI UX Patterns <noreply@aiux.design>',
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
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to AI UX Patterns! 🎨</h1>
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

              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #667eea;">What to expect:</h2>
                <ul style="margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">New AI design pattern announcements</li>
                  <li style="margin-bottom: 8px;">Code examples and implementation guides</li>
                  <li style="margin-bottom: 8px;">Best practices and design considerations</li>
                  <li style="margin-bottom: 8px;">Interactive demos and Figma resources</li>
                </ul>
              </div>

              <p style="font-size: 16px; margin-bottom: 20px;">
                Explore our current collection of <strong>24 AI design patterns</strong> across 7 categories
                at <a href="https://aiux.design" style="color: #667eea; text-decoration: none;">aiux.design</a>
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://aiux.design"
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                          color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px;
                          font-weight: 600; font-size: 16px;">
                  Explore Patterns
                </a>
              </div>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

              <p style="font-size: 14px; color: #6b7280; text-align: center;">
                Built with ☕ by Imran<br>
                <a href="https://www.imranaidesign.com/" style="color: #667eea; text-decoration: none;">Portfolio</a> ·
                <a href="https://github.com/imsaif" style="color: #667eea; text-decoration: none;">GitHub</a> ·
                <a href="https://www.linkedin.com/in/imsaif/" style="color: #667eea; text-decoration: none;">LinkedIn</a>
              </p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw error - we still want to complete subscription even if email fails
  }
}
