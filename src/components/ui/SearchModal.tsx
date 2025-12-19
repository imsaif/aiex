'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  Squares2X2Icon,
  BookOpenIcon,
  SparklesIcon,
  NewspaperIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { unifiedSearch, SearchResult, UnifiedSearchResults } from '@/utils/unifiedSearch';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_CONFIG = {
  pattern: {
    icon: Squares2X2Icon,
    label: 'Patterns',
    color: 'text-blue-500',
  },
  guide: {
    icon: BookOpenIcon,
    label: 'Guides',
    color: 'text-green-500',
  },
  prompt: {
    icon: SparklesIcon,
    label: 'Prompts',
    color: 'text-purple-500',
  },
  newsletter: {
    icon: NewspaperIcon,
    label: 'News',
    color: 'text-orange-500',
  },
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UnifiedSearchResults | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle client-side mounting for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (isOpen) {
      setQuery('');
      setResults(null);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Search on query change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        const searchResults = unifiedSearch(query);
        setResults(searchResults);
        setSelectedIndex(0);
      } else {
        setResults(null);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Get all results as a flat array for keyboard navigation
  const getAllResults = useCallback((): SearchResult[] => {
    if (!results) return [];
    return [
      ...results.patterns,
      ...results.guides,
      ...results.prompts,
      ...results.newsletters,
    ];
  }, [results]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      const allResults = getAllResults();

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < allResults.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : allResults.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (allResults[selectedIndex]) {
            router.push(allResults[selectedIndex].href);
            onClose();
          }
          break;
      }
    },
    [isOpen, getAllResults, selectedIndex, router, onClose]
  );

  // Add keyboard listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleResultClick = (href: string) => {
    router.push(href);
    onClose();
  };

  // Calculate the global index for a result
  const getGlobalIndex = (
    type: 'pattern' | 'guide' | 'prompt' | 'newsletter',
    localIndex: number
  ): number => {
    if (!results) return -1;
    let offset = 0;
    if (type === 'guide') offset = results.patterns.length;
    if (type === 'prompt') offset = results.patterns.length + results.guides.length;
    if (type === 'newsletter')
      offset =
        results.patterns.length + results.guides.length + results.prompts.length;
    return offset + localIndex;
  };

  if (!mounted || !isOpen) return null;

  const renderResultGroup = (
    items: SearchResult[],
    type: 'pattern' | 'guide' | 'prompt' | 'newsletter'
  ) => {
    if (items.length === 0) return null;
    const config = CATEGORY_CONFIG[type];
    const Icon = config.icon;

    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-tertiary uppercase tracking-wider">
          <Icon className={`w-4 h-4 ${config.color}`} />
          {config.label}
        </div>
        {items.map((result, index) => {
          const globalIndex = getGlobalIndex(type, index);
          const isSelected = globalIndex === selectedIndex;

          return (
            <button
              key={result.id}
              onClick={() => handleResultClick(result.href)}
              onMouseEnter={() => setSelectedIndex(globalIndex)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                isSelected
                  ? 'bg-surface-secondary text-text-primary'
                  : 'text-text-secondary hover:bg-surface-secondary/50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary flex-shrink-0" />
              <span className="flex-1 truncate">{result.title}</span>
              {isSelected && (
                <span className="text-xs text-text-tertiary">Enter</span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            <div className="bg-surface-primary border border-border-primary rounded-xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border-secondary">
                <MagnifyingGlassIcon className="w-5 h-5 text-text-tertiary flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search patterns, guides, prompts..."
                  className="flex-1 bg-transparent text-text-primary placeholder:text-text-tertiary outline-none text-base"
                />
                <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-surface-secondary transition-colors"
                  aria-label="Close search"
                >
                  <XMarkIcon className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results && results.totalCount > 0 ? (
                  <>
                    {renderResultGroup(results.patterns, 'pattern')}
                    {renderResultGroup(results.guides, 'guide')}
                    {renderResultGroup(results.prompts, 'prompt')}
                    {renderResultGroup(results.newsletters, 'newsletter')}
                  </>
                ) : query.length >= 2 ? (
                  <div className="py-8 text-center text-text-tertiary">
                    No results found for &quot;{query}&quot;
                  </div>
                ) : (
                  <div className="py-8 text-center text-text-tertiary">
                    Type to search...
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-border-secondary text-xs text-text-tertiary">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-surface-secondary font-mono">
                      ↑↓
                    </kbd>
                    <span>Navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-surface-secondary font-mono">
                      ↵
                    </kbd>
                    <span>Open</span>
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface-secondary font-mono">
                    esc
                  </kbd>
                  <span>Close</span>
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
