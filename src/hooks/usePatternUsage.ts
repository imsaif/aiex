'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getUserPatternUsage,
  isUsingPattern as checkIsUsingPattern,
  togglePatternUsage as toggleUsage,
  getPatternUsageCount as getCount,
  getTotalUserPatterns,
  clearPatternUsage
} from '../utils/patternUsage';
import { trackEvent } from '../utils/analytics';

export function usePatternUsage() {
  const [userPatterns, setUserPatterns] = useState<string[]>([]);
  const [patternCounts, setPatternCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load usage data on mount
  useEffect(() => {
    const loadUsageData = () => {
      try {
        const patterns = getUserPatternUsage();
        setUserPatterns(patterns);
        setIsLoading(false);
      } catch (error) {
        console.warn('Failed to load pattern usage:', error);
        setIsLoading(false);
      }
    };

    loadUsageData();
  }, []);

  // Toggle usage for a pattern
  const togglePatternUsage = useCallback((patternId: string) => {
    try {
      const result = toggleUsage(patternId);

      // Update local state
      if (result.isUsing) {
        setUserPatterns(prev => [...prev, patternId]);
      } else {
        setUserPatterns(prev => prev.filter(id => id !== patternId));
      }

      // Update count for this pattern
      setPatternCounts(prev => ({
        ...prev,
        [patternId]: result.count
      }));

      // Track analytics
      trackEvent('pattern_usage', {
        patternId,
        action: result.isUsing ? 'use' : 'unuse'
      });

      return result.isUsing;
    } catch (error) {
      console.warn('Failed to toggle pattern usage:', error);
      return checkIsUsingPattern(patternId);
    }
  }, []);

  // Check if user is using a pattern
  const isUsingPattern = useCallback((patternId: string) => {
    return userPatterns.includes(patternId);
  }, [userPatterns]);

  // Get usage count for a pattern
  const getPatternUsageCount = useCallback((patternId: string) => {
    // Return cached count if available, otherwise fetch fresh
    if (patternCounts[patternId] !== undefined) {
      return patternCounts[patternId];
    }

    const count = getCount(patternId);
    setPatternCounts(prev => ({
      ...prev,
      [patternId]: count
    }));
    return count;
  }, [patternCounts]);

  // Get total patterns user is using
  const totalUserPatterns = userPatterns.length;

  // Clear all usage data
  const clearAllUsage = useCallback(() => {
    try {
      clearPatternUsage();
      setUserPatterns([]);
      setPatternCounts({});
      return true;
    } catch (error) {
      console.warn('Failed to clear pattern usage:', error);
      return false;
    }
  }, []);

  return {
    userPatterns,
    totalUserPatterns,
    isLoading,
    isUsingPattern,
    togglePatternUsage,
    getPatternUsageCount,
    clearAllUsage
  };
}
