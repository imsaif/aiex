'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Pattern, Category, PatternFilter, PatternContextType } from '../types';
import { 
  loadAllPatterns, 
  getCachedPatterns, 
  isPatternCached, 
  preloadPatterns,
  getLoadMetrics,
  getCacheStats,
  clearPatternCache
} from '../data/patterns/utils/pattern-loader';
import categoriesData from '../data/categories';

// Create the context with undefined default value
const PatternContext = createContext<PatternContextType | undefined>(undefined);

/**
 * PatternProvider component that provides pattern data and utilities to child components
 */
export function PatternProvider({ children }: { children: ReactNode }) {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [categories] = useState<Category[]>(categoriesData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load patterns on mount with caching optimization
  useEffect(() => {
    const loadPatterns = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if we have cached patterns first
        const cachedPatterns = getCachedPatterns();
        if (cachedPatterns.length > 0) {
          setPatterns(cachedPatterns);
          setLastUpdated(new Date());
          setLoading(false);
          return;
        }
        
        // Load all patterns (will use caching internally)
        const loadedPatterns = await loadAllPatterns();
        setPatterns(loadedPatterns);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Failed to load patterns:', err);
        setError(err instanceof Error ? err.message : 'Failed to load patterns');
      } finally {
        setLoading(false);
      }
    };

    loadPatterns();
  }, []);

  // Optimized pattern getter with memoization
  const getPattern = useCallback((slug: string): Pattern | null => {
    return patterns.find(pattern => pattern.slug === slug) || null;
  }, [patterns]);

  // Optimized category getter with memoization
  const getPatternsByCategory = useCallback((category: string): Pattern[] => {
    return patterns.filter(pattern => 
      pattern.category.toLowerCase() === category.toLowerCase() ||
      pattern.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
    );
  }, [patterns]);

  // Optimized filter function with memoization
  const filterPatterns = useCallback((filter: PatternFilter): Pattern[] => {
    return patterns.filter(pattern => {
      // Filter by category
      if (filter.category && pattern.category !== filter.category) {
        return false;
      }

      // Filter by status
      if (filter.status && pattern.status !== filter.status) {
        return false;
      }

      // Filter by priority
      if (filter.priority && pattern.priority !== filter.priority) {
        return false;
      }

      // Filter by tags
      if (filter.tags && filter.tags.length > 0) {
        const patternTags = pattern.tags || [];
        const hasAllTags = filter.tags.every(tag => 
          patternTags.includes(tag)
        );
        if (!hasAllTags) return false;
      }

      // Filter by complexity range
      if (filter.complexityRange && pattern.complexity !== undefined) {
        const [min, max] = filter.complexityRange;
        if (pattern.complexity < min || pattern.complexity > max) {
          return false;
        }
      }

      return true;
    });
  }, [patterns]);

  // Preload patterns for better UX
  const preloadPatternsForCategory = useCallback(async (category: string) => {
    const categoryPatterns = getPatternsByCategory(category);
    const patternIds = categoryPatterns.map(p => p.id);
    await preloadPatterns(patternIds);
  }, [getPatternsByCategory]);

  // Refresh patterns (useful for development)
  const refreshPatterns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      clearPatternCache(); // Clear cache to force reload
      const loadedPatterns = await loadAllPatterns();
      setPatterns(loadedPatterns);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to refresh patterns:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh patterns');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get performance metrics
  const getPerformanceMetrics = useCallback(() => {
    return {
      loadMetrics: getLoadMetrics(),
      cacheStats: getCacheStats(),
      lastUpdated,
      patternCount: patterns.length
    };
  }, [lastUpdated, patterns.length]);

  // Check if a pattern is cached
  const isPatternCachedById = useCallback((patternId: string): boolean => {
    return isPatternCached(patternId);
  }, []);

  const contextValue: PatternContextType = {
    patterns,
    categories,
    loading,
    error,
    lastUpdated,
    getPattern,
    getPatternsByCategory,
    filterPatterns,
    preloadPatternsForCategory,
    refreshPatterns,
    getPerformanceMetrics,
    isPatternCached: isPatternCachedById,
  };

  return (
    <PatternContext.Provider value={contextValue}>
      {children}
    </PatternContext.Provider>
  );
}

/**
 * Custom hook to use the PatternContext
 * Throws error if used outside of PatternProvider
 */
export function usePatterns() {
  const context = useContext(PatternContext);
  
  if (context === undefined) {
    throw new Error('usePatterns must be used within a PatternProvider');
  }
  
  return context;
}

/**
 * Custom hook to get a single pattern by slug
 */
export function usePattern(slug: string) {
  const { patterns, loading, error, getPattern } = usePatterns();
  const pattern = useMemo(() => getPattern(slug), [getPattern, slug]);
  
  return { pattern, loading, error };
}

/**
 * Custom hook to get patterns by category
 */
export function usePatternsByCategory(category: string) {
  const { getPatternsByCategory, loading, error } = usePatterns();
  const patterns = useMemo(() => getPatternsByCategory(category), [getPatternsByCategory, category]);
  
  return { patterns, loading, error };
}

/**
 * Custom hook to filter patterns
 */
export function useFilteredPatterns(filter: PatternFilter) {
  const { filterPatterns, loading, error } = usePatterns();
  const patterns = useMemo(() => filterPatterns(filter), [filterPatterns, filter]);
  
  return { patterns, loading, error };
}

/**
 * Custom hook for performance monitoring
 */
export function usePatternPerformance() {
  const { getPerformanceMetrics } = usePatterns();
  const [metrics, setMetrics] = useState(getPerformanceMetrics());

  const refreshMetrics = useCallback(() => {
    setMetrics(getPerformanceMetrics());
  }, [getPerformanceMetrics]);

  return { metrics, refreshMetrics };
} 