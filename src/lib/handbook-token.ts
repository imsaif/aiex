import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Resolve the signing secret at call time, not module-load time.
 *
 * Resolving this at import time throws during `next build` page-data collection
 * (NODE_ENV is 'production' there, but Preview/CI may not have the secret set),
 * failing every Preview deployment even though no token is ever signed at build.
 * Checking lazily keeps the production guarantee — a real request without the
 * secret still throws — while letting the build import this module safely.
 */
function getEffectiveSecret(): string {
  const tokenSecret = process.env.HANDBOOK_TOKEN_SECRET;
  if (!tokenSecret && process.env.NODE_ENV === 'production') {
    throw new Error('HANDBOOK_TOKEN_SECRET environment variable is required in production');
  }
  return tokenSecret || 'dev-only-handbook-secret-not-for-production';
}

const TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

interface TokenPayload {
  email: string;
  iat: number; // issued at
  exp: number; // expiration
}

/**
 * Generate a handbook download token for an email
 * Token is valid for 30 days
 */
export function generateHandbookToken(email: string): string {
  const now = Date.now();
  const payload: TokenPayload = {
    email,
    iat: now,
    exp: now + TOKEN_EXPIRY,
  };

  // Create a JSON string and sign it with HMAC
  const payloadStr = JSON.stringify(payload);
  const signature = createHmac('sha256', getEffectiveSecret())
    .update(payloadStr)
    .digest('hex');

  // Combine payload and signature, then encode to base64url
  const combined = `${Buffer.from(payloadStr).toString('base64')}.${signature}`;
  return combined;
}

/**
 * Validate and decode a handbook download token
 * Returns email if valid, null if invalid or expired
 */
export function validateHandbookToken(token: string): string | null {
  try {
    const [payloadStr, signature] = token.split('.');

    if (!payloadStr || !signature) {
      return null;
    }

    // Decode the payload
    const decodedPayload = Buffer.from(payloadStr, 'base64').toString('utf-8');
    const payload: TokenPayload = JSON.parse(decodedPayload);

    // Verify signature using timing-safe comparison
    const expectedSignature = createHmac('sha256', getEffectiveSecret())
      .update(decodedPayload)
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    if (signature.length !== expectedSignature.length) {
      return null;
    }
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    // Check expiration
    if (Date.now() > payload.exp) {
      return null;
    }

    return payload.email;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}
