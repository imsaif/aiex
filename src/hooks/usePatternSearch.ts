'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePatterns } from '@/contexts';

interface UsePatternSearchOptions {
  searchFields?: ('title' | 'description' | 'category' | 'tags')[];
  debounceDelay?: number;
  minSearchLength?: number;
}

/**
 * Custom hook for searching patterns with debouncing and configurable search fields
 */
export function usePatternSearch(options: UsePatternSearchOptions = {}) {
  const {
    searchFields = ['title', 'description'],
    debounceDelay = 300,
    minSearchLength = 2
  } = options;

  const { patterns, loading, error } = usePatterns();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search term
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceDelay]);

  // Search results
  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < minSearchLength) {
      return patterns;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    
    return patterns.filter(pattern => {
      // Search in title
      if (searchFields.includes('title') && 
          pattern.title.toLowerCase().includes(searchLower)) {
        return true;
      }

      // Search in description
      if (searchFields.includes('description') && 
          pattern.description.toLowerCase().includes(searchLower)) {
        return true;
      }

      // Search in category
      if (searchFields.includes('category') && 
          pattern.category.toLowerCase().includes(searchLower)) {
        return true;
      }

      // Search in tags
      if (searchFields.includes('tags') && pattern.tags) {
        return pattern.tags.some(tag => 
          tag.toLowerCase().includes(searchLower)
        );
      }

      return false;
    });
  }, [patterns, debouncedSearchTerm, searchFields, minSearchLength]);

  // Highlighted search results (with match info)
  const highlightedResults = useMemo(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < minSearchLength) {
      return searchResults.map(pattern => ({
        pattern,
        highlights: {}
      }));
    }

    return searchResults.map(pattern => {
      const highlights: Record<string, string> = {};
      const searchLower = debouncedSearchTerm.toLowerCase();

      // Highlight matching fields
      if (searchFields.includes('title')) {
        const titleLower = pattern.title.toLowerCase();
        if (titleLower.includes(searchLower)) {
          highlights.title = highlightText(pattern.title, debouncedSearchTerm);
        }
      }

      if (searchFields.includes('description')) {
        const descLower = pattern.description.toLowerCase();
        if (descLower.includes(searchLower)) {
          highlights.description = highlightText(pattern.description, debouncedSearchTerm);
        }
      }

      return { pattern, highlights };
    });
  }, [searchResults, debouncedSearchTerm, searchFields, minSearchLength]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    highlightedResults,
    isSearching: isSearching || loading,
    error,
    resultCount: searchResults.length,
    isFiltered: debouncedSearchTerm.length >= minSearchLength
  };
}

/**
 * Helper function to highlight matching text
 */
function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
} 