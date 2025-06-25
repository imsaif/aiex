'use client';

import React, { useState } from 'react';
import {
  usePatterns,
  usePatternSearch,
  usePatternFavorites,
  usePatternPagination,
  useRecentPatterns
} from '@/hooks';

/**
 * Comprehensive showcase of all pattern-related hooks
 */
export default function HooksShowcase() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Pattern Hooks Showcase</h1>
      
      <SearchExample />
      <FavoritesExample />
      <PaginationExample />
      <RecentPatternsExample />
    </div>
  );
}

/**
 * Example: Pattern Search Hook
 */
function SearchExample() {
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    highlightedResults,
    isSearching,
    resultCount,
    isFiltered
  } = usePatternSearch({
    searchFields: ['title', 'description', 'category', 'tags'],
    debounceDelay: 300,
    minSearchLength: 2
  });

  return (
    <section className="border rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">usePatternSearch Hook</h2>
      
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search patterns..."
          className="w-full px-4 py-2 border rounded-lg"
        />
        <p className="text-sm text-gray-600 mt-2">
          {isSearching ? 'Searching...' : 
           isFiltered ? `Found ${resultCount} results` : 
           'Enter at least 2 characters to search'}
        </p>
      </div>
      
      <div className="space-y-2">
        {highlightedResults.slice(0, 5).map(({ pattern, highlights }) => (
          <div key={pattern.id} className="p-3 bg-gray-50 rounded">
            <h3 
              className="font-medium"
              dangerouslySetInnerHTML={{ 
                __html: highlights.title || pattern.title 
              }}
            />
            <p 
              className="text-sm text-gray-600"
              dangerouslySetInnerHTML={{ 
                __html: highlights.description || pattern.description 
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Example: Pattern Favorites Hook
 */
function FavoritesExample() {
  const {
    favoritePatterns,
    favoriteCount,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    exportFavorites
  } = usePatternFavorites();

  const { patterns } = usePatterns();

  return (
    <section className="border rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">usePatternFavorites Hook</h2>
      
      <div className="mb-4 flex items-center gap-4">
        <p className="text-sm text-gray-600">
          {favoriteCount} patterns in favorites
        </p>
        <button
          onClick={clearFavorites}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          disabled={favoriteCount === 0}
        >
          Clear All
        </button>
        <button
          onClick={exportFavorites}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={favoriteCount === 0}
        >
          Export
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium mb-2">All Patterns</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {patterns.slice(0, 5).map(pattern => (
              <div key={pattern.id} className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(pattern.id)}
                  className={`text-lg ${isFavorite(pattern.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                >
                  {isFavorite(pattern.id) ? '★' : '☆'}
                </button>
                <span className="text-sm">{pattern.title}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Favorites</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {favoritePatterns.map(pattern => (
              <div key={pattern.id} className="text-sm">
                {pattern.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Example: Pattern Pagination Hook
 */
function PaginationExample() {
  const { patterns } = usePatterns();
  const [perPageOption, setPerPageOption] = useState(6);
  
  const {
    patterns: paginatedPatterns,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
    changePerPage,
    getPageRange,
    startIndex,
    endIndex,
    totalItems
  } = usePatternPagination(patterns, {
    itemsPerPage: perPageOption
  });

  return (
    <section className="border rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">usePatternPagination Hook</h2>
      
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {startIndex}-{endIndex} of {totalItems} patterns
        </p>
        <select
          value={perPageOption}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            setPerPageOption(newValue);
            changePerPage(newValue);
          }}
          className="px-3 py-1 border rounded"
        >
          <option value={3}>3 per page</option>
          <option value={6}>6 per page</option>
          <option value={9}>9 per page</option>
        </select>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        {paginatedPatterns.map(pattern => (
          <div key={pattern.id} className="p-3 bg-gray-50 rounded">
            <h3 className="font-medium">{pattern.title}</h3>
            <p className="text-sm text-gray-600">{pattern.category}</p>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={previousPage}
          disabled={!hasPreviousPage}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        
        {getPageRange().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? goToPage(page) : null}
            disabled={page === '...' || page === currentPage}
            className={`px-3 py-1 border rounded ${
              page === currentPage ? 'bg-blue-500 text-white' : ''
            } disabled:opacity-50`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={nextPage}
          disabled={!hasNextPage}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}

/**
 * Example: Recent Patterns Hook
 */
function RecentPatternsExample() {
  const {
    recentPatterns,
    mostViewedPatterns,
    recentCount,
    addRecentPattern,
    clearRecentPatterns,
    getViewCount
  } = useRecentPatterns(5);

  const { patterns } = usePatterns();

  return (
    <section className="border rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">useRecentPatterns Hook</h2>
      
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {recentCount} patterns in history
        </p>
        <button
          onClick={clearRecentPatterns}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          disabled={recentCount === 0}
        >
          Clear History
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium mb-2">Click to View</h3>
          <div className="space-y-2">
            {patterns.slice(0, 5).map(pattern => (
              <button
                key={pattern.id}
                onClick={() => addRecentPattern(pattern.id)}
                className="block w-full text-left p-2 bg-gray-50 rounded hover:bg-gray-100"
              >
                <span className="text-sm">{pattern.title}</span>
                <span className="text-xs text-gray-500 ml-2">
                  (viewed {getViewCount(pattern.id)}x)
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Recent & Most Viewed</h3>
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-600">Recently Viewed:</p>
            {recentPatterns.map(({ pattern, viewedAt, viewCount }) => (
              <div key={pattern.id} className="text-sm">
                {pattern.title} ({viewCount}x)
              </div>
            ))}
            
            {mostViewedPatterns.length > 0 && (
              <>
                <p className="text-xs font-medium text-gray-600 mt-3">Most Viewed:</p>
                {mostViewedPatterns.map(({ pattern, viewCount }) => (
                  <div key={pattern.id} className="text-sm">
                    {pattern.title} ({viewCount}x)
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 