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

interface UsePatternViewTrackerOptions {
  threshold?: number;
}

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
 * Hook to track pattern views and manage smart prompt visibility
 *
 * Usage:
 * const { viewCount, showPrompt, trackView, dismiss } = usePatternViewTracker();
 *
 * // Track view on mount
 * useEffect(() => { trackView(pattern.id); }, [pattern.id, trackView]);
 *
 * // Show prompt conditionally
 * {showPrompt && <SmartHandbookPrompt onDismiss={dismiss} />}
 */
export function usePatternViewTracker(
  options: UsePatternViewTrackerOptions = {}
): UsePatternViewTrackerReturn {
  const { threshold = 4 } = options;

  const [viewCount, setViewCount] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isHandbookDownloaded, setIsHandbookDownloaded] = useState(false);

  // Initialize state on mount
  useEffect(() => {
    setViewCount(getUniqueViewCount());
    setShowPrompt(shouldShowSmartPrompt(threshold));
    setIsSubscribed(isNewsletterSubscribed());
    setIsHandbookDownloaded(hasDownloadedHandbook());
  }, [threshold]);

  // Track a pattern view
  const trackView = useCallback((patternId: string) => {
    trackPatternView(patternId);
    const newCount = getUniqueViewCount();
    setViewCount(newCount);

    // Check if we should show prompt after this view
    if (shouldShowSmartPrompt(threshold)) {
      setShowPrompt(true);
    }
  }, [threshold]);

  // Dismiss the prompt for this session
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
