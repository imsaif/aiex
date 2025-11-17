import { NextRequest, NextResponse } from 'next/server';
import { generateHandbookToken } from '@/lib/handbook-token';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Invalid email format'),
});

/**
 * Generate download token and subscribe user to handbook
 * Returns token that can be used with /api/handbook/download
 */
export async function POST(request: NextRequest) {
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

    // Subscribe user to newsletter
    const subscribeResponse = await fetch(
      new URL('/api/newsletter/subscribe', request.url),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
