import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual, createHmac } from 'crypto';

// Session duration: 24 hours
const SESSION_DURATION = 24 * 60 * 60 * 1000;
const COOKIE_NAME = 'admin_session';

/**
 * Get the secret key for signing cookies
 */
function getSecretKey(): string {
  return process.env.HANDBOOK_TOKEN_SECRET || process.env.ADMIN_APPROVE_SECRET || 'fallback-secret-key';
}

/**
 * Timing-safe password comparison to prevent timing attacks
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still do the comparison to maintain constant time
    timingSafeEqual(Buffer.from(a), Buffer.from(a));
    return false;
  }
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Verify admin password against environment variable
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable is not set');
    return false;
  }

  // Minimum password length check
  if (adminPassword.length < 8) {
    console.error('ADMIN_PASSWORD is too short (minimum 8 characters)');
    return false;
  }

  return secureCompare(password, adminPassword);
}

/**
 * Create a signed session token (stateless - no server-side storage needed)
 * Format: expiresAt.signature
 */
export function createSession(): string {
  const expiresAt = Date.now() + SESSION_DURATION;
  const data = `admin:${expiresAt}`;
  const signature = createHmac('sha256', getSecretKey()).update(data).digest('hex');
  return `${expiresAt}.${signature}`;
}

/**
 * Validate a signed session token (stateless)
 */
export function validateSession(token: string): boolean {
  if (!token || !token.includes('.')) {
    return false;
  }

  const [expiresAtStr, signature] = token.split('.');
  const expiresAt = parseInt(expiresAtStr, 10);

  // Check if expired
  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  // Verify signature
  const data = `admin:${expiresAt}`;
  const expectedSignature = createHmac('sha256', getSecretKey()).update(data).digest('hex');

  return secureCompare(signature, expectedSignature);
}

/**
 * Check if the request has a valid admin session (for API routes)
 */
export async function isAdminAuthenticated(request: NextRequest): Promise<boolean> {
  // Check for session cookie
  const sessionId = request.cookies.get(COOKIE_NAME)?.value;

  if (sessionId && validateSession(sessionId)) {
    return true;
  }

  // Check for Authorization header (for programmatic access)
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    // Allow using ADMIN_APPROVE_SECRET as bearer token for API access
    const adminSecret = process.env.ADMIN_APPROVE_SECRET;
    if (adminSecret && secureCompare(token, adminSecret)) {
      return true;
    }
  }

  return false;
}

/**
 * Get session cookie for setting in response
 */
export function getSessionCookie(sessionId: string): { name: string; value: string; options: object } {
  return {
    name: COOKIE_NAME,
    value: sessionId,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const, // 'lax' allows cookie on OAuth redirects
      maxAge: SESSION_DURATION / 1000,
      path: '/', // Allow cookie to be sent to API routes
    },
  };
}

/**
 * Check admin auth for server components
 */
export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;

  if (!sessionId) {
    return false;
  }

  return validateSession(sessionId);
}

/**
 * API route wrapper that requires admin authentication
 */
export function withAdminAuth<T>(
  handler: (request: NextRequest) => Promise<NextResponse<T>>
): (request: NextRequest) => Promise<NextResponse<T | { error: string }>> {
  return async (request: NextRequest) => {
    const isAuthenticated = await isAdminAuthenticated(request);

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin authentication required.' },
        { status: 401 }
      );
    }

    return handler(request);
  };
}
