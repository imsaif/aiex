'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useGuideProgress } from './useGuideProgress';
import { usePageVisibility } from './usePageVisibility';

interface UseLessonTimerOptions {
  guideId: string;
  lessonId: string;
  enabled?: boolean;
  updateInterval?: number; // milliseconds between updates to localStorage (default 5000)
}

/**
 * Hook to automatically track time spent on a lesson
 * Handles page visibility (pauses when tab is hidden)
 * Periodically saves to localStorage to avoid excessive writes
 */
export function useLessonTimer(options: UseLessonTimerOptions) {
  const {
    guideId,
    lessonId,
    enabled = true,
    updateInterval = 5000, // Save every 5 seconds
  } = options;

  const {
    trackLessonEngagement,
    updateLessonTimeSpent,
    getLessonEngagement,
  } = useGuideProgress();

  const { isVisible } = usePageVisibility();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const accumulatedTimeRef = useRef(0);
  const sessionStartRef = useRef<number | null>(null);
  const lastSaveRef = useRef<number>(Date.now());

  // Initialize engagement tracking when component mounts or lesson changes
  useEffect(() => {
    if (!enabled) return;

    const engagement = getLessonEngagement(guideId, lessonId);
    if (!engagement) {
      // First time viewing this lesson
      trackLessonEngagement(guideId, lessonId);
    }

    sessionStartRef.current = Date.now();
    accumulatedTimeRef.current = 0;

    return () => {
      // Save any remaining time when component unmounts
      if (accumulatedTimeRef.current > 0) {
        updateLessonTimeSpent(guideId, lessonId, accumulatedTimeRef.current);
      }
    };
  }, [enabled, guideId, lessonId, trackLessonEngagement, getLessonEngagement, updateLessonTimeSpent]);

  // Timer logic - tracks elapsed time
  useEffect(() => {
    if (!enabled || !isVisible) {
      // Pause timer if disabled or page is hidden
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (!sessionStartRef.current) {
      sessionStartRef.current = Date.now();
    }

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - sessionStartRef.current!;
      accumulatedTimeRef.current = elapsed;

      // Save to localStorage every updateInterval
      if (now - lastSaveRef.current >= updateInterval) {
        updateLessonTimeSpent(guideId, lessonId, accumulatedTimeRef.current);
        accumulatedTimeRef.current = 0;
        sessionStartRef.current = now;
        lastSaveRef.current = now;
      }
    }, 1000); // Update every 1 second for accuracy

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, isVisible, guideId, lessonId, updateInterval, updateLessonTimeSpent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Save any remaining time
      if (accumulatedTimeRef.current > 0) {
        updateLessonTimeSpent(guideId, lessonId, accumulatedTimeRef.current);
      }
    };
  }, [guideId, lessonId, updateLessonTimeSpent]);
}
