'use client';

import { useState, useMemo } from 'react';
import BottomSheet from './BottomSheet';

interface CategoryFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ id: string; title: string }>;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const CategoryFilterSheet: React.FC<CategoryFilterSheetProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;

    return categories.filter(cat =>
      cat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category);
    onClose();
    setSearchQuery(''); // Reset search when closing
  };

  const handleReset = () => {
    onCategorySelect('All Categories');
    onClose();
    setSearchQuery('');
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} height="75vh">
      <div className="flex flex-col h-full">
        {/* Search Input */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 pb-4 pt-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-100 dark:bg-gray-800
                       border border-gray-200 dark:border-gray-700
                       text-text-primary placeholder-text-secondary
                       focus:outline-none focus:border-gray-400 dark:focus:border-gray-600
                       transition-colors"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
        </div>

        {/* Category List */}
        <div className="flex-1 overflow-y-auto">
          {/* All Categories Option */}
          <button
            onClick={() => handleCategoryClick('All Categories')}
            className={`w-full text-left px-4 py-4 flex items-center justify-between
                     transition-colors hover:bg-gray-50 dark:hover:bg-gray-800
                     ${selectedCategory === 'All Categories' ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
          >
            <span className="text-base font-medium text-text-primary">
              All Categories
            </span>
            {selectedCategory === 'All Categories' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-blue-600"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          {/* Category Options */}
          {filteredCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.title)}
              className={`w-full text-left px-4 py-4 flex items-center justify-between
                       transition-colors hover:bg-gray-50 dark:hover:bg-gray-800
                       border-t border-gray-100 dark:border-gray-800
                       ${selectedCategory === category.title ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
            >
              <span className="text-base text-text-primary">
                {category.title}
              </span>
              {selectedCategory === category.title && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-blue-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}

          {/* No Results */}
          {filteredCategories.length === 0 && (
            <div className="px-4 py-8 text-center text-text-secondary">
              No categories found
            </div>
          )}
        </div>

        {/* Reset Button */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleReset}
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black
                     font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100
                     transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default CategoryFilterSheet;
