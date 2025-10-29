'use client';

import { useState, useEffect, useCallback } from 'react';

interface GuideProgressState {
  completed: boolean;
  completedLessons: string[]; // Track which specific lessons are done
  checklist: Record<string, boolean>;
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

    // Checklist operations
    toggleChecklistItem,
    isChecklistItemChecked,

    // Stats and info
    getProgressStats,

    // Utilities
    clearProgress,
  };
}
