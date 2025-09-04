import React from 'react';
import Link from 'next/link';
import patterns from '@/data/patterns';
import { Pattern } from '@/types';
import categories from '@/data/categories';

export default function PatternsPage() {
  // Use directly imported patterns

  // Create a mapping from category name to color
  const categoryColorMap = categories.reduce((acc, category) => {
    acc[category.title] = category.color;
    return acc;
  }, {} as Record<string, string>);

  // Group patterns by category
  const patternsByCategory = patterns.reduce((acc, pattern) => {
    if (!acc[pattern.category]) {
      acc[pattern.category] = [];
    }
    acc[pattern.category].push(pattern);
    return acc;
  }, {} as Record<string, typeof patterns>);

  // Get unique categories with their colors
  const categoriesWithColors = Object.keys(patternsByCategory).map(category => {
    return {
      name: category,
      color: categoryColorMap[category] || 'blue' // fallback to blue if no color found
    };
  });

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span className="text-gray-700">Patterns</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">AI Design Patterns</h1>
        <p className="text-xl text-gray-600">
          A collection of design patterns for building effective AI-powered user interfaces
        </p>
      </div>

      
      {/* Patterns by category */}
      {categories.map(category => (
        <div key={category.id} id={category.slug} className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 pb-2 border-b-2 border-${category.color}-300`}>
            {category.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patterns.filter(pattern => pattern.category === category.title).map((pattern) => (
              <Link key={pattern.id} href={`/patterns/${pattern.slug}`}>
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-300 transition-all duration-300">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-3`}>
                    {pattern.category}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{pattern.title}</h3>
                  <p className="text-gray-600">{pattern.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </Link>
      </div>
    </main>
  );
}
