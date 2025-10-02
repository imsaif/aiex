'use client';

// Storage key for pattern usage tracking
const STORAGE_KEY = 'ai-patterns-usage';

// Types
export interface PatternUsageData {
  userPatterns: string[]; // Patterns the current user uses
  patternCounts: Record<string, number>; // Mock counts per pattern
}

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

/**
 * Safely get pattern usage data from localStorage
 */
function getUsageData(): PatternUsageData {
  if (!isBrowser) {
    return { userPatterns: [], patternCounts: {} };
  }

  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      // Ensure we have both fields
      return {
        userPatterns: parsed.userPatterns || [],
        patternCounts: parsed.patternCounts || {}
      };
    }
  } catch (error) {
    console.warn('Failed to parse pattern usage data:', error);
  }

  return { userPatterns: [], patternCounts: {} };
}

/**
 * Safely save pattern usage data to localStorage
 */
function saveUsageData(data: PatternUsageData): void {
  if (!isBrowser) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save pattern usage data:', error);
  }
}

/**
 * Get patterns that the current user uses
 */
export function getUserPatternUsage(): string[] {
  const data = getUsageData();
  return data.userPatterns;
}

/**
 * Check if the current user uses a specific pattern
 */
export function isUsingPattern(patternId: string): boolean {
  const data = getUsageData();
  return data.userPatterns.includes(patternId);
}

/**
 * Toggle pattern usage status for current user
 */
export function togglePatternUsage(patternId: string): { isUsing: boolean; count: number } {
  const data = getUsageData();
  const currentlyUsing = data.userPatterns.includes(patternId);

  if (currentlyUsing) {
    // Remove from user's patterns
    data.userPatterns = data.userPatterns.filter(id => id !== patternId);
    // Decrement count
    data.patternCounts[patternId] = Math.max(0, (data.patternCounts[patternId] || 1) - 1);
  } else {
    // Add to user's patterns
    data.userPatterns.push(patternId);
    // Increment count
    data.patternCounts[patternId] = (data.patternCounts[patternId] || 0) + 1;
  }

  saveUsageData(data);

  return {
    isUsing: !currentlyUsing,
    count: data.patternCounts[patternId] || 0
  };
}

/**
 * Get the usage count for a specific pattern
 */
export function getPatternUsageCount(patternId: string): number {
  const data = getUsageData();
  return data.patternCounts[patternId] || 0;
}

/**
 * Get total number of patterns the current user uses
 */
export function getTotalUserPatterns(): number {
  const data = getUsageData();
  return data.userPatterns.length;
}

/**
 * Clear all pattern usage data
 */
export function clearPatternUsage(): void {
  if (!isBrowser) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear pattern usage data:', error);
  }
}

/**
 * Initialize pattern counts with seed data (for demo purposes)
 * This simulates other users' activity
 */
export function initializePatternCounts(patternIds: string[]): void {
  const data = getUsageData();

  // Only initialize if counts are empty
  if (Object.keys(data.patternCounts).length === 0) {
    patternIds.forEach(id => {
      // Generate random count between 100-1000 for demo
      data.patternCounts[id] = Math.floor(Math.random() * 900) + 100;
    });
    saveUsageData(data);
  }
}
