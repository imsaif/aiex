/**
 * Rate Limiting for AI UX Audit Tool
 *
 * Simple IP-based rate limiting using in-memory storage.
 * For production with multiple instances, consider Redis/Upstash.
 */

// Rate limit configuration
export const RATE_LIMITS = {
  ANALYSES_PER_DAY: 3,      // 3 analyses per day per IP
  CHATS_PER_SESSION: 5,     // 5 chat messages per analysis session
} as const;

// In-memory storage for rate limits
// In production, use Redis/Upstash for persistence across instances
interface RateLimitEntry {
  count: number;
  resetAt: number; // Unix timestamp
}

const analysisLimits = new Map<string, RateLimitEntry>();
const chatLimits = new Map<string, RateLimitEntry>();

// Get midnight UTC for daily reset
function getMidnightUTC(): number {
  const now = new Date();
  const tomorrow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0
  ));
  return tomorrow.getTime();
}

// Get session expiry (1 hour from now for chat limits)
function getSessionExpiry(): number {
  return Date.now() + (60 * 60 * 1000); // 1 hour
}

// Clean up expired entries periodically
function cleanupExpiredEntries() {
  const now = Date.now();

  Array.from(analysisLimits.entries()).forEach(([key, entry]) => {
    if (entry.resetAt <= now) {
      analysisLimits.delete(key);
    }
  });

  Array.from(chatLimits.entries()).forEach(([key, entry]) => {
    if (entry.resetAt <= now) {
      chatLimits.delete(key);
    }
  });
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Check and increment analysis rate limit
 * @returns Object with allowed status and remaining count
 */
export function checkAnalysisRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
} {
  const now = Date.now();
  const key = `analysis:${ip}`;

  let entry = analysisLimits.get(key);

  // Reset if expired
  if (!entry || entry.resetAt <= now) {
    entry = {
      count: 0,
      resetAt: getMidnightUTC(),
    };
  }

  const remaining = RATE_LIMITS.ANALYSES_PER_DAY - entry.count;

  if (entry.count >= RATE_LIMITS.ANALYSES_PER_DAY) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      limit: RATE_LIMITS.ANALYSES_PER_DAY,
    };
  }

  // Increment count
  entry.count += 1;
  analysisLimits.set(key, entry);

  return {
    allowed: true,
    remaining: remaining - 1, // After this request
    resetAt: entry.resetAt,
    limit: RATE_LIMITS.ANALYSES_PER_DAY,
  };
}

/**
 * Check and increment chat rate limit (per session)
 * @param sessionId - Unique session identifier (analysis ID)
 * @returns Object with allowed status and remaining count
 */
export function checkChatRateLimit(sessionId: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
} {
  const now = Date.now();
  const key = `chat:${sessionId}`;

  let entry = chatLimits.get(key);

  // Reset if expired
  if (!entry || entry.resetAt <= now) {
    entry = {
      count: 0,
      resetAt: getSessionExpiry(),
    };
  }

  const remaining = RATE_LIMITS.CHATS_PER_SESSION - entry.count;

  if (entry.count >= RATE_LIMITS.CHATS_PER_SESSION) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      limit: RATE_LIMITS.CHATS_PER_SESSION,
    };
  }

  // Increment count
  entry.count += 1;
  chatLimits.set(key, entry);

  return {
    allowed: true,
    remaining: remaining - 1,
    resetAt: entry.resetAt,
    limit: RATE_LIMITS.CHATS_PER_SESSION,
  };
}

/**
 * Get current usage without incrementing
 */
export function getAnalysisUsage(ip: string): {
  used: number;
  remaining: number;
  limit: number;
  resetAt: number;
} {
  const now = Date.now();
  const key = `analysis:${ip}`;
  const entry = analysisLimits.get(key);

  if (!entry || entry.resetAt <= now) {
    return {
      used: 0,
      remaining: RATE_LIMITS.ANALYSES_PER_DAY,
      limit: RATE_LIMITS.ANALYSES_PER_DAY,
      resetAt: getMidnightUTC(),
    };
  }

  return {
    used: entry.count,
    remaining: RATE_LIMITS.ANALYSES_PER_DAY - entry.count,
    limit: RATE_LIMITS.ANALYSES_PER_DAY,
    resetAt: entry.resetAt,
  };
}

export function getChatUsage(sessionId: string): {
  used: number;
  remaining: number;
  limit: number;
} {
  const now = Date.now();
  const key = `chat:${sessionId}`;
  const entry = chatLimits.get(key);

  if (!entry || entry.resetAt <= now) {
    return {
      used: 0,
      remaining: RATE_LIMITS.CHATS_PER_SESSION,
      limit: RATE_LIMITS.CHATS_PER_SESSION,
    };
  }

  return {
    used: entry.count,
    remaining: RATE_LIMITS.CHATS_PER_SESSION - entry.count,
    limit: RATE_LIMITS.CHATS_PER_SESSION,
  };
}

/**
 * Format time until reset for display
 */
export function formatTimeUntilReset(resetAt: number): string {
  const now = Date.now();
  const diff = resetAt - now;

  if (diff <= 0) return 'now';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
