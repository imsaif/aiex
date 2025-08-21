// Privacy-focused analytics utility for AI Design Patterns
// Tracks usage patterns without collecting personal data

interface AnalyticsEvent {
  type: 'page_view' | 'pattern_view' | 'search' | 'favorite' | 'copy_code' | 'export';
  data?: Record<string, unknown>;
  timestamp: number;
  sessionId: string;
}

interface Analytics {
  pageViews: number;
  patternViews: Record<string, number>;
  searchQueries: number;
  favorites: number;
  codeCopies: number;
  exports: number;
  lastActive: number;
}

// Generate a session ID that resets each browser session
const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Get current analytics data from localStorage
const getAnalytics = (): Analytics => {
  if (typeof window === 'undefined') {
    return {
      pageViews: 0,
      patternViews: {},
      searchQueries: 0,
      favorites: 0,
      codeCopies: 0,
      exports: 0,
      lastActive: 0
    };
  }

  try {
    const stored = localStorage.getItem('ai_patterns_analytics');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load analytics data:', error);
  }

  return {
    pageViews: 0,
    patternViews: {},
    searchQueries: 0,
    favorites: 0,
    codeCopies: 0,
    exports: 0,
    lastActive: 0
  };
};

// Save analytics data to localStorage
const saveAnalytics = (analytics: Analytics): void => {
  if (typeof window === 'undefined') return;
  
  try {
    analytics.lastActive = Date.now();
    localStorage.setItem('ai_patterns_analytics', JSON.stringify(analytics));
  } catch (error) {
    console.warn('Failed to save analytics data:', error);
  }
};

// Track an analytics event
export const trackEvent = (type: AnalyticsEvent['type'], data?: Record<string, unknown>): void => {
  if (typeof window === 'undefined') return;

  const analytics = getAnalytics();
  const event: AnalyticsEvent = {
    type,
    data,
    timestamp: Date.now(),
    sessionId: getSessionId()
  };

  // Update analytics based on event type
  switch (type) {
    case 'page_view':
      analytics.pageViews++;
      break;
    
    case 'pattern_view':
      if (data?.patternId) {
        analytics.patternViews[data.patternId as string] = (analytics.patternViews[data.patternId as string] || 0) + 1;
      }
      break;
    
    case 'search':
      analytics.searchQueries++;
      break;
    
    case 'favorite':
      analytics.favorites++;
      break;
    
    case 'copy_code':
      analytics.codeCopies++;
      break;
    
    case 'export':
      analytics.exports++;
      break;
  }

  saveAnalytics(analytics);

  // Optional: Log events for debugging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', event);
  }
};

// Get analytics summary for insights
export const getAnalyticsSummary = () => {
  const analytics = getAnalytics();
  
  // Get most viewed patterns
  const topPatterns = Object.entries(analytics.patternViews)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([patternId, views]) => ({ patternId, views }));

  return {
    totalPageViews: analytics.pageViews,
    totalPatternViews: Object.values(analytics.patternViews).reduce((sum, views) => sum + views, 0),
    totalSearches: analytics.searchQueries,
    totalFavorites: analytics.favorites,
    totalCodeCopies: analytics.codeCopies,
    totalExports: analytics.exports,
    topPatterns,
    lastActive: analytics.lastActive,
    daysSinceFirstVisit: analytics.lastActive ? Math.floor((Date.now() - analytics.lastActive) / (1000 * 60 * 60 * 24)) : 0
  };
};

// Export analytics data (for user to see their own data)
export const exportAnalyticsData = () => {
  const analytics = getAnalytics();
  const summary = getAnalyticsSummary();
  
  const exportData = {
    summary,
    rawData: analytics,
    exportedAt: new Date().toISOString(),
    note: 'This data is stored locally in your browser and is not shared with anyone.'
  };

  // Track the export event
  trackEvent('export');

  return exportData;
};

// Clear all analytics data
export const clearAnalyticsData = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('ai_patterns_analytics');
    sessionStorage.removeItem('analytics_session_id');
  } catch (error) {
    console.warn('Failed to clear analytics data:', error);
  }
};

// Hook for React components
export const useAnalytics = () => {
  return {
    trackEvent,
    getSummary: getAnalyticsSummary,
    exportData: exportAnalyticsData,
    clearData: clearAnalyticsData
  };
};