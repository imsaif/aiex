'use client';

import React from 'react';
import { usePatternUsage } from '../../hooks/usePatternUsage';

interface PatternUsageButtonProps {
  patternId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  variant?: 'default' | 'compact';
}

export default function PatternUsageButton({
  patternId,
  className = '',
  size = 'md',
  showCount = true,
  variant = 'default'
}: PatternUsageButtonProps) {
  const { isUsingPattern, togglePatternUsage, getPatternUsageCount, isLoading } = usePatternUsage();

  const isUsing = isUsingPattern(patternId);
  const usageCount = getPatternUsageCount(patternId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    togglePatternUsage(patternId);
  };

  // Size configurations
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  const iconSizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (isLoading) {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <div className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse h-8 w-32" />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} rounded-full font-medium transition-all ${
          isUsing
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
        } ${className}`}
        title={isUsing ? 'You use this pattern' : 'Mark as using this pattern'}
        aria-label={isUsing ? 'Remove usage' : 'Mark as using'}
      >
        {/* Checkmark icon */}
        <svg
          className={iconSizeClasses[size]}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isUsing ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          )}
        </svg>
        {showCount && <span>{usageCount}</span>}
      </button>
    );
  }

  // Default variant with full text
  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 ${sizeClasses[size]} rounded-lg font-medium transition-all ${
        isUsing
          ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
      } ${className}`}
      title={isUsing ? 'You use this pattern' : 'Mark that you use this pattern'}
      aria-label={isUsing ? 'Remove usage' : 'Mark as using'}
    >
      {/* Icon */}
      <svg
        className={iconSizeClasses[size]}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isUsing ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        )}
      </svg>

      {/* Text */}
      <span>{isUsing ? 'Using This' : 'I Use This'}</span>

      {/* Count badge */}
      {showCount && (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            isUsing
              ? 'bg-blue-500 dark:bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {usageCount}
        </span>
      )}
    </button>
  );
}
