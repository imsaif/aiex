'use client';

import { useState, useRef, useEffect } from 'react';
import { Product } from '../../data/utils/product-utils';

interface ProductFilterBarProps {
  products: Product[];
  selectedProducts: string[];
  onProductsChange: (products: string[]) => void;
}

const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  products,
  selectedProducts,
  onProductsChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductToggle = (productName: string) => {
    if (selectedProducts.includes(productName)) {
      onProductsChange(selectedProducts.filter(p => p !== productName));
    } else {
      onProductsChange([...selectedProducts, productName]);
    }
  };

  const handleRemoveProduct = (productName: string) => {
    onProductsChange(selectedProducts.filter(p => p !== productName));
  };

  const handleClearAll = () => {
    onProductsChange([]);
    setSearchQuery('');
    setIsOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {/* Dropdown Button */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                   bg-white dark:bg-gray-800 text-sm font-medium text-text-primary
                   hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
        >
          {selectedProducts.length > 0 ? `Products (${selectedProducts.length})` : 'All Products'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7-7m0 0l-7 7m7-7v12" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                        rounded-lg shadow-2xl z-50 min-w-[280px]">
            {/* Search Input */}
            <div className="sticky top-0 p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-t-lg">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800
                         border border-gray-200 dark:border-gray-700 text-sm
                         text-text-primary placeholder-text-secondary
                         focus:outline-none focus:border-blue-500 transition-colors"
                autoFocus
              />
            </div>

            {/* Product List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <label
                    key={product.name}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800
                             cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.name)}
                      onChange={() => handleProductToggle(product.name)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                    />
                    <span className="flex-grow text-sm text-text-primary">{product.name}</span>
                    <span className="text-xs text-text-secondary bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {product.count}
                    </span>
                  </label>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-text-secondary">
                  No products found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Products as Chips */}
      {selectedProducts.map(product => (
        <div
          key={product}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg
                   bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
        >
          <span className="text-sm text-blue-800 dark:text-blue-300">{product}</span>
          <button
            onClick={() => handleRemoveProduct(product)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300
                     transition-colors ml-1"
            aria-label={`Remove ${product} filter`}
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
      ))}

      {/* Clear All Button - Only show when filters are active */}
      {selectedProducts.length > 0 && (
        <button
          onClick={handleClearAll}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300
                   hover:underline transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default ProductFilterBar;
