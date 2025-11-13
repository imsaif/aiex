import { NextRequest, NextResponse } from 'next/server';
import { generateHandbookHTML } from '@/lib/handbook-content';
import { z } from 'zod';

/**
 * Generate Designer's AI Handbook PDF
 * This endpoint creates a PDF of the handbook for email subscribers
 */
export async function GET(request: NextRequest) {
  try {
    const html = generateHandbookHTML();

    // Dynamically import html2pdf for PDF generation
    // html2pdf is a browser library, so we'll use a different approach
    // We'll return the HTML and let the client generate the PDF using html2pdf.js
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating handbook:', error);
    return NextResponse.json(
      { error: 'Failed to generate handbook' },
      { status: 500 }
    );
  }
}

const emailSchema = z.object({
  email: z.string().email('Invalid email format'),
});

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

    // Subscribe user to newsletter (with handbook source)
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
      // Continue even if subscription fails - still generate the PDF
    } else {
      const redactedEmail = email.replace(/^(.{2}).*(@.*)$/, '$1***$2');
      console.log(`Handbook PDF requested by: ${redactedEmail}`);
    }

    // Generate handbook HTML
    const html = generateHandbookHTML();

    return NextResponse.json({
      success: true,
      message: 'Handbook ready for download',
      html: html,
    });
  } catch (error) {
    console.error('Error processing handbook request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
