import { NextRequest, NextResponse } from 'next/server';
import { validateHandbookToken } from '@/lib/handbook-token';
import { prisma } from '@/lib/prisma';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Download handbook PDF using a valid token
 * Token is generated and sent in welcome email
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Missing token or email parameter' },
        { status: 400 }
      );
    }

    // Validate token
    const validatedEmail = validateHandbookToken(token);
    if (!validatedEmail) {
      return NextResponse.json(
        { error: 'Invalid or expired download link. Please visit /handbook to download.' },
        { status: 401 }
      );
    }

    // Verify email matches
    if (validatedEmail !== email) {
      return NextResponse.json(
        { error: 'Email does not match token' },
        { status: 401 }
      );
    }

    // Verify subscriber exists
    const subscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (!subscriber || !subscriber.active) {
      return NextResponse.json(
        { error: 'Email not found or subscription inactive' },
        { status: 404 }
      );
    }

    // Read the PDF file from public folder
    const pdfPath = join(process.cwd(), 'public', 'handbook.pdf');
    const pdfBuffer = readFileSync(pdfPath);

    // Return PDF file
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="AI-Design-Patterns-Handbook.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error processing handbook download:', error);
    return NextResponse.json(
      { error: 'Failed to process handbook download' },
      { status: 500 }
    );
  }
}
