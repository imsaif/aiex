'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface LessonEngagement {
  startTime: number; // timestamp when lesson first viewed
  lastAccessTime: number; // last time user accessed lesson
  totalTimeSpent: number; // milliseconds spent on lesson
  viewCount: number; // how many times user opened lesson
}

interface GuideProgressState {
  completed: boolean;
  completedLessons: string[]; // Track which specific lessons are done
  checklist: Record<string, boolean>;
  engagement?: Record<string, LessonEngagement>; // Track time & engagement per lesson
}

interface GuideProgressData {
  [guideId: string]: GuideProgressState;
}

const STORAGE_KEY = 'guide-progress';

/**
 * Custom hook to manage guide progress with localStorage persistence
 * Tracks completion status and checklist items for each guide
 */
export function useGuideProgress() {
  const [progress, setProgress] = useState<GuideProgressData>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load guide progress:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save progress to localStorage whenever it changes
  const saveProgress = useCallback((newProgress: GuideProgressData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error('Failed to save guide progress:', error);
    }
  }, []);

  // Mark a guide as completed
  const markGuideComplete = useCallback(
    (guideId: string) => {
      const newProgress = { ...progress };
      if (!newProgress[guideId]) {
        newProgress[guideId] = { completed: false, completedLessons: [], checklist: {} };
      }
      newProgress[guideId].completed = true;
      saveProgress(newProgress);
    },
    [progress, saveProgress]
  );

  // Mark a guide as incomplete
  const markGuideIncomplete = useCallback(
    (guideId: string) => {
      const newProgress = { ...progress };
      if (!newProgress[guideId]) {
        newProgress[guideId] = { completed: false, completedLessons: [], checklist: {} };
      }
      newProgress[guideId].completed = false;
      saveProgress(newProgress);
    },
    [progress, saveProgress]
  );

  // Toggle a checklist item in a guide
  const toggleChecklistItem = useCallback(
    (guideId: string, itemId: string) => {
      const newProgress = { ...progress };
      if (!newProgress[guideId]) {
        newProgress[guideId] = { completed: false, completedLessons: [], checklist: {} };
      }
      newProgress[guideId].checklist[itemId] = !newProgress[guideId].checklist[itemId];
      saveProgress(newProgress);
    },
    [progress, saveProgress]
  );

  // Get progress for a specific guide
  const getGuideProgress = useCallback((guideId: string): GuideProgressState => {
    return progress[guideId] || { completed: false, completedLessons: [], checklist: {} };
  }, [progress]);

  // Check if a specific guide is completed
  const isGuideCompleted = useCallback((guideId: string): boolean => {
    return progress[guideId]?.completed || false;
  }, [progress]);

  // Check if a specific checklist item is checked
  const isChecklistItemChecked = useCallback(
    (guideId: string, itemId: string): boolean => {
      return progress[guideId]?.checklist[itemId] || false;
    },
    [progress]
  );

  // Get overall progress stats
  const getProgressStats = useCallback(
    (totalGuides: number) => {
      const completedCount = Object.values(progress).filter((p) => p.completed).length;
      return {
        completed: completedCount,
        total: totalGuides,
        percentage: totalGuides > 0 ? Math.round((completedCount / totalGuides) * 100) : 0,
      };
    },
    [progress]
  );

  // Clear all progress
  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setProgress({});
    } catch (error) {
      console.error('Failed to clear guide progress:', error);
    }
  }, []);

  // Mark a lesson as completed
  const markLessonComplete = useCallback(
    (guideId: string, lessonId: string) => {
      const newProgress = { ...progress };
      if (!newProgress[guideId]) {
        newProgress[guideId] = { completed: false, completedLessons: [], checklist: {} };
      }
      if (!newProgress[guideId].completedLessons.includes(lessonId)) {
        newProgress[guideId].completedLessons.push(lessonId);
      }
      saveProgress(newProgress);
    },
    [progress, saveProgress]
  );

  // Mark a lesson as incomplete
  const markLessonIncomplete = useCallback(
    (guideId: string, lessonId: string) => {
      const newProgress = { ...progress };
      if (!newProgress[guideId]) {
        newProgress[guideId] = { completed: false, completedLessons: [], checklist: {} };
      }
      newProgress[guideId].completedLessons = newProgress[guideId].completedLessons.filter(
        (id) => id !== lessonId
      );
      saveProgress(newProgress);
    },
    [progress, saveProgress]
  );

  // Check if a specific lesson is completed
  const isLessonCompleted = useCallback(
    (guideId: string, lessonId: string): boolean => {
      return progress[guideId]?.completedLessons.includes(lessonId) || false;
    },
    [progress]
  );

  // Get lesson progress for a guide
  const getLessonProgress = useCallback(
    (guideId: string, totalLessons: number) => {
      const completed = progress[guideId]?.completedLessons.length || 0;
      const percentage = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
      return {
        completed,
        total: totalLessons,
        percentage,
      };
    },
    [progress]
  );

  // Get guide status based on lesson completion
  const getGuideStatus = useCallback(
    (guideId: string, totalLessons: number): 'not-started' | 'in-progress' | 'completed' => {
      const completed = progress[guideId]?.completedLessons.length || 0;
      if (completed === 0) return 'not-started';
      if (completed === totalLessons) return 'completed';
      return 'in-progress';
    },
    [progress]
  );

  // Track lesson engagement (time spent, views, etc.)
  const trackLessonEngagement = useCallback(
    (guideId: string, lessonId: string) => {
      const newProgress = { ...progress };
      if (!newProgress[guideId]) {
        newProgress[guideId] = { completed: false, completedLessons: [], checklist: {} };
      }
      if (!newProgress[guideId].engagement) {
        newProgress[guideId].engagement = {};
      }

      const now = Date.now();
      const engagement = newProgress[guideId].engagement![lessonId];

      if (!engagement) {
        // First time viewing this lesson
        newProgress[guideId].engagement![lessonId] = {
          startTime: now,
          lastAccessTime: now,
          totalTimeSpent: 0,
          viewCount: 1,
        };
      } else {
        // Returning to lesson - increment view count and update last access
        engagement.lastAccessTime = now;
        engagement.viewCount += 1;
      }

      saveProgress(newProgress);
    },
    [progress, saveProgress]
  );

  // Update time spent on a lesson (call periodically or on blur)
  const updateLessonTimeSpent = useCallback(
    (guideId: string, lessonId: string, additionalTime: number) => {
      const newProgress = { ...progress };
      if (!newProgress[guideId]?.engagement?.[lessonId]) {
        return; // Engagement tracking not started for this lesson
      }

      newProgress[guideId].engagement![lessonId].totalTimeSpent += additionalTime;
      newProgress[guideId].engagement![lessonId].lastAccessTime = Date.now();
      saveProgress(newProgress);
    },
    [progress, saveProgress]
  );

  // Get engagement metrics for a lesson
  const getLessonEngagement = useCallback(
    (guideId: string, lessonId: string): LessonEngagement | null => {
      return progress[guideId]?.engagement?.[lessonId] || null;
    },
    [progress]
  );

  // Get formatted time spent string (e.g., "5 mins", "1 hour 20 mins")
  const getTimeSpentDisplay = useCallback((milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      const remainingMins = minutes % 60;
      return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
    }
    if (minutes > 0) {
      return `${minutes}m`;
    }
    return `${seconds}s`;
  }, []);

  // Get total time spent on a guide
  const getGuideTotalTimeSpent = useCallback(
    (guideId: string): number => {
      const engagement = progress[guideId]?.engagement;
      if (!engagement) return 0;
      return Object.values(engagement).reduce((total, lesson) => total + lesson.totalTimeSpent, 0);
    },
    [progress]
  );

  // Get average time per lesson in a guide
  const getGuideAverageTimePerLesson = useCallback(
    (guideId: string): number => {
      const engagement = progress[guideId]?.engagement;
      if (!engagement || Object.keys(engagement).length === 0) return 0;
      const totalTime = Object.values(engagement).reduce((total, lesson) => total + lesson.totalTimeSpent, 0);
      return Math.floor(totalTime / Object.keys(engagement).length);
    },
    [progress]
  );

  return {
    // State
    progress,
    isLoaded,

    // Single guide operations
    markGuideComplete,
    markGuideIncomplete,
    getGuideProgress,
    isGuideCompleted,

    // Lesson tracking operations
    markLessonComplete,
    markLessonIncomplete,
    isLessonCompleted,
    getLessonProgress,
    getGuideStatus,

    // Engagement tracking operations
    trackLessonEngagement,
    updateLessonTimeSpent,
    getLessonEngagement,
    getTimeSpentDisplay,
    getGuideTotalTimeSpent,
    getGuideAverageTimePerLesson,

    // Checklist operations
    toggleChecklistItem,
    isChecklistItemChecked,

    // Stats and info
    getProgressStats,

    // Utilities
    clearProgress,
  };
}
