'use client';

import { useState, useMemo } from 'react';
import BottomSheet from './BottomSheet';
import { Product } from '../../data/utils/product-utils';
import { Industry } from '../../data/utils/industry-utils';

interface CategoryFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ id: string; title: string }>;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  products?: Product[];
  selectedProducts?: string[];
  onProductsSelect?: (products: string[]) => void;
  industries?: Industry[];
  selectedIndustries?: string[];
  onIndustriesSelect?: (industries: string[]) => void;
}

const CategoryFilterSheet: React.FC<CategoryFilterSheetProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategorySelect,
  products = [],
  selectedProducts = [],
  onProductsSelect,
  industries = [],
  selectedIndustries = [],
  onIndustriesSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'products' | 'industries'>('categories');

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;

    return categories.filter(cat =>
      cat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;

    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Filter industries based on search
  const filteredIndustries = useMemo(() => {
    if (!searchQuery) return industries;

    return industries.filter(industry =>
      industry.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [industries, searchQuery]);

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category);
    onClose();
    setSearchQuery(''); // Reset search when closing
  };

  const handleProductToggle = (productName: string) => {
    if (!onProductsSelect) return;

    if (selectedProducts.includes(productName)) {
      onProductsSelect(selectedProducts.filter(p => p !== productName));
    } else {
      onProductsSelect([...selectedProducts, productName]);
    }
  };

  const handleIndustryToggle = (industryName: string) => {
    if (!onIndustriesSelect) return;

    if (selectedIndustries.includes(industryName)) {
      onIndustriesSelect(selectedIndustries.filter(i => i !== industryName));
    } else {
      onIndustriesSelect([...selectedIndustries, industryName]);
    }
  };

  const handleReset = () => {
    onCategorySelect('All Categories');
    if (onProductsSelect) {
      onProductsSelect([]);
    }
    if (onIndustriesSelect) {
      onIndustriesSelect([]);
    }
    onClose();
    setSearchQuery('');
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} height="75vh">
      <div className="flex flex-col h-full">
        {/* Tabs */}
        {(products.length > 0 || industries.length > 0) && (
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex">
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 py-3 text-center font-medium transition-colors text-sm ${
                activeTab === 'categories'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Categories
            </button>
            {products.length > 0 && (
              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 py-3 text-center font-medium transition-colors text-sm ${
                  activeTab === 'products'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Products
              </button>
            )}
            {industries.length > 0 && (
              <button
                onClick={() => setActiveTab('industries')}
                className={`flex-1 py-3 text-center font-medium transition-colors text-sm ${
                  activeTab === 'industries'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Industries
              </button>
            )}
          </div>
        )}

        {/* Search Input */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 pb-4 pt-2">
          <div className="relative">
            <input
              type="text"
              placeholder={
                activeTab === 'categories'
                  ? 'Search categories...'
                  : activeTab === 'products'
                  ? 'Search products...'
                  : 'Search industries...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-100 dark:bg-gray-800
                       border border-gray-200 dark:border-gray-700
                       text-text-primary placeholder-text-secondary
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition-colors"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'categories' && (
            <>
              {/* All Categories Option */}
              <button
                onClick={() => handleCategoryClick('All Categories')}
                className={`w-full text-left px-4 py-4 flex items-center justify-between
                         transition-colors hover:bg-gray-50 dark:hover:bg-gray-700
                         ${selectedCategory === 'All Categories' ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600' : ''}`}
              >
                <span className="text-base font-medium text-text-primary">
                  All Categories
                </span>
                {selectedCategory === 'All Categories' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-blue-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              {/* Category Options */}
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.title)}
                  className={`w-full text-left px-4 py-4 flex items-center justify-between
                           transition-colors hover:bg-gray-50 dark:hover:bg-gray-700
                           border-t border-gray-100 dark:border-gray-800
                           ${selectedCategory === category.title ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600' : ''}`}
                >
                  <span className="text-base text-text-primary">
                    {category.title}
                  </span>
                  {selectedCategory === category.title && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-blue-600"
                    >
                      <path
                        fillRule="evenodd"
                        d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}

              {/* No Results */}
              {filteredCategories.length === 0 && (
                <div className="px-4 py-8 text-center text-text-secondary">
                  No categories found
                </div>
              )}
            </>
          )}

          {activeTab === 'products' && (
            <>
              {/* Product Options */}
              {filteredProducts.map((product) => (
                <label
                  key={product.name}
                  className="w-full text-left px-4 py-4 flex items-center gap-3
                           transition-colors hover:bg-gray-50 dark:hover:bg-gray-800
                           border-t border-gray-100 dark:border-gray-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.name)}
                    onChange={() => handleProductToggle(product.name)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                  />
                  <div className="flex-grow">
                    <span className="text-base text-text-primary">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {product.count}
                  </span>
                </label>
              ))}

              {/* No Results */}
              {filteredProducts.length === 0 && (
                <div className="px-4 py-8 text-center text-text-secondary">
                  No products found
                </div>
              )}
            </>
          )}

          {activeTab === 'industries' && (
            <>
              {/* Industry Options */}
              {filteredIndustries.map((industry) => (
                <label
                  key={industry.name}
                  className="w-full text-left px-4 py-4 flex items-center gap-3
                           transition-colors hover:bg-gray-50 dark:hover:bg-gray-800
                           border-t border-gray-100 dark:border-gray-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedIndustries.includes(industry.name)}
                    onChange={() => handleIndustryToggle(industry.name)}
                    className="w-5 h-5 rounded border-gray-300 text-green-600"
                  />
                  <div className="flex-grow">
                    <span className="text-base text-text-primary">
                      {industry.name}
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {industry.count}
                  </span>
                </label>
              ))}

              {/* No Results */}
              {filteredIndustries.length === 0 && (
                <div className="px-4 py-8 text-center text-text-secondary">
                  No industries found
                </div>
              )}
            </>
          )}
        </div>

        {/* Reset Button */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleReset}
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black
                     font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100
                     transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default CategoryFilterSheet;
