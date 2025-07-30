'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { searchPatterns, getCategories, SearchResult, highlightMatches } from '../../utils/search';
import { useInteractionTracking } from '../../hooks/usePageTracking';
import { Pattern } from '../../types';

interface AdvancedSearchBarProps {
  placeholder?: string;
  className?: string;
  onPatternSelect?: (pattern: Pattern) => void;
  showResults?: boolean;
  maxResults?: number;
}

export default function AdvancedSearchBar({ 
  placeholder = "Search patterns, categories, or use cases...", 
  className = "",
  onPatternSelect,
  showResults = true,
  maxResults = 8
}: AdvancedSearchBarProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { trackSearch } = useInteractionTracking();
  
  const categories = getCategories();

  // Perform search when query or category changes
  useEffect(() => {
    const performSearch = async () => {
      if (query.trim().length >= 2 || selectedCategory) {
        const searchResults = await searchPatterns(query, {
          limit: maxResults,
          category: selectedCategory || undefined,
          minScore: 0.6
        });
        setResults(searchResults);
        setIsOpen(showResults && searchResults.length > 0);
        
        // Track search analytics
        if (query.trim().length >= 2) {
          trackSearch(query, searchResults.length);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
      setSelectedIndex(-1);
    };

    performSearch();
  }, [query, selectedCategory, maxResults, showResults]);

  // Handle click outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handlePatternSelect(results[selectedIndex].item);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handlePatternSelect = (pattern: Pattern) => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(-1);
    if (onPatternSelect) {
      onPatternSelect(pattern);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedCategory('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-12 text-gray-700 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Clear Button */}
        {(query || selectedCategory) && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            !selectedCategory 
              ? 'bg-blue-100 text-blue-700 border border-blue-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Categories
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedCategory === category 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2 px-2">
              {results.length} pattern{results.length !== 1 ? 's' : ''} found
            </div>
            {results.map((result, index) => (
              <Link
                key={result.item.id}
                href={`/patterns/${result.item.id}`}
                onClick={() => handlePatternSelect(result.item)}
                className={`block p-3 rounded-lg transition-colors ${
                  index === selectedIndex 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {result.item.category.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 
                      className="text-sm font-medium text-gray-900 truncate"
                      dangerouslySetInnerHTML={{ 
                        __html: result.matches 
                          ? highlightMatches(result.item.title, result.matches, 'title')
                          : result.item.title
                      }}
                    />
                    <p 
                      className="text-xs text-gray-500 mt-1 line-clamp-2"
                      dangerouslySetInnerHTML={{ 
                        __html: result.matches 
                          ? highlightMatches(result.item.description.slice(0, 100) + '...', result.matches, 'description')
                          : result.item.description.slice(0, 100) + '...'
                      }}
                    />
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {result.item.category}
                      </span>
                      {result.score && (
                        <span className="text-xs text-gray-400">
                          {Math.round((1 - result.score) * 100)}% match
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
          <div className="text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm">No patterns found for "{query}"</p>
            <p className="text-xs mt-1">Try different keywords or browse categories above</p>
          </div>
        </div>
      )}
    </div>
  );
}