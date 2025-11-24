'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/ui/ScrollToTop';
import UnifiedSearchBar from '../components/ui/UnifiedSearchBar';
import CompanyLogoCarousel from '../components/ui/CompanyLogoCarousel';
import FilterPills from '../components/ui/FilterPills';
import CategoryFilterSheet from '../components/ui/CategoryFilterSheet';
import ProductFilterBar from '../components/ui/ProductFilterBar';
import { HandbookModal } from '../components/lead-magnet/HandbookModal';
import { useThemeFilter } from '../hooks/useTheme';
import patterns from '../data/patterns';
import categories from '../data/categories';
import { companyLogos } from '../data/company-logos';
import { getAllProducts, filterPatternsByProducts, getProductsForPattern } from '../data/utils/product-utils';
import { getAllIndustries, getIndustriesForPattern } from '../data/utils/industry-utils';
import { getProductLogoUrl, hasProductLogo } from '../data/product-logos';
import IndustryFilterBar from '../components/ui/IndustryFilterBar';

export default function HomeClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isHandbookModalOpen, setIsHandbookModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Track dark mode state
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(theme === 'dark');
    };

    // Check initial theme
    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  // Get theme-aware filter for product logos
  const logoFilter = useThemeFilter('grayscale(100%)');

  // Get all available products
  const allProducts = useMemo(() => getAllProducts(patterns), []);

  // Get all available industries
  const allIndustries = useMemo(() => getAllIndustries(patterns), []);

  const filteredPatterns = useMemo(() => {
    return patterns.filter(pattern => {
      const matchesSearch = pattern.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           pattern.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || pattern.category === selectedCategory;

      // Filter by selected products
      let matchesProducts = true;
      if (selectedProducts.length > 0) {
        const patternProducts = getProductsForPattern(pattern);
        matchesProducts = selectedProducts.some(product =>
          patternProducts.some(pp => pp.toLowerCase() === product.toLowerCase())
        );
      }

      // Filter by selected industries
      let matchesIndustries = true;
      if (selectedIndustries.length > 0) {
        const patternIndustries = getIndustriesForPattern(pattern);
        matchesIndustries = selectedIndustries.some(industry =>
          patternIndustries.some(pi => pi.toLowerCase() === industry.toLowerCase())
        );
      }

      return matchesSearch && matchesCategory && matchesProducts && matchesIndustries;
    });
  }, [searchQuery, selectedCategory, selectedProducts, selectedIndustries]);

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Info Chip */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="px-4 py-2 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {patterns.length} AI Patterns
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6">
              Discover AI Design<br />Inspiration & Patterns
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-10">
              Real examples. Best practices.
            </p>

            {/* Company Logo Carousel - Social Proof */}
            <div className="mb-12">
              <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-tight mb-3">
                Patterns used by leading companies
              </p>
              <CompanyLogoCarousel companies={companyLogos} duration={30} size="sm" gap="lg" />
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={() => setIsHandbookModalOpen(true)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-medium rounded-full hover:bg-gray-900 dark:hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <path d="M15.645 26.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C8.688 21.36 6.25 18.174 6.25 14.25 6.25 11.322 8.714 9 11.688 9A5.5 5.5 0 0116 11.052 5.5 5.5 0 0120.313 9c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" fill="currentColor" />
                <path d="M16 16l1-2.2 1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z" className="fill-white dark:fill-black" />
              </svg>
              Get 6 Essential AI Design Patterns
            </motion.button>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div id="patterns" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-surface-primary dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-card sticky top-24">
              <h3
                className="font-semibold text-lg mb-4"
                style={{ color: isDarkMode ? '#ffffff' : '#111827' }}
              >
                Categories
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedCategory('All Categories')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      selectedCategory === 'All Categories'
                        ? 'bg-white font-semibold shadow-sm'
                        : 'hover:bg-white'
                    }`}
                    style={{
                      color: selectedCategory === 'All Categories'
                        ? '#000000'
                        : isDarkMode ? '#ffffff' : '#374151'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCategory !== 'All Categories') {
                        e.currentTarget.style.color = '#000000';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== 'All Categories') {
                        e.currentTarget.style.color = isDarkMode ? '#ffffff' : '#374151';
                      }
                    }}
                  >
                    All Patterns
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.title)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                        selectedCategory === cat.title
                          ? 'bg-white font-semibold shadow-sm'
                          : 'hover:bg-white'
                      }`}
                      style={{
                        color: selectedCategory === cat.title
                          ? '#000000'
                          : isDarkMode ? '#ffffff' : '#374151'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCategory !== cat.title) {
                          e.currentTarget.style.color = '#000000';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCategory !== cat.title) {
                          e.currentTarget.style.color = isDarkMode ? '#ffffff' : '#374151';
                        }
                      }}
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
            {/* Search Bar - Above filters with card styling */}
            <div className="mb-6 bg-surface-primary dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-card">
              <UnifiedSearchBar
                placeholder="Search any AI Pattern you need"
                value={searchQuery}
                onChange={setSearchQuery}
                size="sm"
              />
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <FilterPills
                selectedCategory={selectedCategory}
                onFilterClick={() => setIsFilterSheetOpen(true)}
              />
            </div>

            {/* Filter Bars */}
            <div className="bg-surface-primary dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-card mb-8">
              <div className="flex flex-wrap items-start gap-3">
                <ProductFilterBar
                  products={allProducts}
                  selectedProducts={selectedProducts}
                  onProductsChange={setSelectedProducts}
                />
                <IndustryFilterBar
                  industries={allIndustries}
                  selectedIndustries={selectedIndustries}
                  onIndustriesChange={setSelectedIndustries}
                />
              </div>
            </div>

            {/* Patterns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatterns.map((pattern, index) => (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <Link
                    href={`/patterns/${pattern.slug}`}
                    className="block group"
                  >
                    <div className="bg-surface-primary rounded-2xl p-8 border border-gray-200 shadow-card
                                  hover:shadow-card-hover hover:border-gray-200 transition-all duration-300 h-full
                                  flex flex-col">
                      {/* Title */}
                      <h3 className="text-xl font-medium text-text-primary mb-4 transition-colors">
                        {pattern.title}
                      </h3>

                      {/* Description */}
                      <p className="text-base text-text-secondary leading-relaxed line-clamp-3 flex-grow mb-8">
                        {pattern.description}
                      </p>

                      {/* Divider */}
                      <div className="border-t border-gray-300 mb-6"></div>

                      {/* Top Metadata Row - Category & Status */}
                      <div className="flex items-center gap-2 mb-6">
                        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                          {pattern.category}
                        </span>
                        {pattern.status === 'in-progress' && (
                          <span
                            className="px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 cursor-help"
                            title="Work in Progress: This pattern is not fully documented yet. Documentation and code examples are being refined."
                            aria-label="Work in Progress pattern"
                          >
                            WIP
                          </span>
                        )}
                      </div>

                      {/* Used By Logos Section */}
                      {getProductsForPattern(pattern).filter(p => p !== 'Superhuman' && hasProductLogo(p)).length > 0 && (
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-text-secondary font-medium">Used by:</span>
                          <div className="flex items-center gap-2">
                            {getProductsForPattern(pattern).filter(p => p !== 'Superhuman').slice(0, 3).map((product) => {
                              const logoUrl = getProductLogoUrl(product);
                              const hasLogo = hasProductLogo(product);

                              if (!hasLogo) return null;

                              return (
                                <div
                                  key={product}
                                  className="relative cursor-pointer peer"
                                  onMouseEnter={(e) => {
                                    const tooltip = e.currentTarget.querySelector('[data-tooltip]') as HTMLElement;
                                    if (tooltip) tooltip.style.opacity = '1';
                                  }}
                                  onMouseLeave={(e) => {
                                    const tooltip = e.currentTarget.querySelector('[data-tooltip]') as HTMLElement;
                                    if (tooltip) tooltip.style.opacity = '0';
                                  }}
                                >
                                  <img
                                    src={logoUrl}
                                    alt={product}
                                    className="h-4 w-4 transition-all duration-300"
                                    style={{
                                      filter: logoFilter,
                                    }}
                                  />
                                  {/* Tooltip */}
                                  <div
                                    data-tooltip
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded whitespace-nowrap transition-opacity pointer-events-none z-50"
                                    style={{ opacity: '0' }}
                                  >
                                    {product}
                                  </div>
                                </div>
                              );
                            })}
                            {getProductsForPattern(pattern).filter(p => p !== 'Superhuman' && hasProductLogo(p)).length > 3 && (
                              <span className="text-xs text-text-secondary font-medium">
                                +{getProductsForPattern(pattern).filter(p => p !== 'Superhuman' && hasProductLogo(p)).length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
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

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Mobile Category Filter Sheet */}
      <CategoryFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        products={allProducts}
        selectedProducts={selectedProducts}
        onProductsSelect={setSelectedProducts}
        industries={allIndustries}
        selectedIndustries={selectedIndustries}
        onIndustriesSelect={setSelectedIndustries}
      />

      {/* Footer */}
      <Footer />

      {/* Handbook Modal */}
      <HandbookModal
        isOpen={isHandbookModalOpen}
        onClose={() => setIsHandbookModalOpen(false)}
      />
    </main>
  );
}
