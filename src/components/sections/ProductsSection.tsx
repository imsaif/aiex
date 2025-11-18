'use client';

import { Pattern } from '@/types';
import { getProductsForPattern } from '@/data/utils/product-utils';
import { getProductLogoUrl, hasProductLogo } from '@/data/product-logos';
import { useState } from 'react';
import { useThemeFilter } from '@/hooks/useTheme';

interface ProductsSectionProps {
  pattern: Pattern;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ pattern }) => {
  const products = getProductsForPattern(pattern);
  const productsWithLogos = products.filter(hasProductLogo);

  if (productsWithLogos.length === 0) {
    return null; // Don't show section if no products have logos
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium whitespace-nowrap">Used by:</span>

        {/* Logo Row */}
        <div className="flex flex-wrap items-center gap-3">
          {productsWithLogos.map((product) => {
            const logoUrl = getProductLogoUrl(product);

            return (
              <ProductLogoCard key={product} productName={product} logoUrl={logoUrl} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface ProductLogoCardProps {
  productName: string;
  logoUrl: string;
}

const ProductLogoCard: React.FC<ProductLogoCardProps> = ({ productName, logoUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const baseFilter = useThemeFilter('grayscale(100%)');

  if (hasError) {
    return (
      <span
        className="text-xs text-gray-400"
      >
        {productName}
      </span>
    );
  }

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => {
        setShowTooltip(true);
      }}
      onMouseLeave={() => {
        setShowTooltip(false);
      }}
    >
      {/* Logo Image with Grayscale */}
      <img
        src={logoUrl}
        alt={productName}
        className={`h-7 w-7 transition-all duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          filter: showTooltip ? 'grayscale(0%)' : baseFilter,
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded whitespace-nowrap transition-opacity pointer-events-none z-50">
          {productName}
        </div>
      )}
    </div>
  );
};

export default ProductsSection;
