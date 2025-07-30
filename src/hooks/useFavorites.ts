'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getFavorites, 
  addToFavorites, 
  removeFromFavorites, 
  toggleFavorite,
  isFavorite as checkIsFavorite
} from '../utils/userPreferences';
import { trackEvent } from '../utils/analytics';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = getFavorites();
        setFavorites(savedFavorites);
      } catch (error) {
        console.warn('Failed to load favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Add to favorites
  const addFavorite = useCallback((patternId: string) => {
    try {
      const newFavorites = addToFavorites(patternId);
      setFavorites(newFavorites);
      trackEvent('favorite', { patternId, action: 'add' });
      return true;
    } catch (error) {
      console.warn('Failed to add favorite:', error);
      return false;
    }
  }, []);

  // Remove from favorites
  const removeFavorite = useCallback((patternId: string) => {
    try {
      const newFavorites = removeFromFavorites(patternId);
      setFavorites(newFavorites);
      trackEvent('favorite', { patternId, action: 'remove' });
      return true;
    } catch (error) {
      console.warn('Failed to remove favorite:', error);
      return false;
    }
  }, []);

  // Toggle favorite status
  const toggleFavoriteStatus = useCallback((patternId: string) => {
    try {
      const result = toggleFavorite(patternId);
      setFavorites(result.favorites);
      trackEvent('favorite', { patternId, action: result.isFavorite ? 'add' : 'remove' });
      return result.isFavorite;
    } catch (error) {
      console.warn('Failed to toggle favorite:', error);
      return checkIsFavorite(patternId);
    }
  }, []);

  // Check if pattern is favorite
  const isFavorite = useCallback((patternId: string) => {
    return favorites.includes(patternId);
  }, [favorites]);

  // Get favorite count
  const favoriteCount = favorites.length;

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    try {
      setFavorites([]);
      // Clear from localStorage
      if (typeof window !== 'undefined' && localStorage) {
        localStorage.removeItem('ai-patterns-favorites');
      }
      return true;
    } catch (error) {
      console.warn('Failed to clear favorites:', error);
      return false;
    }
  }, []);

  return {
    favorites,
    favoriteCount,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite: toggleFavoriteStatus,
    isFavorite,
    clearFavorites
  };
}