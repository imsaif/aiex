'use client';

import React from 'react';
import { useFavorites } from '../../hooks/useFavorites';

interface FavoriteButtonProps {
  patternId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'button' | 'icon';
}

export default function FavoriteButton({ 
  patternId, 
  className = '',
  size = 'md',
  showLabel = false,
  variant = 'icon'
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoading } = useFavorites();
  
  const isPatternFavorite = isFavorite(patternId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(patternId);
  };

  // Size configurations
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  if (isLoading) {
    return (
      <div className={`${buttonSizeClasses[size]} ${className}`}>
        <div className={`${sizeClasses[size]} bg-gray-200 rounded animate-pulse`} />
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggle}
        className={`inline-flex items-center ${buttonSizeClasses[size]} rounded-lg transition-colors ${
          isPatternFavorite
            ? 'text-red-600 bg-red-50 hover:bg-red-100'
            : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
        } ${className}`}
        title={isPatternFavorite ? 'Remove from favorites' : 'Add to favorites'}
        aria-label={isPatternFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg 
          className={sizeClasses[size]} 
          fill={isPatternFavorite ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
        {showLabel && (
          <span className="ml-1 text-sm font-medium">
            {isPatternFavorite ? 'Favorited' : 'Favorite'}
          </span>
        )}
      </button>
    );
  }

  // Icon variant (default)
  return (
    <button
      onClick={handleToggle}
      className={`${buttonSizeClasses[size]} rounded-full transition-colors ${
        isPatternFavorite
          ? 'text-red-600 hover:text-red-700'
          : 'text-gray-400 hover:text-red-500'
      } ${className}`}
      title={isPatternFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={isPatternFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg 
        className={sizeClasses[size]} 
        fill={isPatternFavorite ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
    </button>
  );
}