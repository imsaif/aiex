'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchAssistanceDemo = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [activeResult, setActiveResult] = useState(-1);
  const [showAssistance, setShowAssistance] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchSuggestions = [
    'contextual assistance patterns',
    'contextual assistance examples',
    'contextual assistance vs progressive disclosure',
    'contextual assistance best practices',
    'contextual assistance in mobile apps',
  ];

  const assistanceMessages = [
    {
      trigger: 'contex',
      message: 'Looking for "contextual assistance"? Try refining your search with specific use cases or platforms.',
    },
    {
      trigger: 'best pract',
      message: 'For best practices, you might want to include your industry or specific application area.',
    },
    {
      trigger: 'examples',
      message: 'Try searching for specific platforms like "mobile" or "web" to see more relevant examples.',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      setShowResults(true);
      setActiveResult(-1);
      checkForAssistance(query);
    } else {
      setShowResults(false);
      setShowAssistance(false);
    }
  };

  const checkForAssistance = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Check if the query matches any of our assistance triggers
    for (const assistance of assistanceMessages) {
      if (lowerQuery.includes(assistance.trigger)) {
        setShowAssistance(true);
        return;
      }
    }
    
    setShowAssistance(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;
    
    // Navigate results with arrow keys
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveResult(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveResult(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && activeResult >= 0) {
      e.preventDefault();
      selectSuggestion(filteredSuggestions[activeResult]);
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowResults(false);
    inputRef.current?.blur();
  };

  // Filter suggestions based on search query
  const filteredSuggestions = searchQuery
    ? searchSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchSuggestions;

  // Get the current assistance message if available
  const currentAssistance = assistanceMessages.find(assistance => 
    searchQuery.toLowerCase().includes(assistance.trigger)
  );

  // Scroll active result into view
  useEffect(() => {
    if (activeResult >= 0 && resultsRef.current) {
      const activeItem = resultsRef.current.children[activeResult] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeResult]);

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <div className="mb-3">
        <h3 className="text-sm font-medium text-gray-700">AI-Enhanced Search</h3>
        <p className="text-xs text-gray-500 mt-1">
          Try searching for terms like &quot;contextual&quot;, &quot;best pract&quot;, or &quot;examples&quot;
        </p>
      </div>
      
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => searchQuery && setShowResults(true)}
            placeholder="Search for patterns..."
            className="w-full px-4 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Search results dropdown */}
        <AnimatePresence>
          {showResults && filteredSuggestions.length > 0 && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border max-h-60 overflow-auto"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  onClick={() => selectSuggestion(suggestion)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    index === activeResult ? 'bg-indigo-50' : ''
                  }`}
                >
                  {suggestion}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Contextual assistance */}
      <AnimatePresence>
        {showAssistance && currentAssistance && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100 text-sm overflow-hidden"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-blue-800">Search Tip</h4>
                <p className="text-blue-700 mt-1">{currentAssistance.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Recent searches - appears contextually */}
      <AnimatePresence>
        {!showResults && searchQuery === '' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h4>
            <div className="flex flex-wrap gap-2">
              {['progressive disclosure', 'contextual assistance', 'adaptive interfaces'].map(term => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchAssistanceDemo; 