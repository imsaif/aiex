'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import categoriesData from '../../data/categories'; // Renamed to avoid conflict

interface CategoryNavigationProps {
  onSelectCategory: (categoryType: string, categoryId: string | null) => void;
  activeCategoryType: string;
  activeCategoryId: string | null;
}

const categoryTypes = [
  { id: 'pattern-types', title: 'Pattern Themes' }, // Updated title
  { id: 'interaction-styles', title: 'Interaction Styles' },
  // { id: 'application-areas', title: 'Application Areas' }, // Can add later
];

// Dynamically generate patternTypes from the new categories data
const patternTypes = [
  { id: 'all', title: 'All Patterns' },
  ...categoriesData.map(category => ({
    id: category.slug,
    title: category.title,
  })),
];

const interactionStyles = [
  { id: 'all', title: 'All Styles' },
  { id: 'voice-interfaces', title: 'Voice Interfaces' },
  { id: 'chat-interfaces', title: 'Chat Interfaces' },
  { id: 'visual-recognition', title: 'Visual Recognition' },
  { id: 'gesture-controls', title: 'Gesture Controls' },
  { id: 'multi-modal', title: 'Multi-modal' },
];

const getCategoriesForType = (typeId: string) => {
  switch (typeId) {
    case 'pattern-types':
      return patternTypes;
    case 'interaction-styles':
      return interactionStyles;
    default:
      return [];
  }
};

export default function CategoryNavigation({ 
  onSelectCategory, 
  activeCategoryType, 
  activeCategoryId 
}: CategoryNavigationProps) {
  const [currentCategoryType, setCurrentCategoryType] = useState(activeCategoryType);

  const handleCategoryTypeClick = (typeId: string) => {
    setCurrentCategoryType(typeId);
    onSelectCategory(typeId, 'all'); // Reset sub-category when type changes
  };

  return (
    <div className="w-full bg-surface-primary border-b border-primary py-3 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top-level category types */}
        <div className="flex space-x-6 mb-4 border-b border-secondary pb-3 overflow-x-auto whitespace-nowrap">
          {categoryTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleCategoryTypeClick(type.id)}
              className={`relative text-sm font-medium pb-2 transition-colors duration-200
                ${currentCategoryType === type.id ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {type.title}
              {currentCategoryType === type.id && (
                <motion.span
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-primary"
                />
              )}
            </button>
          ))}
        </div>

        {/* Sub-categories based on selected type */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 overflow-x-auto whitespace-nowrap">
          {getCategoriesForType(currentCategoryType).map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(currentCategoryType, category.id)}
              className={`text-sm px-4 py-2 rounded-full transition-colors duration-200
                ${activeCategoryId === category.id && activeCategoryType === currentCategoryType
                  ? 'bg-accent-primary text-white shadow-md'
                  : 'bg-background-tertiary text-text-secondary hover:bg-background-secondary hover:text-text-primary'}`}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
