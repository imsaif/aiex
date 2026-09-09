/**
 * Durable, DB-backed daily rate limit for the audit analysis endpoint.
 *
 * Replaces the previous in-memory `Map` limiter (src/lib/rate-limit.ts), which
 * did NOT hold on Vercel serverless — the Map isn't shared across instances and
 * resets on cold starts, so the "N/day per IP" cap was not reliably enforced.
 *
 * We already record every audit attempt in `AuditSample` with a salted `ipHash`
 * and `createdAt`, so the cap is just a COUNT of today's billable attempts for
 * this client — durable across instances and cold starts, no new infra.
 */
import { prisma } from '@/lib/prisma';
import { hashIp } from '@/lib/audit/sample';

export const DAILY_ANALYSIS_LIMIT = 10;

// Outcomes that represent a real (billable) Anthropic call. `bad_request`
// (no image) and `rate_limited` never hit the model, so they don't count.
const BILLABLE_OUTCOMES = ['success', 'empty_gaps', 'no_ai_surface', 'parse_error', 'api_error'];

// Our own synthetic/admin traffic is never rate-limited.
const EXEMPT_ROLES = new Set(['admin', 'test', 'monitor']);

function startOfTodayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
}

function nextMidnightUTC(): number {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0);
}

function countTodaysAnalyses(ipHash: string): Promise<number> {
  return prisma.auditSample.count({
    where: { ipHash, createdAt: { gte: startOfTodayUTC() }, outcome: { in: BILLABLE_OUTCOMES } },
  });
}

export interface AnalysisRateLimit {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

/**
 * Check the durable daily cap for this client. The current in-flight request is
 * NOT yet recorded when this runs, so `used` reflects prior completed attempts
 * today; the Nth request (used = N-1) is allowed and becomes the Nth.
 */
export async function checkAnalysisRateLimit(ip: string | null | undefined, role?: string | null): Promise<AnalysisRateLimit> {
  const resetAt = nextMidnightUTC();
  const limit = DAILY_ANALYSIS_LIMIT;

  if (role && EXEMPT_ROLES.has(role.toLowerCase())) {
    return { allowed: true, remaining: limit, resetAt, limit };
  }

  const ipHash = hashIp(ip);
  if (!ipHash) {
    // No identifiable IP — fail open (rare; can't attribute a limit).
    return { allowed: true, remaining: limit, resetAt, limit };
  }

  try {
    const used = await countTodaysAnalyses(ipHash);
    const allowed = used < limit;
    return { allowed, remaining: Math.max(0, limit - used - (allowed ? 1 : 0)), resetAt, limit };
  } catch (err) {
    // Fail open on a DB hiccup so a transient Neon issue doesn't break the tool.
    console.error('[analysis-rate-limit] DB count failed, allowing request:', err instanceof Error ? err.message : err);
    return { allowed: true, remaining: limit, resetAt, limit };
  }
}

/** Read-only usage for the /api/audit/usage endpoint (no side effects). */
export async function getAnalysisUsage(ip: string | null | undefined): Promise<{ used: number; remaining: number; limit: number; resetAt: number }> {
  const resetAt = nextMidnightUTC();
  const limit = DAILY_ANALYSIS_LIMIT;
  const ipHash = hashIp(ip);
  if (!ipHash) return { used: 0, remaining: limit, limit, resetAt };
  try {
    const used = await countTodaysAnalyses(ipHash);
    return { used, remaining: Math.max(0, limit - used), limit, resetAt };
  } catch {
    return { used: 0, remaining: limit, limit, resetAt };
  }
}
