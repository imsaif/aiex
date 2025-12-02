'use client';

import { useState, useEffect, useCallback } from 'react';
import { FREE_TIER_LIMITS, PREMIUM_TIER_LIMITS } from '@/types/mentor';

export type UserTier = 'free' | 'premium';

export interface UsageInfo {
  tier: UserTier;
  scans: {
    used: number;
    limit: number;
    remaining: number;
  };
  annotations: {
    perScan: number;
  };
  fixPrompts: {
    perScan: number;
  };
  upgradeRequired: boolean;
  premiumBenefits?: readonly string[];
}

interface UseMentorTierResult {
  tier: UserTier;
  usage: UsageInfo | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  canScan: boolean;
  annotationLimit: number;
  fixPromptLimit: number;
  isPremium: boolean;
}

/**
 * Hook for accessing mentor tier information and usage limits
 * In production, this would integrate with authentication
 */
export function useMentorTier(userId?: string): UseMentorTierResult {
  const [tier, setTier] = useState<UserTier>('free');
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/mentor/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'anonymous',
          tier,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch usage info');
      }

      const data = await response.json();
      setUsage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Fallback to defaults
      setUsage({
        tier,
        scans: { used: 0, limit: FREE_TIER_LIMITS.scansPerMonth, remaining: FREE_TIER_LIMITS.scansPerMonth },
        annotations: { perScan: FREE_TIER_LIMITS.annotationsPerScan },
        fixPrompts: { perScan: FREE_TIER_LIMITS.fixPromptsPerScan },
        upgradeRequired: false,
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, tier]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  // Computed values
  const limits = tier === 'premium' ? PREMIUM_TIER_LIMITS : FREE_TIER_LIMITS;
  const canScan = usage ? usage.scans.remaining > 0 : true;
  const annotationLimit = limits.annotationsPerScan;
  const fixPromptLimit = limits.fixPromptsPerScan;
  const isPremium = tier === 'premium';

  return {
    tier,
    usage,
    isLoading,
    error,
    refetch: fetchUsage,
    canScan,
    annotationLimit,
    fixPromptLimit,
    isPremium,
  };
}

/**
 * Check if a feature is gated behind premium
 */
export function isPremiumFeature(feature: 'unlimitedAnnotations' | 'unlimitedFixPrompts' | 'sessionHistory'): boolean {
  return true; // All these are premium features
}

/**
 * Get upgrade CTA based on context
 */
export function getUpgradeCTA(context: 'scan_limit' | 'annotation_limit' | 'fixprompt_limit'): {
  title: string;
  description: string;
  benefit: string;
} {
  switch (context) {
    case 'scan_limit':
      return {
        title: 'Upgrade for Unlimited Scans',
        description: 'Free tier includes 3 scans per month',
        benefit: 'Get unlimited design audits with Premium',
      };
    case 'annotation_limit':
      return {
        title: 'See All Issues',
        description: 'Showing 3 of many detected issues',
        benefit: 'Upgrade to see all visual annotations',
      };
    case 'fixprompt_limit':
      return {
        title: 'Get All Fix Prompts',
        description: 'Showing 1 fix prompt (more available)',
        benefit: 'Upgrade for unlimited AI fix prompts',
      };
    default:
      return {
        title: 'Upgrade to Premium',
        description: 'Unlock all mentor features',
        benefit: 'Get the most from AI Design Mentor',
      };
  }
}
