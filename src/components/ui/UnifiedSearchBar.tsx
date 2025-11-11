'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface UnifiedSearchBarProps {
  /**
   * Placeholder text for the search input
   */
  placeholder?: string;

  /**
   * Current search query value (for controlled component)
   */
  value?: string;

  /**
   * Callback when search value changes
   */
  onChange?: (query: string) => void;

  /**
   * Callback when search is submitted (Enter key or button click)
   */
  onSearch?: (query: string) => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Show loading state indicator
   */
  isLoading?: boolean;

  /**
   * Disable the search input
   */
  disabled?: boolean;

  /**
   * Icon type for search button: 'search' | 'button' | 'none'
   * 'search' - Show magnifying glass icon (default)
   * 'button' - Show as button style
   * 'none' - No button, input only
   */
  iconType?: 'search' | 'button' | 'none';

  /**
   * Size variant: 'sm' | 'md' | 'lg'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Auto-focus input on mount
   */
  autoFocus?: boolean;
}

export default function UnifiedSearchBar({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  onSearch,
  className = '',
  isLoading = false,
  disabled = false,
  iconType = 'search',
  size = 'md',
  autoFocus = false,
}: UnifiedSearchBarProps) {
  const [internalValue, setInternalValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  // Auto-focus on mount if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }

    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && !disabled) {
      onSearch(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch && !disabled) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    if (controlledValue === undefined) {
      setInternalValue('');
    }

    if (onChange) {
      onChange('');
    }

    inputRef.current?.focus();
  };

  // Size mappings
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-4 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconPaddingClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2',
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full
            ${sizeClasses[size]}
            pl-12
            pr-12
            text-text-primary
            bg-surface-primary
            border border-gray-200 dark:border-gray-700
            rounded-lg
            hover:border-gray-300 dark:hover:border-gray-600
            focus:outline-none
            focus:ring-2
            focus:ring-ring-focus
            focus:border-transparent
            placeholder-text-disabled
            transition-all
            duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />

        {/* Search Icon (left side) */}
        {iconType !== 'none' && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg
              className={`${iconSizeClasses[size]} text-text-secondary`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
        )}

        {/* Right side actions (Clear button or Loading spinner) */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1">
          {/* Loading Spinner */}
          {isLoading && (
            <motion.div
              className="animate-spin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <svg
                className={`${iconSizeClasses[size]} text-ring-focus`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </motion.div>
          )}

          {/* Clear Button */}
          {!isLoading && value && (
            <motion.button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className={`
                ${iconPaddingClasses[size]}
                text-text-secondary
                hover:text-text-primary
                transition-colors
                disabled:cursor-not-allowed
                disabled:opacity-50
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className={iconSizeClasses[size]}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
    </form>
  );
}
