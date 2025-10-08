'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import ScrollToTop from '../components/ui/ScrollToTop';
import FilterPills from '../components/ui/FilterPills';
import CategoryFilterSheet from '../components/ui/CategoryFilterSheet';
import patterns from '../data/patterns';
import categories from '../data/categories';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const filteredPatterns = patterns.filter(pattern => {
    const matchesSearch = pattern.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pattern.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || pattern.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                {patterns.length} AI Patterns
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover AI Design<br />Inspiration & Patterns
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-8">
              Real examples. Best practices.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search any AI Pattern you need"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pr-12 rounded-lg bg-surface-primary border border-gray-200 dark:border-gray-700
                           text-text-primary placeholder-text-secondary focus:outline-none focus:border-blue-500
                           transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-md
                                 hover:bg-gray-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 pb-24">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <FilterPills
            selectedCategory={selectedCategory}
            onFilterClick={() => setIsFilterSheetOpen(true)}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-surface-primary rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
              <h3 className="font-semibold text-lg mb-4">All Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedCategory('All Categories')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === 'All Categories'
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    All Patterns
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.title)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat.title
                          ? 'bg-black text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {cat.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Patterns Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatterns.map((pattern, index) => (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/patterns/${pattern.slug}`}
                    className="block group"
                  >
                    <div className="bg-surface-primary rounded-xl p-6 border border-gray-200 dark:border-gray-700
                                  hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 h-full
                                  flex flex-col">
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-text-primary mb-3 group-hover:text-blue-600 transition-colors">
                        {pattern.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-text-secondary line-clamp-3 flex-grow mb-4">
                        {pattern.description}
                      </p>

                      {/* Chips */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-text-secondary">
                          {pattern.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {filteredPatterns.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary">No patterns found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 mt-12 border-t border-border-primary">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 text-center">
          <p className="text-sm text-text-secondary">
            Built with ☕ by Imran ·
            <a href="https://www.imranaidesign.com/" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary ml-1">Portfolio</a> ·
            <a href="https://github.com/imsaif" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary ml-1">GitHub</a> ·
            <a href="https://www.linkedin.com/in/imsaif/" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary ml-1">LinkedIn</a>
          </p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Mobile Category Filter Sheet */}
      <CategoryFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
    </main>
  );
}
