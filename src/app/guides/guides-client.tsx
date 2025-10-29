'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import CourseCard from '@/components/ui/CourseCard';
import GuideFilter from '@/components/ui/GuideFilter';
import { guides, filterGuides, searchGuides } from '@/data/guides';
import { GuideFilter as GuideFilterType } from '@/types';
import { useGuideProgress } from '@/hooks/useGuideProgress';

export default function GuidesClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<GuideFilterType>({});
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'alphabetical' | 'progress' | 'readtime'>('newest');
  const { getProgressStats, getLessonProgress, getGuideStatus } = useGuideProgress();

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

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((guide) => {
        const totalLessons = guide.lessons?.length || guide.lessonCount || 0;
        if (totalLessons === 0) return statusFilter === 'not-started';
        const status = getGuideStatus(guide.id, totalLessons);
        return status === statusFilter;
      });
    }

    // Apply sorting
    const sortedResult = [...result];
    switch (sortBy) {
      case 'alphabetical':
        sortedResult.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'progress':
        sortedResult.sort((a, b) => {
          const totalA = a.lessons?.length || a.lessonCount || 0;
          const totalB = b.lessons?.length || b.lessonCount || 0;
          const progressA = totalA > 0 ? getLessonProgress(a.id, totalA).percentage : 0;
          const progressB = totalB > 0 ? getLessonProgress(b.id, totalB).percentage : 0;
          return progressB - progressA;
        });
        break;
      case 'readtime':
        sortedResult.sort((a, b) => a.readTime - b.readTime);
        break;
      case 'newest':
      default:
        // Keep original order
        break;
    }

    return sortedResult;
  }, [searchQuery, filter, statusFilter, sortBy, getLessonProgress, getGuideStatus]);

  const stats = getProgressStats(guides.length);

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
                {guides.length} AI Tool Learning Paths
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                Work in Progress
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Learn to Design with AI Tools
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-8">
              Master the most powerful AI-assisted development tools with practical, comprehensive learning paths designed for designers.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses by tool, use case, or skill level"
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
            <div className="bg-surface-primary rounded-xl p-6 border border-border-primary sticky top-20 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Filters</h3>
                <GuideFilter
                  onFilterChange={setFilter}
                  selectedTool={filter.tool}
                  selectedSkillLevel={filter.skillLevel}
                  selectedDomain={filter.designDomain}
                />
              </div>

              {/* Status Filter */}
              <div className="border-t border-border-primary pt-6">
                <h4 className="font-semibold text-base mb-3">Status</h4>
                <div className="space-y-2">
                  {[
                    { value: 'all' as const, label: 'All Courses' },
                    { value: 'not-started' as const, label: 'Not Started' },
                    { value: 'in-progress' as const, label: 'In Progress' },
                    { value: 'completed' as const, label: 'Completed' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={statusFilter === option.value}
                        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                        className="w-4 h-4 rounded border border-border-primary cursor-pointer"
                      />
                      <span className="text-sm text-text-secondary">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="border-t border-border-primary pt-6">
                <h4 className="font-semibold text-base mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border-primary
                           text-text-primary text-sm focus:outline-none focus:border-accent-primary
                           transition-colors cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="progress">Most Progress</option>
                  <option value="readtime">Shortest Duration</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Courses Grid */}
          <div className="flex-1">
            {/* Active Filters Display and Clear */}
            {(Object.values(filter).some((v) => v !== undefined) || searchQuery || statusFilter !== 'all' || sortBy !== 'newest') && (
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

                {statusFilter !== 'all' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                               bg-accent-subtle border border-accent-primary/30">
                    <span className="text-sm text-accent-primary font-medium">Status: {statusFilter}</span>
                    <button
                      onClick={() => setStatusFilter('all')}
                      className="text-accent-primary hover:text-accent-hover transition-colors"
                      aria-label="Remove status filter"
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

                {sortBy !== 'newest' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                               bg-accent-subtle border border-accent-primary/30">
                    <span className="text-sm text-accent-primary font-medium">Sort: {sortBy}</span>
                    <button
                      onClick={() => setSortBy('newest')}
                      className="text-accent-primary hover:text-accent-hover transition-colors"
                      aria-label="Reset sort order"
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
                    setStatusFilter('all');
                    setSortBy('newest');
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

            {/* Courses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide, index) => (
                <CourseCard key={guide.id} course={guide as any} index={index} />
              ))}
            </div>

            {/* No Results */}
            {filteredGuides.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary mb-4">No courses found matching your search.</p>
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
