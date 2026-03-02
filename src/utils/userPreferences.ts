'use client';

// Storage keys
const STORAGE_KEYS = {
  FAVORITES: 'ai-patterns-favorites',
  RECENT_PATTERNS: 'ai-patterns-recent',
  THEME: 'ai-patterns-theme',
  SETTINGS: 'ai-patterns-settings',
  VIEWED_PATTERNS: 'ai-patterns-viewed',
  HANDBOOK_DOWNLOADED: 'ai-patterns-handbook-downloaded',
  SHOWN_MILESTONES: 'ai-patterns-shown-milestones'
} as const;

// Milestones at which the smart prompt appears (unique pattern view counts)
const PROMPT_MILESTONES = [5, 10, 15, 20, 25, 30] as const;

// Types
export interface UserPreferences {
  favorites: string[];
  recentPatterns: RecentPattern[];
  theme: 'light' | 'dark' | 'system';
  searchHistory: string[];
}

export interface RecentPattern {
  id: string;
  title: string;
  timestamp: number;
}

// Default preferences (currently unused)
// const DEFAULT_PREFERENCES: UserPreferences = {
//   favorites: [],
//   recentPatterns: [],
//   theme: 'light',
//   searchHistory: []
// };

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

/**
 * Safely get data from localStorage
 */
function getStorageItem<T>(key: string, defaultValue: T): T {
  if (!isBrowser) return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to parse localStorage item "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely set data to localStorage
 */
function setStorageItem(key: string, value: unknown): void {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to set localStorage item "${key}":`, error);
  }
}

/**
 * Get user's favorite patterns
 */
export function getFavorites(): string[] {
  return getStorageItem(STORAGE_KEYS.FAVORITES, []);
}

/**
 * Add a pattern to favorites
 */
export function addToFavorites(patternId: string): string[] {
  const favorites = getFavorites();
  if (!favorites.includes(patternId)) {
    const newFavorites = [...favorites, patternId];
    setStorageItem(STORAGE_KEYS.FAVORITES, newFavorites);
    return newFavorites;
  }
  return favorites;
}

/**
 * Remove a pattern from favorites
 */
export function removeFromFavorites(patternId: string): string[] {
  const favorites = getFavorites();
  const newFavorites = favorites.filter(id => id !== patternId);
  setStorageItem(STORAGE_KEYS.FAVORITES, newFavorites);
  return newFavorites;
}

/**
 * Toggle a pattern's favorite status
 */
export function toggleFavorite(patternId: string): { favorites: string[]; isFavorite: boolean } {
  const favorites = getFavorites();
  const isFavorite = favorites.includes(patternId);
  
  const newFavorites = isFavorite 
    ? removeFromFavorites(patternId)
    : addToFavorites(patternId);
    
  return {
    favorites: newFavorites,
    isFavorite: !isFavorite
  };
}

/**
 * Check if a pattern is favorited
 */
export function isFavorite(patternId: string): boolean {
  return getFavorites().includes(patternId);
}

/**
 * Get recently viewed patterns
 */
export function getRecentPatterns(): RecentPattern[] {
  return getStorageItem(STORAGE_KEYS.RECENT_PATTERNS, []);
}

/**
 * Add a pattern to recent patterns
 */
export function addToRecentPatterns(patternId: string, title: string): RecentPattern[] {
  const recentPatterns = getRecentPatterns();
  
  // Remove if already exists to avoid duplicates
  const filteredRecent = recentPatterns.filter(pattern => pattern.id !== patternId);
  
  // Add to beginning of array
  const newRecentPattern: RecentPattern = {
    id: patternId,
    title,
    timestamp: Date.now()
  };
  
  const newRecent = [newRecentPattern, ...filteredRecent].slice(0, 10); // Keep only last 10
  setStorageItem(STORAGE_KEYS.RECENT_PATTERNS, newRecent);
  return newRecent;
}

/**
 * Clear recent patterns
 */
export function clearRecentPatterns(): void {
  setStorageItem(STORAGE_KEYS.RECENT_PATTERNS, []);
}

/**
 * Get all user preferences
 */
export function getUserPreferences(): UserPreferences {
  return {
    favorites: getFavorites(),
    recentPatterns: getRecentPatterns(),
    theme: getStorageItem(STORAGE_KEYS.THEME, 'light'),
    searchHistory: getStorageItem(STORAGE_KEYS.SETTINGS, { searchHistory: [] }).searchHistory || []
  };
}

/**
 * Update user preferences
 */
export function updateUserPreferences(preferences: Partial<UserPreferences>): void {
  if (preferences.favorites) {
    setStorageItem(STORAGE_KEYS.FAVORITES, preferences.favorites);
  }
  if (preferences.recentPatterns) {
    setStorageItem(STORAGE_KEYS.RECENT_PATTERNS, preferences.recentPatterns);
  }
  if (preferences.theme) {
    setStorageItem(STORAGE_KEYS.THEME, preferences.theme);
  }
  if (preferences.searchHistory) {
    const settings = getStorageItem(STORAGE_KEYS.SETTINGS, {});
    setStorageItem(STORAGE_KEYS.SETTINGS, { ...settings, searchHistory: preferences.searchHistory });
  }
}

/**
 * Clear all user data
 */
export function clearUserData(): void {
  if (!isBrowser) return;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove localStorage item "${key}":`, error);
    }
  });
}

/**
 * Export user data for backup
 */
export function exportUserData(): UserPreferences {
  return getUserPreferences();
}

/**
 * Import user data from backup
 */
export function importUserData(data: Partial<UserPreferences>): void {
  updateUserPreferences(data);
}

/**
 * Get storage usage information
 */
export function getStorageInfo() {
  if (!isBrowser) return { used: 0, available: 0 };

  let used = 0;

  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith('ai-patterns-')) {
        used += localStorage[key].length;
      }
    }
  } catch (error) {
    console.warn('Failed to calculate storage usage:', error);
  }

  return {
    used: Math.round(used / 1024), // KB
    available: 5120 // 5MB typical localStorage limit
  };
}

// ============================================
// Smart Prompt - Pattern View Tracking
// ============================================

/**
 * Get list of viewed pattern IDs
 */
export function getViewedPatterns(): string[] {
  return getStorageItem(STORAGE_KEYS.VIEWED_PATTERNS, []);
}

/**
 * Track a pattern view (adds to unique viewed set)
 */
export function trackPatternView(patternId: string): string[] {
  const viewed = getViewedPatterns();
  if (!viewed.includes(patternId)) {
    const newViewed = [...viewed, patternId];
    setStorageItem(STORAGE_KEYS.VIEWED_PATTERNS, newViewed);
    return newViewed;
  }
  return viewed;
}

/**
 * Get count of unique patterns viewed
 */
export function getUniqueViewCount(): number {
  return getViewedPatterns().length;
}

/**
 * Check if handbook has been downloaded
 */
export function hasDownloadedHandbook(): boolean {
  return getStorageItem(STORAGE_KEYS.HANDBOOK_DOWNLOADED, false);
}

/**
 * Mark handbook as downloaded
 */
export function setHandbookDownloaded(): void {
  setStorageItem(STORAGE_KEYS.HANDBOOK_DOWNLOADED, true);
}

/**
 * Check if user is already subscribed to newsletter
 */
export function isNewsletterSubscribed(): boolean {
  if (!isBrowser) return false;
  try {
    return localStorage.getItem('newsletter_subscribed') === 'true';
  } catch {
    return false;
  }
}

/**
 * Get milestones that have already been shown to the user
 */
export function getShownMilestones(): number[] {
  return getStorageItem(STORAGE_KEYS.SHOWN_MILESTONES, []);
}

/**
 * Mark a milestone as shown so it won't trigger again
 */
export function markMilestoneShown(milestone: number): void {
  const shown = getShownMilestones();
  if (!shown.includes(milestone)) {
    setStorageItem(STORAGE_KEYS.SHOWN_MILESTONES, [...shown, milestone]);
  }
}

/**
 * Dismiss the smart prompt — records the current milestone as shown
 */
export function dismissSmartPrompt(): void {
  const viewCount = getUniqueViewCount();
  const milestone = getCurrentMilestone(viewCount);
  if (milestone !== null) {
    markMilestoneShown(milestone);
  }
}

/**
 * Get the highest milestone the user has reached (or null if none)
 */
function getCurrentMilestone(viewCount: number): number | null {
  // Find the highest milestone <= viewCount
  for (let i = PROMPT_MILESTONES.length - 1; i >= 0; i--) {
    if (viewCount >= PROMPT_MILESTONES[i]) {
      return PROMPT_MILESTONES[i];
    }
  }
  return null;
}

/**
 * Check if the user just crossed a new milestone that hasn't been shown yet.
 * Only returns true on the exact view that crosses the threshold.
 */
export function shouldShowSmartPrompt(): boolean {
  if (!isBrowser) return false;

  const subscribed = isNewsletterSubscribed();
  const downloaded = hasDownloadedHandbook();
  if (subscribed || downloaded) return false;

  const viewCount = getUniqueViewCount();
  const milestone = getCurrentMilestone(viewCount);
  if (milestone === null) return false;

  const shown = getShownMilestones();
  return !shown.includes(milestone);
}