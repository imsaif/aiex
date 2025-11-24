'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Industry } from '../../data/utils/industry-utils';

interface IndustryFilterBarProps {
  industries: Industry[];
  selectedIndustries: string[];
  onIndustriesChange: (industries: string[]) => void;
}

const IndustryFilterBar: React.FC<IndustryFilterBarProps> = ({
  industries,
  selectedIndustries,
  onIndustriesChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter industries based on search
  const filteredIndustries = industries.filter(industry =>
    industry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleIndustryToggle = (industryName: string) => {
    if (selectedIndustries.includes(industryName)) {
      onIndustriesChange(selectedIndustries.filter(i => i !== industryName));
    } else {
      onIndustriesChange([...selectedIndustries, industryName]);
    }
  };

  const handleRemoveIndustry = (industryName: string) => {
    onIndustriesChange(selectedIndustries.filter(i => i !== industryName));
  };

  const handleClearAll = () => {
    onIndustriesChange([]);
    setSearchQuery('');
    setIsOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Dropdown Button */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-700 text-sm font-medium text-gray-900 dark:text-gray-100
                   hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          {selectedIndustries.length > 0 ? `Industries (${selectedIndustries.length})` : 'All Industries'}
          <ChevronDownIcon
            className={`w-4 h-4 text-gray-900 dark:text-gray-100 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                        rounded-lg shadow-2xl z-50 min-w-[280px]">
            {/* Search Input */}
            <div className="sticky top-0 p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-t-lg">
              <input
                type="text"
                placeholder="Search industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800
                         border border-gray-200 dark:border-gray-700 text-sm
                         text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                autoFocus
              />
            </div>

            {/* Industry List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredIndustries.length > 0 ? (
                filteredIndustries.map(industry => (
                  <label
                    key={industry.name}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800
                             cursor-pointer transition-colors border-b border-gray-200 dark:border-gray-800 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIndustries.includes(industry.name)}
                      onChange={() => handleIndustryToggle(industry.name)}
                      className="w-4 h-4 rounded border-gray-300 text-green-600 cursor-pointer"
                    />
                    <span className="flex-grow text-sm text-gray-900 dark:text-gray-100">{industry.name}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {industry.count}
                    </span>
                  </label>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
                  No industries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Industries as Chips */}
      {selectedIndustries.map(industry => (
        <div
          key={industry}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg
                   bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
        >
          <span className="text-sm text-green-800 dark:text-green-300">{industry}</span>
          <button
            onClick={() => handleRemoveIndustry(industry)}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300
                     transition-colors ml-1"
            aria-label={`Remove ${industry} filter`}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* Clear All Button - Only show when filters are active */}
      {selectedIndustries.length > 0 && (
        <button
          onClick={handleClearAll}
          className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300
                   hover:underline transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default IndustryFilterBar;
