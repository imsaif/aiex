import { NextRequest, NextResponse } from 'next/server';
import { generateHandbookHTML } from '@/lib/handbook-content';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Subscribe user to newsletter
    const subscribeResponse = await fetch(
      new URL('/api/newsletter/subscribe', request.url),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }
    );

    if (!subscribeResponse.ok) {
      const subscribeData = await subscribeResponse.json();
      console.error('Newsletter subscription failed:', subscribeData);
      // Continue even if subscription fails - still generate the PDF
    } else {
      console.log(`Handbook PDF requested by: ${email}`);
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
