'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Category } from '../../types';
import OptimizedMedia from '../ui/OptimizedMedia'; // Import OptimizedMedia

interface PatternCategoriesProps {
  categories: Category[];
}

export default function PatternCategories({ categories }: PatternCategoriesProps) {
  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    router.push(`/patterns?category=${slug}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <motion.div
          key={category.id}
          className="relative bg-surface-primary rounded-xl shadow-lg overflow-hidden cursor-pointer
                     transform transition-all duration-300 ease-in-out
                     border border-border-secondary"
          onClick={() => handleCategoryClick(category.slug)}
        >
          {/* Category Image */}
          <div className="relative w-full h-40 sm:h-48 overflow-hidden">
            <OptimizedMedia
              src={category.image}
              alt={category.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            <div className={`absolute inset-0 ${category.color}-gradient opacity-30`}></div>
          </div>

          {/* Category Content */}
          <div className="p-6 flex flex-col text-left">
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {category.title}
            </h3>
            <p className="text-text-secondary text-sm flex-grow">
              {category.description}
            </p>
            <Link href={`/patterns?category=${category.slug}`} className="mt-4 inline-flex items-center text-blue-600 text-sm font-medium hover:underline transition-colors">
              Explore Patterns
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
