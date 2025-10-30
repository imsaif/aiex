'use client';

import { useEffect, useCallback, useRef, useState } from 'react';

/**
 * Hook to track when page visibility changes
 * Useful for pausing/resuming timers when user switches tabs
 */
export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const pageHiddenAtRef = useRef<number | null>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden - record the time
        pageHiddenAtRef.current = Date.now();
        setIsVisible(false);
      } else {
        // Page is visible again
        setIsVisible(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Get elapsed time while page was hidden
  const getHiddenTime = useCallback(() => {
    if (pageHiddenAtRef.current === null) return 0;
    return Date.now() - pageHiddenAtRef.current;
  }, []);

  // Reset hidden time tracking
  const resetHiddenTime = useCallback(() => {
    pageHiddenAtRef.current = null;
  }, []);

  return {
    isVisible,
    getHiddenTime,
    resetHiddenTime,
  };
}
