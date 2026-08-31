import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashIp } from '@/lib/audit/sample';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { AUDIT_EVENT_NAMES } from '@/lib/audit/analytics';

// Ingest endpoint for UI event beacons from trackAuditEvent() (client-side).
// Node runtime (Prisma isn't edge-compatible here). Fire-and-forget via
// navigator.sendBeacon, so keep it cheap and always return 204 — a bad payload
// or DB blip must never surface an error into a user's click.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Only names the client actually emits are accepted — no arbitrary-name spam.
const ALLOWED_NAMES = new Set<string>(AUDIT_EVENT_NAMES);

const PATH_MAX = 256;
const UA_MAX = 200;
const SESSION_MAX = 64;
const ROLE_RE = /^[a-z0-9_-]{1,32}$/i;

interface EventBeacon {
  name?: string;
  properties?: Record<string, unknown> | null;
  path?: string;
  role?: string | null;
  sessionId?: string;
}

export async function POST(request: NextRequest) {
  try {
    // sendBeacon posts as a Blob (text); a normal fetch posts JSON. Handle both.
    const raw = await request.text();
    if (!raw) return new NextResponse(null, { status: 204 });

    const body = JSON.parse(raw) as EventBeacon;
    const name = String(body.name || '');

    if (!ALLOWED_NAMES.has(name)) {
      // Unknown/forged event name — swallow silently.
      return new NextResponse(null, { status: 204 });
    }

    const path = typeof body.path === 'string' ? body.path.slice(0, PATH_MAX) : null;
    const sessionId =
      typeof body.sessionId === 'string' ? body.sessionId.slice(0, SESSION_MAX) : null;
    // Auto-detect the admin session cookie, exactly as /api/patterns/analyze
    // does. Until this landed the route trusted only the client's
    // `aiux:role` localStorage value, which the layout script writes only
    // while the owner is actually on an /admin/* path — so every UiEvent row
    // ever written had role=null while AuditSample tagged the same sessions
    // correctly. Cheap: an in-memory session lookup or a bearer compare, no
    // DB round trip, and skipped entirely when no cookie/header is present.
    let role: string | null = null;
    try {
      if (await isAdminAuthenticated(request)) {
        role = 'admin';
      }
    } catch {
      // Never let an auth-cookie parse failure cost us the event row.
    }
    // Admin auto-detection above takes precedence over a client-supplied role
    // — don't let a stale `aiux:role=test` localStorage value downgrade an
    // admin tag, and don't let a missing flag erase it. Same rule as
    // analyze/route.ts, deliberately worded the same way.
    if (role !== 'admin' && typeof body.role === 'string' && ROLE_RE.test(body.role)) {
      role = body.role.toLowerCase();
    }
    // Keep the property bag small and JSON-serialisable; drop anything weird.
    let properties: object | null = null;
    if (body.properties && typeof body.properties === 'object') {
      try {
        properties = JSON.parse(JSON.stringify(body.properties));
      } catch {
        properties = null;
      }
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip =
      forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || null;
    const userAgent = request.headers.get('user-agent');

    await prisma.uiEvent.create({
      data: {
        name,
        sessionId,
        properties: properties ?? undefined,
        path: path && path.startsWith('/') ? path : null,
        role,
        ipHash: hashIp(ip),
        userAgent: userAgent ? userAgent.slice(0, UA_MAX) : null,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    // Beacons are best-effort; never 500.
    return new NextResponse(null, { status: 204 });
  }
}
