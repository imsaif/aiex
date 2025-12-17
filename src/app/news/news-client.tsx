'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import UnifiedSearchBar from '@/components/ui/UnifiedSearchBar';
import NewsletterCard from '@/components/ui/NewsletterCard';
import TagFilter from '@/components/ui/TagFilter';
import CategoryFilterSheet from '@/components/ui/CategoryFilterSheet';
import FilterPills from '@/components/ui/FilterPills';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { Newsletter, NewsletterTag } from '@/types';

interface NewsClientProps {
  initialNewsletters: Newsletter[];
  availableTags: NewsletterTag[];
}

export default function NewsClient({ initialNewsletters, availableTags }: NewsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const filteredNewsletters = useMemo(() => {
    let results = initialNewsletters;

    // Filter by tags
    if (selectedTags.length > 0) {
      results = results.filter((newsletter) =>
        newsletter.tags.some((tag) => selectedTags.includes(tag.slug))
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (newsletter) =>
          newsletter.title.toLowerCase().includes(query) ||
          newsletter.summary.toLowerCase().includes(query) ||
          newsletter.tags.some((tag) => tag.name.toLowerCase().includes(query))
      );
    }

    return results;
  }, [initialNewsletters, selectedTags, searchQuery]);

  const handleTagToggle = (tagSlug: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagSlug) ? prev.filter((t) => t !== tagSlug) : [...prev, tagSlug]
    );
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // Get selected filter label for mobile
  const getFilterLabel = () => {
    if (selectedTags.length === 0) return 'All Tags';
    if (selectedTags.length === 1) {
      const tag = availableTags.find((t) => t.slug === selectedTags[0]);
      return tag?.name || 'All Tags';
    }
    return `${selectedTags.length} tags selected`;
  };

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-12 md:pt-16 pb-12 md:pb-16 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {initialNewsletters.length} {initialNewsletters.length === 1 ? 'Issue' : 'Issues'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-text-primary">
              Newsletter Archive
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-8">
              AI design patterns, UX insights, and industry updates.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-16 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-surface-primary rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-card sticky top-24">
              <h3 className="font-semibold text-lg mb-4 text-text-primary">Filter by Tag</h3>
              <TagFilter
                tags={availableTags}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
                onClearAll={handleClearAllTags}
              />
            </div>
          </aside>

          {/* Newsletter Grid */}
          <div className="flex-1">
            {/* Search */}
            <div className="mb-6 bg-surface-primary rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-card">
              <UnifiedSearchBar
                placeholder="Search newsletters..."
                value={searchQuery}
                onChange={setSearchQuery}
                size="sm"
              />
            </div>

            {/* Mobile Filter Pills */}
            <div className="lg:hidden mb-6">
              <FilterPills
                selectedCategory={getFilterLabel()}
                onFilterClick={() => setIsFilterSheetOpen(true)}
              />
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-text-secondary">
                {filteredNewsletters.length}{' '}
                {filteredNewsletters.length === 1 ? 'issue' : 'issues'}
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            {/* Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {filteredNewsletters.map((newsletter, index) => (
                <motion.div key={newsletter.id} variants={itemVariants}>
                  <NewsletterCard newsletter={newsletter} index={index} />
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredNewsletters.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary text-lg mb-2">No newsletters found</p>
                <p className="text-text-tertiary text-sm">
                  Try adjusting your search or filters
                </p>
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
          { id: 'all', title: 'All Tags' },
          ...availableTags.map((tag) => ({ id: tag.slug, title: tag.name })),
        ]}
        selectedCategory={selectedTags.length === 1 ? availableTags.find((t) => t.slug === selectedTags[0])?.name || 'All Tags' : 'All Tags'}
        onCategorySelect={(category) => {
          if (category === 'All Tags') {
            setSelectedTags([]);
          } else {
            const tag = availableTags.find((t) => t.name === category);
            if (tag) {
              setSelectedTags([tag.slug]);
            }
          }
          setIsFilterSheetOpen(false);
        }}
      />

      <Footer />
      <ScrollToTop />
    </main>
  );
}
