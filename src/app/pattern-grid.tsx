'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import UnifiedSearchBar from '../components/ui/UnifiedSearchBar';
import FilterPills from '../components/ui/FilterPills';
import ProductFilterBar from '../components/ui/ProductFilterBar';
import IndustryFilterBar from '../components/ui/IndustryFilterBar';
import { useThemeFilter } from '../hooks/useTheme';
import { getProductLogoUrl, hasProductLogo } from '../data/product-logos';
import type { PatternSummary, Category } from '../types';
import type { Product } from '../data/utils/product-utils';
import type { Industry } from '../data/utils/industry-utils';

// Lazy-load components that use framer-motion or aren't needed at first paint
const CategoryFilterSheet = dynamic(() => import('../components/ui/CategoryFilterSheet'), { ssr: false });
const HandbookModal = dynamic(() => import('../components/lead-magnet/HandbookModal').then(mod => ({ default: mod.HandbookModal })), { ssr: false });

interface PatternGridProps {
  patterns: PatternSummary[];
  categories: Category[];
  allProducts: Product[];
  allIndustries: Industry[];
}

export default function PatternGrid({ patterns, categories, allProducts, allIndustries }: PatternGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isHandbookModalOpen, setIsHandbookModalOpen] = useState(false);
  const [showAgenticOnly, setShowAgenticOnly] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Track dark mode state
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(theme === 'dark');
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  // Get theme-aware filter for product logos
  const logoFilter = useThemeFilter('grayscale(100%)');

  const filteredPatterns = useMemo(() => {
    return patterns.filter(pattern => {
      const matchesSearch = pattern.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           pattern.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || pattern.category === selectedCategory;

      let matchesProducts = true;
      if (selectedProducts.length > 0) {
        matchesProducts = selectedProducts.some(product =>
          pattern.products.some(pp => pp.toLowerCase() === product.toLowerCase())
        );
      }

      let matchesIndustries = true;
      if (selectedIndustries.length > 0) {
        matchesIndustries = selectedIndustries.some(industry =>
          pattern.industries.some(pi => pi.toLowerCase() === industry.toLowerCase())
        );
      }

      const matchesAgentic = !showAgenticOnly || pattern.tags?.includes('agentic');

      return matchesSearch && matchesCategory && matchesProducts && matchesIndustries && matchesAgentic;
    });
  }, [patterns, searchQuery, selectedCategory, selectedProducts, selectedIndustries, showAgenticOnly]);

  return (
    <>
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
            {/* Search Bar */}
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
                <button
                  onClick={() => setShowAgenticOnly(!showAgenticOnly)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    showAgenticOnly
                      ? 'bg-accent-primary text-background-primary border-accent-primary'
                      : 'bg-surface-primary text-text-secondary border-primary hover:border-accent-primary hover:text-accent-primary'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Agentic
                </button>
              </div>
            </div>

            {/* Patterns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="transition-transform duration-200 ease-out hover:-translate-y-1.5"
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
                      <div className="border-t border-gray-200 dark:border-gray-700 mb-6"></div>

                      {/* Category */}
                      <div className="flex items-center gap-2 mb-6">
                        <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-text-secondary">
                          {pattern.category}
                        </span>
                      </div>

                      {/* Used By Logos */}
                      {pattern.products.filter(p => p !== 'Superhuman' && hasProductLogo(p)).length > 0 && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-text-secondary font-medium">Used by:</span>
                          <div className="flex items-center gap-2">
                            {pattern.products.filter(p => p !== 'Superhuman').slice(0, 3).map((product) => {
                              const logoUrl = getProductLogoUrl(product);
                              const hasLogo = hasProductLogo(product);

                              if (!hasLogo) return null;

                              return (
                                <div
                                  key={product}
                                  className="relative group/logo"
                                >
                                  <img
                                    src={logoUrl}
                                    alt={product}
                                    width={16}
                                    height={16}
                                    loading="lazy"
                                    className="h-4 w-4 transition-all duration-300"
                                    style={{
                                      filter: logoFilter,
                                    }}
                                  />
                                  <div
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover/logo:opacity-100 transition-opacity pointer-events-none z-50"
                                  >
                                    {product}
                                  </div>
                                </div>
                              );
                            })}
                            {pattern.products.filter(p => p !== 'Superhuman' && hasProductLogo(p)).length > 3 && (
                              <span className="text-xs text-text-secondary font-medium">
                                +{pattern.products.filter(p => p !== 'Superhuman' && hasProductLogo(p)).length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
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

      {/* Handbook Modal */}
      <HandbookModal
        isOpen={isHandbookModalOpen}
        onClose={() => setIsHandbookModalOpen(false)}
      />
    </>
  );
}
