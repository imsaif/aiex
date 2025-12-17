'use client';

import { NewsletterTag } from '@/types';

interface TagFilterProps {
  tags: NewsletterTag[];
  selectedTags: string[];
  onTagToggle: (tagSlug: string) => void;
  onClearAll?: () => void;
}

export default function TagFilter({
  tags,
  selectedTags,
  onTagToggle,
  onClearAll,
}: TagFilterProps) {
  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    } else {
      selectedTags.forEach(onTagToggle);
    }
  };

  return (
    <div className="space-y-2">
      {/* Clear All */}
      {selectedTags.length > 0 && (
        <button
          onClick={handleClearAll}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-accent-primary hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          Clear all ({selectedTags.length})
        </button>
      )}

      {/* Tag List */}
      <ul className="space-y-1">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.slug);
          return (
            <li key={tag.id}>
              <button
                onClick={() => onTagToggle(tag.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm flex items-center gap-2 ${
                  isSelected
                    ? 'bg-white dark:bg-gray-800 text-black dark:text-white font-semibold shadow-sm'
                    : 'text-text-secondary hover:bg-white dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                    isSelected
                      ? 'bg-accent-primary border-accent-primary'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-white dark:text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                {tag.name}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Empty state */}
      {tags.length === 0 && (
        <p className="text-sm text-text-tertiary px-3 py-2">No tags available</p>
      )}
    </div>
  );
}
