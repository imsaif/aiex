'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import CourseCard from '@/components/ui/CourseCard';
import GuideFilter from '@/components/ui/GuideFilter';
import { guides, getAllTools, getAllSkillLevels, searchGuides } from '@/data/guides';
import { GuideFilter as GuideFilterType } from '@/types';

export default function GuidesClient() {
  const [filter, setFilter] = useState<GuideFilterType>({});
  const [sortBy, setSortBy] = useState<'newest' | 'alphabetical' | 'progress' | 'readtime'>('newest');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tools = useMemo(() => getAllTools(), []);
  const skillLevels = useMemo(() => getAllSkillLevels(), []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredGuides = useMemo(() => {
    let result = guides;

    // Apply filters
    if (Object.values(filter).some((v) => v !== undefined)) {
      result = result.filter((guide) => {
        if (filter.tool && guide.tool !== filter.tool) return false;
        if (filter.skillLevel && guide.skillLevel !== filter.skillLevel) return false;
        return true;
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
          // Note: We could add progress sorting later if needed
          return 0;
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
  }, [filter, sortBy]);

  const handleToolChange = (tool: string) => {
    setFilter({
      tool: tool === 'all' ? undefined : (tool as any),
      skillLevel: filter.skillLevel,
    });
  };

  const handleSkillLevelChange = (level: string) => {
    setFilter({
      tool: filter.tool,
      skillLevel: level === 'all' ? undefined : (level as any),
    });
  };

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero Section - with background + grain */}
      <section className="pt-12 md:pt-16 pb-12 md:pb-16 bg-[#F0F1F5] dark:bg-gray-900 bg-grain">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Info Chip */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {guides.length} AI Tool Learning Paths
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6">
              Master AI Design Tools
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-8">
              Practical tutorials. Complete learning paths.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div id="guides" className="max-w-7xl mx-auto px-6 pt-12 md:pt-16 pb-24">
        {/* Top Filter Bar */}
        <div ref={dropdownRef} className="mb-6 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Tool Filter Dropdown */}
          <div className="relative flex-1 lg:flex-none lg:w-48">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'tool' ? null : 'tool')}
              className="w-full flex items-center justify-between px-4 py-2 rounded-full border border-gray-200
                       bg-surface-primary text-text-primary hover:bg-surface-secondary
                       transition-all text-sm font-medium hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>{filter.tool ? `Tool: ${filter.tool}` : 'All Tools'}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`w-4 h-4 transition-transform ${openDropdown === 'tool' ? 'rotate-180' : ''}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7-7m0 0l-7 7m7-7v12" />
              </svg>
            </button>

            {openDropdown === 'tool' && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200
                            rounded-lg shadow-lg z-50">
                <button
                  onClick={() => handleToolChange('all')}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors
                             ${filter.tool ? 'text-text-secondary hover:bg-accent-subtle' : 'bg-accent-subtle text-accent-primary font-medium'}`}
                >
                  All Tools
                </button>
                {tools.map((tool) => (
                  <button
                    key={tool}
                    onClick={() => handleToolChange(tool)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors
                               ${filter.tool === tool ? 'bg-accent-subtle text-accent-primary font-medium' : 'text-text-secondary hover:bg-accent-subtle'}`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Skill Level Filter Dropdown */}
          <div className="relative flex-1 lg:flex-none lg:w-48">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'level' ? null : 'level')}
              className="w-full flex items-center justify-between px-4 py-2 rounded-full border border-gray-200
                       bg-surface-primary text-text-primary hover:bg-surface-secondary
                       transition-all text-sm font-medium hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>{filter.skillLevel ? `Level: ${filter.skillLevel}` : 'All Levels'}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`w-4 h-4 transition-transform ${openDropdown === 'level' ? 'rotate-180' : ''}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7-7m0 0l-7 7m7-7v12" />
              </svg>
            </button>

            {openDropdown === 'level' && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200
                            rounded-lg shadow-lg z-50">
                <button
                  onClick={() => handleSkillLevelChange('all')}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors
                             ${filter.skillLevel ? 'text-text-secondary hover:bg-accent-subtle' : 'bg-accent-subtle text-accent-primary font-medium'}`}
                >
                  All Levels
                </button>
                {skillLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => handleSkillLevelChange(level)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors
                               ${filter.skillLevel === level ? 'bg-accent-subtle text-accent-primary font-medium' : 'text-text-secondary hover:bg-accent-subtle'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-1 lg:flex-none lg:w-48 lg:ml-auto">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
              className="w-full flex items-center justify-between px-4 py-2 rounded-full border border-gray-200
                       bg-surface-primary text-text-primary hover:bg-surface-secondary
                       transition-all text-sm font-medium hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'alphabetical' ? 'A-Z' : sortBy === 'progress' ? 'Progress' : 'Duration'}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`w-4 h-4 transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7-7m0 0l-7 7m7-7v12" />
              </svg>
            </button>

            {openDropdown === 'sort' && (
              <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200
                            rounded-lg shadow-lg z-50 w-56">
                {[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'alphabetical', label: 'Alphabetical' },
                  { value: 'progress', label: 'Most Progress' },
                  { value: 'readtime', label: 'Shortest Duration' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value as typeof sortBy);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors
                               ${sortBy === option.value ? 'bg-accent-subtle text-accent-primary font-medium' : 'text-text-secondary hover:bg-accent-subtle'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Display and Clear */}
        {(Object.values(filter).some((v) => v !== undefined) || sortBy !== 'newest') && (
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
                setSortBy('newest');
              }}
              className="text-sm text-accent-primary hover:text-accent-hover hover:underline transition-colors font-medium"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide, index) => (
            <CourseCard key={guide.id} course={guide as any} index={index} />
          ))}
        </div>

        {/* No Results */}
        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-4">No courses found matching your filters.</p>
            <button
              onClick={() => {
                setFilter({});
              }}
              className="px-6 py-2 rounded-full bg-accent-primary text-white
                       font-medium hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
