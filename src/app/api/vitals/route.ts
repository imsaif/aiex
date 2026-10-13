import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isSyntheticUserAgent } from '@/lib/analytics/bots';

// Ingest endpoint for real-user Core Web Vitals beacons from WebVitalsReporter.
// Node runtime (Prisma is not edge-compatible here). Fire-and-forget from the
// client via navigator.sendBeacon, so we keep this cheap and always return 204.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// A page sends at most a handful of readings; anything bigger is not ours.
const MAX_BATCH = 20;

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

    // The reporter sends a batch (array); older cached clients send one object.
    const parsed = JSON.parse(raw) as VitalBeacon | VitalBeacon[];
    const batch = (Array.isArray(parsed) ? parsed : [parsed]).slice(0, MAX_BATCH);

    // Lighthouse no longer marks its UA, so the client-side check misses it;
    // see lib/analytics/bots for the measured scale of that leak.
    if (isSyntheticUserAgent(request.headers.get('user-agent'))) {
      return new NextResponse(null, { status: 204 });
    }

    const rows = batch.flatMap((body) => {
      const metric = String(body?.metric || '').toUpperCase();
      const rating = String(body?.rating || '');
      const value = Number(body?.value);
      const path = String(body?.path || '').slice(0, 256);
      const device = body?.device === 'mobile' ? 'mobile' : 'desktop';
      if (
        !ALLOWED_METRICS.has(metric) ||
        !ALLOWED_RATINGS.has(rating) ||
        !Number.isFinite(value) ||
        value < 0 ||
        value > (MAX_VALUE[metric] ?? Infinity) ||
        !path.startsWith('/')
      ) {
        // Malformed/out-of-range: drop this reading only, never error a beacon.
        return [];
      }
      return [{
        metric,
        value,
        rating,
        path,
        device,
        navigationId: body.navigationId ? String(body.navigationId).slice(0, 64) : null,
      }];
    });

    if (rows.length > 0) await prisma.webVitalMetric.createMany({ data: rows });

    return new NextResponse(null, { status: 204 });
  } catch {
    // Beacons are best-effort; a bad payload or transient DB blip must not 500.
    return new NextResponse(null, { status: 204 });
  }
}
