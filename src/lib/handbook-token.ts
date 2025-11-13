import crypto from 'crypto';

const TOKEN_SECRET = process.env.HANDBOOK_TOKEN_SECRET || 'handbook-default-secret-change-in-prod';
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
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
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

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', TOKEN_SECRET)
      .update(decodedPayload)
      .digest('hex');

    if (signature !== expectedSignature) {
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
