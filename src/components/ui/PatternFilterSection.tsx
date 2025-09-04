'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
      <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16">
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0M3.75 18H7.5m3-6h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 0 0-3 0M3.75 12H7.5" />
            </svg>
            Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatternFilterSection;
