import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Ingest endpoint for real-user Core Web Vitals beacons from WebVitalsReporter.
// Node runtime (Prisma is not edge-compatible here). Fire-and-forget from the
// client via navigator.sendBeacon, so we keep this cheap and always return 204.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_METRICS = new Set(['LCP', 'INP', 'CLS', 'FCP', 'TTFB']);
const ALLOWED_RATINGS = new Set(['good', 'needs-improvement', 'poor']);

// Sanity ceilings — drop absurd values (backgrounded-tab LCP can be minutes;
// that noise is exactly what poisoned the Clarity aggregate we don't want here).
const MAX_VALUE: Record<string, number> = {
  LCP: 60_000,
  INP: 60_000,
  FCP: 60_000,
  TTFB: 60_000,
  CLS: 10,
};

interface VitalBeacon {
  metric?: string;
  value?: number;
  rating?: string;
  path?: string;
  device?: string;
  navigationId?: string;
}

export async function POST(request: NextRequest) {
  try {
    // sendBeacon posts as text/plain; a normal fetch posts JSON. Handle both.
    const raw = await request.text();
    if (!raw) return new NextResponse(null, { status: 204 });

    const body = JSON.parse(raw) as VitalBeacon;

    const metric = String(body.metric || '').toUpperCase();
    const rating = String(body.rating || '');
    const value = Number(body.value);
    const path = String(body.path || '').slice(0, 256);
    const device = body.device === 'mobile' ? 'mobile' : 'desktop';

    if (
      !ALLOWED_METRICS.has(metric) ||
      !ALLOWED_RATINGS.has(rating) ||
      !Number.isFinite(value) ||
      value < 0 ||
      value > (MAX_VALUE[metric] ?? Infinity) ||
      !path.startsWith('/')
    ) {
      // Malformed/out-of-range — swallow silently, never error a beacon.
      return new NextResponse(null, { status: 204 });
    }

    await prisma.webVitalMetric.create({
      data: {
        metric,
        value,
        rating,
        path,
        device,
        navigationId: body.navigationId ? String(body.navigationId).slice(0, 64) : null,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    // Beacons are best-effort; a bad payload or transient DB blip must not 500.
    return new NextResponse(null, { status: 204 });
  }
}
