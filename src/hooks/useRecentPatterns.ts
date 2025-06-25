'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pattern } from '@/types';
import { usePatterns } from '@/contexts';

const RECENT_STORAGE_KEY = 'aiexd-recent-patterns';
const MAX_RECENT_ITEMS = 10;

interface RecentPatternEntry {
  patternId: string;
  viewedAt: string;
  viewCount: number;
}

/**
 * Custom hook for tracking recently viewed patterns
 */
export function useRecentPatterns(maxItems: number = MAX_RECENT_ITEMS) {
  const { patterns } = usePatterns();
  const [recentEntries, setRecentEntries] = useState<RecentPatternEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load recent patterns from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_STORAGE_KEY);
      if (stored) {
        const entries = JSON.parse(stored) as RecentPatternEntry[];
        // Validate and filter out any invalid entries
        const validEntries = entries.filter(entry => 
          entry.patternId && entry.viewedAt && typeof entry.viewCount === 'number'
        );
        setRecentEntries(validEntries.slice(0, maxItems));
      }
    } catch (error) {
      console.error('Failed to load recent patterns:', error);
    } finally {
      setIsLoading(false);
    }
  }, [maxItems]);

  // Save recent patterns to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(
          RECENT_STORAGE_KEY,
          JSON.stringify(recentEntries)
        );
      } catch (error) {
        console.error('Failed to save recent patterns:', error);
      }
    }
  }, [recentEntries, isLoading]);

  // Add or update a pattern in recent history
  const addRecentPattern = useCallback((patternId: string) => {
    setRecentEntries(prev => {
      const now = new Date().toISOString();
      const existingIndex = prev.findIndex(entry => entry.patternId === patternId);
      
      if (existingIndex !== -1) {
        // Pattern already exists, update it
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          viewedAt: now,
          viewCount: updated[existingIndex].viewCount + 1
        };
        // Move to front
        const [updatedEntry] = updated.splice(existingIndex, 1);
        return [updatedEntry, ...updated].slice(0, maxItems);
      } else {
        // New pattern, add to front
        const newEntry: RecentPatternEntry = {
          patternId,
          viewedAt: now,
          viewCount: 1
        };
        return [newEntry, ...prev].slice(0, maxItems);
      }
    });
  }, [maxItems]);

  // Remove a pattern from recent history
  const removeRecentPattern = useCallback((patternId: string) => {
    setRecentEntries(prev => 
      prev.filter(entry => entry.patternId !== patternId)
    );
  }, []);

  // Clear all recent patterns
  const clearRecentPatterns = useCallback(() => {
    setRecentEntries([]);
  }, []);

  // Get the actual pattern objects for recent entries
  const recentPatterns = recentEntries
    .map(entry => {
      const pattern = patterns.find(p => p.id === entry.patternId);
      return pattern ? { pattern, ...entry } : null;
    })
    .filter((item): item is { pattern: Pattern } & RecentPatternEntry => item !== null);

  // Get most viewed patterns
  const mostViewedPatterns = [...recentEntries]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5)
    .map(entry => {
      const pattern = patterns.find(p => p.id === entry.patternId);
      return pattern ? { pattern, ...entry } : null;
    })
    .filter((item): item is { pattern: Pattern } & RecentPatternEntry => item !== null);

  // Check if a pattern is in recent history
  const isRecentPattern = useCallback((patternId: string) => {
    return recentEntries.some(entry => entry.patternId === patternId);
  }, [recentEntries]);

  // Get view count for a pattern
  const getViewCount = useCallback((patternId: string) => {
    const entry = recentEntries.find(e => e.patternId === patternId);
    return entry?.viewCount || 0;
  }, [recentEntries]);

  return {
    recentPatterns,
    mostViewedPatterns,
    recentCount: recentEntries.length,
    isLoading,
    addRecentPattern,
    removeRecentPattern,
    clearRecentPatterns,
    isRecentPattern,
    getViewCount
  };
} 