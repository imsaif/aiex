import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// GET - Fetch subscriber data for the unsubscribe page
// Does NOT auto-unsubscribe anymore - just returns subscriber info
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find subscriber by unsubscribe token
    const subscriber = await prisma.subscriber.findUnique({
      where: { unsubscribeToken: token },
      select: {
        email: true,
        emailFrequency: true,
        active: true,
      },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      subscriber: {
        email: subscriber.email,
        emailFrequency: subscriber.emailFrequency,
        active: subscriber.active,
      },
    });
  } catch (error) {
    console.error('Newsletter unsubscribe GET error:', error);
    return NextResponse.json(
      { error: 'Failed to load subscription data' },
      { status: 500 }
    );
  }
}

// POST - Handle unsubscribe, frequency updates, feedback, and resubscribe
const postSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  action: z.enum(['unsubscribe', 'update_frequency', 'feedback', 'resubscribe']),
  frequency: z.enum(['all', 'weekly']).optional(),
  reason: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = postSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { token, action, frequency, reason } = parsed.data;

    // Find subscriber by unsubscribe token
    const subscriber = await prisma.subscriber.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'unsubscribe': {
        // Immediate unsubscribe - no confirmation needed
        await prisma.subscriber.update({
          where: { unsubscribeToken: token },
          data: {
            active: false,
            emailFrequency: 'none',
            unsubscribedAt: new Date(),
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Successfully unsubscribed from newsletter.',
        });
      }

      case 'update_frequency': {
        if (!frequency) {
          return NextResponse.json(
            { error: 'Frequency is required for update_frequency action' },
            { status: 400 }
          );
        }

        // Update frequency preference
        const updated = await prisma.subscriber.update({
          where: { unsubscribeToken: token },
          data: {
            emailFrequency: frequency,
            active: true, // Ensure they're active when updating frequency
            unsubscribedAt: null, // Clear unsubscribe date
          },
          select: {
            email: true,
            emailFrequency: true,
            active: true,
          },
        });

        return NextResponse.json({
          success: true,
          message: `Subscription updated to ${frequency === 'all' ? 'all emails' : 'weekly digest only'}.`,
          subscriber: updated,
        });
      }

      case 'feedback': {
        // Store optional feedback reason after unsubscribe
        if (reason) {
          await prisma.subscriber.update({
            where: { unsubscribeToken: token },
            data: {
              unsubscribeReason: reason,
            },
          });
        }

        return NextResponse.json({
          success: true,
          message: 'Thank you for your feedback.',
        });
      }

      case 'resubscribe': {
        // Reactivate subscription with default frequency
        const resubscribed = await prisma.subscriber.update({
          where: { unsubscribeToken: token },
          data: {
            active: true,
            emailFrequency: 'all',
            unsubscribedAt: null,
            unsubscribeReason: null,
          },
          select: {
            email: true,
            emailFrequency: true,
            active: true,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Successfully resubscribed to newsletter.',
          subscriber: resubscribed,
        });
      }

      default: {
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    console.error('Newsletter unsubscribe POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again later.' },
      { status: 500 }
    );
  }
}
