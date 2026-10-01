import { NextResponse } from 'next/server';
import { getEvent } from '@/data/events';
import { verifyBookingToken } from '@/lib/events/booking-token';

/**
 * Checks a "View your booking" token from the confirmation email. The event page
 * is static, so it asks here instead of verifying on render. Answers only
 * booked: true/false; never echoes anything about the buyer.
 */
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug') ?? '';
  const token = url.searchParams.get('token') ?? '';
  if (!getEvent(slug)) return NextResponse.json({ booked: false }, { status: 404 });
  const paymentId = verifyBookingToken(slug, token);
  return NextResponse.json(
    paymentId ? { booked: true, paymentId } : { booked: false },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
