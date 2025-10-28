'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import GuideCard from '@/components/ui/GuideCard';
import GuideFilter from '@/components/ui/GuideFilter';
import { guides, filterGuides, searchGuides } from '@/data/guides';
import { GuideFilter as GuideFilterType } from '@/types';

export default function GuidesClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<GuideFilterType>({});

  const filteredGuides = useMemo(() => {
    let result = guides;

    // Apply search
    if (searchQuery) {
      result = searchGuides(searchQuery);
    }

    // Apply filters
    if (Object.values(filter).some((v) => v !== undefined)) {
      result = result.filter((guide) => {
        if (filter.tool && guide.tool !== filter.tool) return false;
        if (filter.skillLevel && guide.skillLevel !== filter.skillLevel) return false;
        if (filter.designDomain && guide.designDomain !== filter.designDomain) return false;
        return true;
      });
    }

    return result;
  }, [searchQuery, filter]);

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Info Chip */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {guides.length} Designer Guides
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Practical AI Guides for Designers
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-8">
              Learn how to integrate AI tools into your design workflow with practical guides.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search guides by tool, use case, or skill level"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pr-12 rounded-lg bg-surface-primary border border-border-primary
                           text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-primary
                           transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-text-primary text-background-primary rounded-md
                                 hover:bg-text-secondary transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div id="guides" className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar - Filters */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-surface-primary rounded-xl p-6 border border-border-primary sticky top-20">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              <GuideFilter
                onFilterChange={setFilter}
                selectedTool={filter.tool}
                selectedSkillLevel={filter.skillLevel}
                selectedDomain={filter.designDomain}
              />
            </div>
          </aside>

          {/* Guides Grid */}
          <div className="flex-1">
            {/* Active Filters Display and Clear */}
            {(Object.values(filter).some((v) => v !== undefined) || searchQuery) && (
              <div className="mb-6 flex flex-wrap items-center gap-3">
                {/* Selected Filter Chips */}
                {filter.tool && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                               bg-accent-subtle border border-accent-primary/30">
                    <span className="text-sm text-accent-primary font-medium">Tool: {filter.tool}</span>
                    <button
                      onClick={() => setFilter({ ...filter, tool: undefined })}
                      className="text-accent-primary hover:text-accent-hover transition-colors"
                      aria-label="Remove tool filter"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {filter.skillLevel && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                               bg-accent-subtle border border-accent-primary/30">
                    <span className="text-sm text-accent-primary font-medium">Level: {filter.skillLevel}</span>
                    <button
                      onClick={() => setFilter({ ...filter, skillLevel: undefined })}
                      className="text-accent-primary hover:text-accent-hover transition-colors"
                      aria-label="Remove skill level filter"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {filter.designDomain && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                               bg-accent-subtle border border-accent-primary/30">
                    <span className="text-sm text-accent-primary font-medium">Domain: {filter.designDomain}</span>
                    <button
                      onClick={() => setFilter({ ...filter, designDomain: undefined })}
                      className="text-accent-primary hover:text-accent-hover transition-colors"
                      aria-label="Remove design domain filter"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Clear All Button */}
                <button
                  onClick={() => {
                    setFilter({});
                    setSearchQuery('');
                  }}
                  className="text-sm text-accent-primary hover:text-accent-hover hover:underline transition-colors font-medium"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Mobile Filters */}
            <details className="lg:hidden mb-6 bg-surface-primary rounded-lg border border-border-primary p-4">
              <summary className="font-semibold cursor-pointer">Show Filters</summary>
              <div className="mt-4">
                <GuideFilter
                  onFilterChange={setFilter}
                  selectedTool={filter.tool}
                  selectedSkillLevel={filter.skillLevel}
                  selectedDomain={filter.designDomain}
                />
              </div>
            </details>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide, index) => (
                <GuideCard key={guide.id} guide={guide} index={index} />
              ))}
            </div>

            {/* No Results */}
            {filteredGuides.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary mb-4">No guides found matching your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilter({});
                  }}
                  className="px-6 py-2 rounded-lg bg-accent-primary text-background-primary
                           font-medium hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
