'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '../utils/analytics';

/**
 * Hook to automatically track page views
 */
export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view
    trackEvent('page_view', {
      path: pathname,
      referrer: typeof document !== 'undefined' ? document.referrer : null,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null
    });
  }, [pathname]);
}

/**
 * Hook for tracking specific user interactions
 */
export function useInteractionTracking() {
  const trackPatternView = (patternId: string, patternTitle?: string) => {
    trackEvent('pattern_view', { 
      patternId, 
      patternTitle,
      timestamp: Date.now()
    });
  };

  const trackSearch = (query: string, resultCount?: number) => {
    trackEvent('search', { 
      query: query.length > 50 ? query.substring(0, 50) + '...' : query, // Limit query length for privacy
      resultCount,
      timestamp: Date.now()
    });
  };

  const trackFavorite = (patternId: string, action: 'add' | 'remove') => {
    trackEvent('favorite', { 
      patternId, 
      action,
      timestamp: Date.now()
    });
  };

  const trackCodeCopy = (language?: string, codeLength?: number) => {
    trackEvent('copy_code', { 
      language, 
      codeLength,
      timestamp: Date.now()
    });
  };

  return {
    trackPatternView,
    trackSearch,
    trackFavorite,
    trackCodeCopy
  };
}