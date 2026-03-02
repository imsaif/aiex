'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  trackPatternView,
  getUniqueViewCount,
  shouldShowSmartPrompt,
  dismissSmartPrompt,
  setHandbookDownloaded,
  hasDownloadedHandbook,
  isNewsletterSubscribed
} from '../utils/userPreferences';

interface UsePatternViewTrackerReturn {
  viewCount: number;
  showPrompt: boolean;
  trackView: (patternId: string) => void;
  dismiss: () => void;
  markHandbookDownloaded: () => void;
  isSubscribed: boolean;
  isHandbookDownloaded: boolean;
}

/**
 * Hook to track pattern views and manage smart prompt visibility.
 *
 * The prompt shows only when the user crosses a new milestone
 * (5, 10, 15, 20, 25, 30 unique patterns). Each milestone fires
 * at most once — dismissing or downloading records it permanently.
 */
export function usePatternViewTracker(): UsePatternViewTrackerReturn {
  const [viewCount, setViewCount] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isHandbookDownloaded, setIsHandbookDownloaded] = useState(false);

  // Initialize state on mount — don't show prompt on mount,
  // only after trackView detects a new milestone crossing
  useEffect(() => {
    setViewCount(getUniqueViewCount());
    setIsSubscribed(isNewsletterSubscribed());
    setIsHandbookDownloaded(hasDownloadedHandbook());
  }, []);

  // Track a pattern view — show prompt only if this view crosses a new milestone
  const trackView = useCallback((patternId: string) => {
    const previousCount = getUniqueViewCount();
    trackPatternView(patternId);
    const newCount = getUniqueViewCount();
    setViewCount(newCount);

    // Only check if the count actually changed (new unique pattern)
    if (newCount > previousCount && shouldShowSmartPrompt()) {
      setShowPrompt(true);
    }
  }, []);

  // Dismiss the prompt — marks the current milestone as shown
  const dismiss = useCallback(() => {
    dismissSmartPrompt();
    setShowPrompt(false);
  }, []);

  // Mark handbook as downloaded (hides prompt permanently)
  const markHandbookDownloaded = useCallback(() => {
    setHandbookDownloaded();
    setIsHandbookDownloaded(true);
    setShowPrompt(false);
  }, []);

  return {
    viewCount,
    showPrompt,
    trackView,
    dismiss,
    markHandbookDownloaded,
    isSubscribed,
    isHandbookDownloaded
  };
}
