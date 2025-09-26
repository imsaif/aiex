'use client';

'use client';

import { useRouter } from 'next/navigation';
import categoriesData from '../../data/categories'; // Renamed to avoid conflict

interface CategoriesSectionProps {
  // No props needed as categories will be static links
}

const CategoriesSection = ({ }: CategoriesSectionProps) => {
  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    router.push(`/patterns?category=${slug}`);
  };

  return (
    <div className="w-full bg-surface-primary py-8">
      <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Pattern Themes Column */}
          <div>
            <h4 className="text-text-secondary text-sm font-semibold mb-4">
              Pattern Themes
            </h4>
            <ul className="space-y-2">
              {categoriesData.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategoryClick(category.slug)}
                    className="text-lg font-medium text-text-primary hover:text-accent-primary transition-colors duration-200 text-left w-full"
                  >
                    {category.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Removed Interaction Styles Column for now to simplify */}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;
