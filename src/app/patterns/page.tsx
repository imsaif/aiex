'use client';

import categories from '@/data/categories';
import patterns from '@/data/patterns';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

export default function PatternsPage() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (categorySlug && categoryRefs.current[categorySlug]) {
      categoryRefs.current[categorySlug]?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [categorySlug]);

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

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span className="text-gray-700">Patterns</span>
        {categorySlug && (
          <>
            <span>/</span>
            <Link href="/patterns" className="hover:text-blue-600">All Categories</Link>
            <span>/</span>
            <span className="text-gray-700">
              {categories.find(c => c.slug === categorySlug)?.title || 'Unknown Category'}
            </span>
          </>
        )}
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">AI Design Patterns</h1>
        <p className="text-xl text-gray-600">
          A collection of design patterns for building effective AI-powered user interfaces
        </p>
      </div>


      {/* Patterns by category */}
      {categories.map(category => (
        <div
          key={category.id}
          id={category.slug}
          ref={(el) => {
            categoryRefs.current[category.slug] = el;
          }}
          className="mb-12 p-6 rounded-lg transition-all duration-300"
        >
          <div className={`flex items-center mb-4 pb-2 border-b-2 border-${category.color}-300`}>
            {category.icon && (
              (() => {
                const IconComponent = LucideIcons[category.icon as keyof typeof LucideIcons] as React.ElementType;
                return IconComponent ? <IconComponent className={`w-7 h-7 mr-3 text-${category.color}-500`} /> : null;
              })()
            )}
            <h2 className="text-2xl font-bold">
              {category.title}
            </h2>
          </div>
          <p className="text-gray-600 mb-6 mt-2">{category.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patterns.filter(pattern => pattern.category === category.title).map((pattern) => (
              <Link key={pattern.id} href={`/patterns/${pattern.slug}`}>
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-300 transition-all duration-300">
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>
    </main>
  );
}
