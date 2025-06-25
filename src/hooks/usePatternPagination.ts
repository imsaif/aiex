'use client';

import { useState, useMemo, useCallback } from 'react';
import { Pattern } from '@/types';

interface UsePatternPaginationOptions {
  itemsPerPage?: number;
  initialPage?: number;
}

/**
 * Custom hook for paginating pattern lists
 */
export function usePatternPagination(
  patterns: Pattern[],
  options: UsePatternPaginationOptions = {}
) {
  const {
    itemsPerPage = 12,
    initialPage = 1
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(itemsPerPage);

  // Calculate total pages
  const totalPages = Math.ceil(patterns.length / perPage);

  // Get current page patterns
  const paginatedPatterns = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return patterns.slice(startIndex, endIndex);
  }, [patterns, currentPage, perPage]);

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    goToPage(totalPages);
  }, [totalPages, goToPage]);

  // Change items per page
  const changePerPage = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    // Reset to first page when changing items per page
    setCurrentPage(1);
  }, []);

  // Page range for pagination UI
  const getPageRange = useCallback((delta = 2) => {
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    // Always show first page
    range.push(1);

    // Calculate range around current page
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // Always show last page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Add dots where there are gaps
    range.forEach((i) => {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  }, [currentPage, totalPages]);

  // Get pagination info
  const paginationInfo = {
    currentPage,
    totalPages,
    totalItems: patterns.length,
    perPage,
    startIndex: (currentPage - 1) * perPage + 1,
    endIndex: Math.min(currentPage * perPage, patterns.length),
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages
  };

  return {
    // Current page data
    patterns: paginatedPatterns,
    
    // Pagination info
    ...paginationInfo,
    
    // Navigation functions
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    
    // Settings
    changePerPage,
    
    // UI helpers
    getPageRange
  };
} 