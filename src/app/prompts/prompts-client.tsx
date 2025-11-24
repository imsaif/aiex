'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import UnifiedSearchBar from '@/components/ui/UnifiedSearchBar';
import PromptCard from '@/components/ui/PromptCard';
import CategoryFilterSheet from '@/components/ui/CategoryFilterSheet';
import FilterPills from '@/components/ui/FilterPills';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { getPatternsWithPrompts, getPromptsByCategory } from '@/data/utils/prompt-utils';
import categories from '@/data/categories';

export default function PromptsClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const allPrompts = useMemo(() => getPatternsWithPrompts(), []);

  const filteredPrompts = useMemo(() => {
    let results = getPromptsByCategory(selectedCategory);

    if (searchQuery) {
      results = results.filter(pattern =>
        pattern.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pattern.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pattern.content.figmaPrompt?.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return results;
  }, [searchQuery, selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {allPrompts.length} Figma Make Prompts
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-text-primary">
              Figma Make Prompts for
              <br />
              AI Design Patterns
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-8">
              Copy-paste ready prompts. Customization tips included.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-surface-primary rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-card sticky top-24">
              <h3 className="font-semibold text-lg mb-4 text-text-primary">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedCategory('All Categories')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                      selectedCategory === 'All Categories'
                        ? 'bg-white dark:bg-gray-800 text-black dark:text-white font-semibold shadow-sm'
                        : 'text-text-secondary hover:bg-white dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    All Prompts ({allPrompts.length})
                  </button>
                </li>
                {categories.map(cat => {
                  const count = allPrompts.filter(p => p.category === cat.title).length;
                  if (count === 0) return null;

                  return (
                    <li key={cat.id}>
                      <button
                        onClick={() => setSelectedCategory(cat.title)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                          selectedCategory === cat.title
                            ? 'bg-white dark:bg-gray-800 text-black dark:text-white font-semibold shadow-sm'
                            : 'text-text-secondary hover:bg-white dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'
                        }`}
                      >
                        {cat.title} ({count})
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Prompts Grid */}
          <div className="flex-1">
            {/* Search */}
            <div className="mb-6 bg-surface-primary rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-card">
              <UnifiedSearchBar
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={setSearchQuery}
                size="sm"
              />
            </div>

            {/* Mobile Filter Pills */}
            <div className="lg:hidden mb-6">
              <FilterPills
                selectedCategory={selectedCategory}
                onFilterClick={() => setIsFilterSheetOpen(true)}
              />
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-text-secondary">
                {filteredPrompts.length} {filteredPrompts.length === 1 ? 'prompt' : 'prompts'}
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            {/* Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPrompts.map((pattern, index) => (
                <motion.div key={pattern.id} variants={itemVariants}>
                  <PromptCard pattern={pattern} index={index} />
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredPrompts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary text-lg mb-2">No prompts found</p>
                {searchQuery && (
                  <p className="text-text-tertiary text-sm">
                    Try adjusting your search or filters
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <CategoryFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        categories={[
          { id: 'all', title: 'All Categories' },
          ...categories.filter(cat => allPrompts.some(p => p.category === cat.title)),
        ]}
        selectedCategory={selectedCategory}
        onCategorySelect={(category) => {
          setSelectedCategory(category);
          setIsFilterSheetOpen(false);
        }}
      />

      <Footer />
      <ScrollToTop />
    </main>
  );
}
