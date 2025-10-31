'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface PatternFilterSectionProps {
  onSelectSecondaryFilter: (filter: string) => void;
  activeSecondaryFilter: string;
}

const primaryFilters: { id: string; title: string }[] = []; // Removed primary filters as per user feedback

const secondaryFilters = [
  { id: 'latest', title: 'Latest' },
  { id: 'most-popular', title: 'Most Popular' },
  { id: 'top-rated', title: 'Top Rated' },
];

const PatternFilterSection = ({
  onSelectSecondaryFilter,
  activeSecondaryFilter,
}: PatternFilterSectionProps) => {
  return (
    <div className="w-full bg-surface-primary py-4 border-b border-border-primary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-6 overflow-x-auto whitespace-nowrap">
            {/* Removed primary filters as per user feedback */}
            {/* <div className="border-l border-border-secondary mx-3"></div> Separator - removed as primary filters are gone */}
            {secondaryFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onSelectSecondaryFilter(filter.id)}
                className={`relative text-base font-medium pb-2 transition-colors duration-200
                  ${activeSecondaryFilter === filter.id ? 'text-text-primary border-b-2 border-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                {filter.title}
                {activeSecondaryFilter === filter.id && (
                  <motion.span
                    layoutId="filter-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-primary"
                  />
                )}
              </button>
            ))}
          </div>
          <button className="flex items-center text-text-secondary hover:text-text-primary transition-colors duration-200">
            <FunnelIcon className="w-5 h-5 mr-1" />
            Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatternFilterSection;
