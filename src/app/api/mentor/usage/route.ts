import { NextRequest, NextResponse } from 'next/server';
import { getUsageSummary, PREMIUM_BENEFITS, type UserTier } from '@/lib/mentor-tier';

interface UsageRequest {
  userId?: string;
  tier?: UserTier;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tier } = body as UsageRequest;

    // Default userId for MVP (would come from auth in production)
    const effectiveUserId = userId || 'anonymous';
    const effectiveTier: UserTier = tier || 'free';

    const usage = getUsageSummary(effectiveUserId, effectiveTier);

    return NextResponse.json({
      ...usage,
      premiumBenefits: effectiveTier === 'free' ? PREMIUM_BENEFITS : undefined,
    });
  } catch (error) {
    console.error('[Mentor Usage] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get usage info' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return general tier info without user-specific data
  return NextResponse.json({
    tiers: {
      free: {
        name: 'Free',
        limits: {
          scansPerMonth: 3,
          annotationsPerScan: 3,
          fixPromptsPerScan: 1,
          sessionHistory: 1,
        },
      },
      premium: {
        name: 'Premium',
        limits: {
          scansPerMonth: 1000,
          annotationsPerScan: 100,
          fixPromptsPerScan: 100,
          sessionHistory: 100,
        },
      },
    },
    premiumBenefits: PREMIUM_BENEFITS,
  });
}

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://www.aiuxdesign.guide',
  'https://aiuxdesign.guide',
  process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean);

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin || 'https://www.aiuxdesign.guide',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
