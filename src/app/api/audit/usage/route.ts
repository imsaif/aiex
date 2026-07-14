import { NextRequest, NextResponse } from 'next/server';
import { getAnalysisUsage } from '@/lib/audit/analysis-rate-limit';

export async function GET(request: NextRequest) {
  // Get client IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';

  const usage = await getAnalysisUsage(ip);

  return NextResponse.json({
    used: usage.used,
    remaining: usage.remaining,
    limit: usage.limit,
    resetAt: usage.resetAt,
  });
}
