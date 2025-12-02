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
import { InlineNewsletterSignup } from '../components/newsletter/InlineNewsletterSignup';
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

      {/* Hero Section - Minimal & Spacious with neutral gray background + grain texture */}
      <section className="pt-16 md:pt-20 pb-16 md:pb-20 bg-[#F0F1F5] dark:bg-gray-900 bg-grain">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Heading - Larger & More Prominent */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-9" style={{ color: 'var(--text-hero)' }}>
              Discover AI Design<br />Inspiration & Patterns
            </h1>

            {/* Subheading - More Space */}
            <p className="text-2xl md:text-3xl text-text-secondary mb-12">
              Real examples. Best practices.
            </p>

            {/* Company Logo Carousel - Social Proof Before CTA */}
            <div className="mb-16">
              <p className="text-[9px] font-bold text-text-secondary uppercase tracking-tight mb-4">
                Patterns used by leading companies
              </p>
              <CompanyLogoCarousel companies={companyLogos} size="sm" gap="lg" />
            </div>

            {/* Inline Newsletter Signup - High Converting */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <InlineNewsletterSignup variant="hero" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div id="patterns" className="max-w-7xl mx-auto px-6 pt-12 md:pt-16 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-surface-primary dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-card sticky top-24">
              <h3
                className="font-semibold text-xl mb-4"
                style={{ color: isDarkMode ? '#ffffff' : '#162036' }}
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
                      <h3 className="text-lg font-semibold text-text-primary mb-4 transition-colors">
                        {pattern.title}
                      </h3>

                      {/* Description */}
                      <p className="text-lg text-text-secondary leading-relaxed line-clamp-3 flex-grow mb-8">
                        {pattern.description}
                      </p>

                      {/* Divider */}
                      <div className="border-t border-gray-300 mb-6"></div>

                      {/* Top Metadata Row - Category & Status */}
                      <div className="flex items-center gap-2 mb-6">
                        <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                          {pattern.category}
                        </span>
                        {pattern.status === 'in-progress' && (
                          <span
                            className="px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 cursor-help"
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
                          <span className="text-sm text-text-secondary font-medium">Used by:</span>
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
