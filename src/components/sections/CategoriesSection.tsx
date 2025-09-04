'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import categoriesData from '../../data/categories'; // Renamed to avoid conflict

interface CategoriesSectionProps {
  // No props needed as categories will be static links
}

const CategoriesSection = ({}: CategoriesSectionProps) => {
  return (
    <div className="w-full bg-surface-primary py-8">
      <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Pattern Themes Column */}
          <div>
            <h4 className="text-text-secondary text-sm font-semibold mb-4">
              Pattern Themes
            </h4>
            <ul className="space-y-2">
              {categoriesData.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/patterns#${category.slug}`} // Link to the section on the patterns page
                    className="text-lg font-medium text-text-primary hover:text-accent-primary transition-colors duration-200"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Removed Interaction Styles Column for now to simplify */}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;
