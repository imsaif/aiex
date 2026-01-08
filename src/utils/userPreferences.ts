'use client';

// Storage keys
const STORAGE_KEYS = {
  FAVORITES: 'ai-patterns-favorites',
  RECENT_PATTERNS: 'ai-patterns-recent',
  THEME: 'ai-patterns-theme',
  SETTINGS: 'ai-patterns-settings',
  VIEWED_PATTERNS: 'ai-patterns-viewed',
  HANDBOOK_DOWNLOADED: 'ai-patterns-handbook-downloaded'
} as const;

// Session storage keys (reset on browser close)
const SESSION_KEYS = {
  SMART_PROMPT_DISMISSED: 'ai-patterns-smart-prompt-dismissed'
} as const;

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
 * Check if smart prompt was dismissed this session
 */
export function isSmartPromptDismissed(): boolean {
  if (!isBrowser) return false;
  try {
    return sessionStorage.getItem(SESSION_KEYS.SMART_PROMPT_DISMISSED) === 'true';
  } catch {
    return false;
  }
}

/**
 * Dismiss the smart prompt for this session
 */
export function dismissSmartPrompt(): void {
  if (!isBrowser) return;
  try {
    sessionStorage.setItem(SESSION_KEYS.SMART_PROMPT_DISMISSED, 'true');
  } catch (error) {
    console.warn('Failed to dismiss smart prompt:', error);
  }
}

/**
 * Check if smart prompt should be shown
 * Returns true if:
 * - User has viewed 4+ unique patterns
 * - User is not subscribed to newsletter
 * - User has not downloaded handbook
 * - Prompt was not dismissed this session
 */
export function shouldShowSmartPrompt(threshold: number = 4): boolean {
  if (!isBrowser) return false;

  const viewCount = getUniqueViewCount();
  const subscribed = isNewsletterSubscribed();
  const downloaded = hasDownloadedHandbook();
  const dismissed = isSmartPromptDismissed();

  return viewCount >= threshold && !subscribed && !downloaded && !dismissed;
}