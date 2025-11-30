/**
 * Tier management utilities for AI Design Mentor
 * Handles usage tracking and limit enforcement
 */

import { FREE_TIER_LIMITS, PREMIUM_TIER_LIMITS } from '@/types/mentor';

export type UserTier = 'free' | 'premium';

export interface UsageRecord {
  scansThisMonth: number;
  lastScanDate: string;
  sessionIds: string[];
}

// In-memory storage for MVP (would use DB in production)
const userUsage = new Map<string, UsageRecord>();

/**
 * Get or initialize usage record for a user
 */
export function getUsageRecord(userId: string): UsageRecord {
  const existing = userUsage.get(userId);
  if (existing) {
    // Reset if new month
    const lastScan = new Date(existing.lastScanDate);
    const now = new Date();
    if (lastScan.getMonth() !== now.getMonth() || lastScan.getFullYear() !== now.getFullYear()) {
      const fresh: UsageRecord = {
        scansThisMonth: 0,
        lastScanDate: now.toISOString(),
        sessionIds: [],
      };
      userUsage.set(userId, fresh);
      return fresh;
    }
    return existing;
  }

  const fresh: UsageRecord = {
    scansThisMonth: 0,
    lastScanDate: new Date().toISOString(),
    sessionIds: [],
  };
  userUsage.set(userId, fresh);
  return fresh;
}

/**
 * Record a new scan for a user
 */
export function recordScan(userId: string, sessionId: string): void {
  const record = getUsageRecord(userId);
  record.scansThisMonth += 1;
  record.lastScanDate = new Date().toISOString();
  record.sessionIds.push(sessionId);
  userUsage.set(userId, record);
}

/**
 * Get tier limits based on user tier
 */
export function getTierLimits(tier: UserTier) {
  return tier === 'premium' ? PREMIUM_TIER_LIMITS : FREE_TIER_LIMITS;
}

/**
 * Check if user can perform a scan
 */
export function canPerformScan(userId: string, tier: UserTier): { allowed: boolean; reason?: string } {
  const usage = getUsageRecord(userId);
  const limits = getTierLimits(tier);

  if (usage.scansThisMonth >= limits.scansPerMonth) {
    return {
      allowed: false,
      reason: tier === 'free'
        ? `Free tier limit: ${limits.scansPerMonth} scans per month. Upgrade to Premium for unlimited scans.`
        : 'Monthly scan limit reached.',
    };
  }

  return { allowed: true };
}

/**
 * Get number of annotations allowed for tier
 */
export function getAnnotationLimit(tier: UserTier): number {
  return getTierLimits(tier).annotationsPerScan;
}

/**
 * Get number of fix prompts allowed for tier
 */
export function getFixPromptLimit(tier: UserTier): number {
  return getTierLimits(tier).fixPromptsPerScan;
}

/**
 * Check if a feature is available for the tier
 */
export function isFeatureAvailable(feature: 'annotations' | 'fixPrompts' | 'sessionHistory', tier: UserTier): boolean {
  const limits = getTierLimits(tier);
  switch (feature) {
    case 'annotations':
      return limits.annotationsPerScan > 0;
    case 'fixPrompts':
      return limits.fixPromptsPerScan > 0;
    case 'sessionHistory':
      return limits.sessionHistory > 0;
    default:
      return false;
  }
}

/**
 * Get usage summary for a user
 */
export function getUsageSummary(userId: string, tier: UserTier) {
  const usage = getUsageRecord(userId);
  const limits = getTierLimits(tier);

  return {
    tier,
    scans: {
      used: usage.scansThisMonth,
      limit: limits.scansPerMonth,
      remaining: Math.max(0, limits.scansPerMonth - usage.scansThisMonth),
    },
    annotations: {
      perScan: limits.annotationsPerScan,
    },
    fixPrompts: {
      perScan: limits.fixPromptsPerScan,
    },
    upgradeRequired: tier === 'free' && usage.scansThisMonth >= limits.scansPerMonth,
  };
}

/**
 * Premium upgrade benefits description
 */
export const PREMIUM_BENEFITS = [
  'Unlimited design scans per month',
  'All visual annotations (not limited to 3)',
  'Unlimited fix prompts for all design tools',
  'Full session history and comparison',
  'Priority AI analysis queue',
  'Export reports and checklists',
] as const;
