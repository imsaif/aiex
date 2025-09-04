'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import allPatterns from '@/data/patterns';
import { Pattern } from '@/types';
import SearchBar from '@/components/ui/SearchBar';
import Navbar from '@/components/layout/Navbar';
import CategoryNavigation from '@/components/layout/CategoryNavigation';
import ScrollToTop from '@/components/ui/ScrollToTop';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performSearch = () => {
      setLoading(true);
      if (searchQuery) {
        const filtered = allPatterns.filter(pattern =>
          pattern.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pattern.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pattern.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
      setLoading(false);
    };

    const handler = setTimeout(() => {
      performSearch();
    }, 300); // Debounce search for 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    // Update URL to reflect search query
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('query', query);
    window.history.pushState(null, '', `?${newSearchParams.toString()}`);
  };

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />
      <CategoryNavigation 
        onSelectCategory={() => {}} // No category selection on search page
        activeCategoryType=""
        activeCategoryId=""
      />
      
      <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16 py-12">
        <h1 className="text-4xl font-bold mb-8">Search Results for "{searchQuery}"</h1>
        
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearchSubmit} 
            onChange={setSearchQuery}
            placeholder="Search patterns..." 
            className="w-full max-w-xl"
            value={searchQuery}
          />
        </div>

        {loading ? (
          <p>Loading search results...</p>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((pattern) => (
              <Link key={pattern.id} href={`/patterns/${pattern.slug}`}>
                <div className="border border-border-primary rounded-lg p-6 hover:shadow-md hover:border-accent-primary transition-all duration-300 bg-surface-secondary">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-3`}>
                    {pattern.category}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{pattern.title}</h3>
                  <p className="text-text-secondary">{pattern.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-text-secondary">No patterns found matching "{searchQuery}".</p>
        )}
      </div>

      <footer className="py-8 mt-24 border-t border-border-primary">
        <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16 text-center">
          <p className="text-sm text-text-secondary">
            Built with ☕ by Imran · 
            <a href="https://www.imranaidesign.com/" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary ml-1">Portfolio</a> · 
            <a href="https://github.com/imsaif" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary ml-1">GitHub</a> · 
            <a href="https://www.linkedin.com/in/imsaif/" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary ml-1">LinkedIn</a>
          </p>
        </div>
      </footer>

      <ScrollToTop />
    </main>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
