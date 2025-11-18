'use client';

import { motion } from 'framer-motion';

interface FilterPillsProps {
  selectedCategory: string;
  onFilterClick: () => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({
  selectedCategory,
  onFilterClick,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 -mx-2 px-2">
      <div className="flex gap-2 min-w-max">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onFilterClick}
          className="px-4 py-2.5 rounded-full border-2 border-gray-200 dark:border-gray-600
                   bg-white dark:bg-gray-800 text-text-primary font-medium text-sm
                   hover:border-gray-300 dark:hover:border-gray-500
                   transition-colors flex items-center gap-2 whitespace-nowrap
                   min-h-[44px] touch-manipulation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
            />
          </svg>
          <span>
            {selectedCategory === 'All Categories' ? 'All Patterns' : selectedCategory}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

export default FilterPills;
