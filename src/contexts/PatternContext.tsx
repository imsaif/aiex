'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Pattern, Category, PatternFilter, PatternContextType } from '../types';
import patterns from '../data/patterns';
import categoriesData from '../data/categories';

// Create the context with undefined default value
const PatternContext = createContext<PatternContextType | undefined>(undefined);

/**
 * PatternProvider component that provides pattern data and utilities to child components
 */
export function PatternProvider({ children }: { children: ReactNode }) {
  const [allPatterns] = useState<Pattern[]>(patterns);
  const [categories] = useState<Category[]>(categoriesData);
  const [loading] = useState(false); // No loading needed for static imports
  const [error] = useState<string | null>(null);
  const [lastUpdated] = useState<Date>(new Date());

  // Optimized pattern getter with memoization
  const getPattern = useCallback((slug: string): Pattern | null => {
    return allPatterns.find(pattern => pattern.slug === slug) || null;
  }, [allPatterns]);

  // Optimized category getter with memoization
  const getPatternsByCategory = useCallback((category: string): Pattern[] => {
    return allPatterns.filter(pattern => 
      pattern.category.toLowerCase() === category.toLowerCase() ||
      pattern.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
    );
  }, [allPatterns]);

  // Optimized filter function with memoization
  const filterPatterns = useCallback((filter: PatternFilter): Pattern[] => {
    return allPatterns.filter(pattern => {
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
  }, [allPatterns]);

  const contextValue: PatternContextType = {
    patterns: allPatterns,
    categories,
    loading,
    error,
    lastUpdated,
    getPattern,
    getPatternsByCategory,
    filterPatterns,
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

 