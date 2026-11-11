import { prisma } from '@/lib/prisma';

/** Every question is logged as this UiEvent; the daily limit counts them. */
export const GUIDEBOT_EVENT = 'guidebot_asked';

/** Questions per visitor per UTC day. Each one costs a model call. */
export const GUIDEBOT_DAILY_LIMIT = 15;

function startOfTodayUTC(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Same approach as the audit's limit (src/lib/audit/analysis-rate-limit.ts),
 * counted on UiEvent so no new table is needed. Fails open: no IP or a
 * database error lets the question through rather than blocking a visitor.
 */
export async function checkGuidebotLimit(
  ipHash: string | null
): Promise<{ allowed: boolean; remaining: number }> {
  if (!ipHash) return { allowed: true, remaining: GUIDEBOT_DAILY_LIMIT };
  try {
    const used = await prisma.uiEvent.count({
      where: { name: GUIDEBOT_EVENT, ipHash, createdAt: { gte: startOfTodayUTC() } },
    });
    return { allowed: used < GUIDEBOT_DAILY_LIMIT, remaining: Math.max(0, GUIDEBOT_DAILY_LIMIT - used) };
  } catch (err) {
    console.error('[guidebot] limit check failed, allowing:', err);
    return { allowed: true, remaining: GUIDEBOT_DAILY_LIMIT };
  }
}
