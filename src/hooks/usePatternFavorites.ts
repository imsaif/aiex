'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePatterns } from '@/contexts';

const FAVORITES_STORAGE_KEY = 'aiexd-pattern-favorites';

/**
 * Custom hook for managing favorite patterns with localStorage persistence
 */
export function usePatternFavorites() {
  const { patterns } = usePatterns();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        setFavoriteIds(new Set(ids));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify(Array.from(favoriteIds))
        );
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
    }
  }, [favoriteIds, isLoading]);

  // Toggle favorite status
  const toggleFavorite = useCallback((patternId: string) => {
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(patternId)) {
        newSet.delete(patternId);
      } else {
        newSet.add(patternId);
      }
      return newSet;
    });
  }, []);

  // Add to favorites
  const addFavorite = useCallback((patternId: string) => {
    setFavoriteIds(prev => new Set(prev).add(patternId));
  }, []);

  // Remove from favorites
  const removeFavorite = useCallback((patternId: string) => {
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(patternId);
      return newSet;
    });
  }, []);

  // Check if pattern is favorited
  const isFavorite = useCallback((patternId: string) => {
    return favoriteIds.has(patternId);
  }, [favoriteIds]);

  // Get all favorite patterns
  const favoritePatterns = patterns.filter(pattern => 
    favoriteIds.has(pattern.id)
  );

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavoriteIds(new Set());
  }, []);

  // Export favorites as JSON
  const exportFavorites = useCallback(() => {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      favorites: Array.from(favoriteIds),
      patterns: favoritePatterns.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aiexd-favorites-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [favoriteIds, favoritePatterns]);

  // Import favorites from JSON
  const importFavorites = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.favorites && Array.isArray(data.favorites)) {
        setFavoriteIds(new Set(data.favorites));
        return { success: true, count: data.favorites.length };
      }
      
      throw new Error('Invalid favorites file format');
    } catch (error) {
      console.error('Failed to import favorites:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Import failed' 
      };
    }
  }, []);

  return {
    favoriteIds: Array.from(favoriteIds),
    favoritePatterns,
    favoriteCount: favoriteIds.size,
    isLoading,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    exportFavorites,
    importFavorites
  };
} 