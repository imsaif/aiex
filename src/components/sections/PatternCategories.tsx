'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import OptimizedMedia from '../ui/OptimizedMedia';
import { Category } from '../../types'; // Import Category interface

// Create icons for each category
const getCategoryIcon = (categoryId: string) => {
  switch(categoryId) {
    case 'adaptive-intelligent-systems':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
          </svg>
        </div>
      );
    case 'human-ai-collaboration':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
      );
    case 'trustworthy-reliable-ai':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
        </div>
      );
    case 'natural-interaction':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="absolute inset-0 flex items-center justify-center font-bold">
          {categoryId.charAt(0).toUpperCase()}
        </div>
      );
  }
};

// Get background color based on category - using standard Tailwind colors for reliability
const getIconBgColor = (categoryId: string) => {
  switch(categoryId) {
    case 'adaptive-intelligent-systems':
      return 'bg-blue-50 text-blue-500';
    case 'human-ai-collaboration':
      return 'bg-green-50 text-green-500';
    case 'trustworthy-reliable-ai':
      return 'bg-purple-50 text-purple-500';
    case 'natural-interaction':
      return 'bg-orange-50 text-orange-500';
    default:
      return 'bg-accent-subtle text-text-secondary';
  }
};

// Get card border style - minimal approach
const getCardBorderStyle = (index: number) => {
  // Simple border without gradients
  return 'border-border-primary';
};

interface PatternCategoriesProps {
  categories: Category[];
}

const PatternCategories = ({ categories }: PatternCategoriesProps) => {
  const router = useRouter();

  // Prefetch patterns page for faster navigation
  React.useEffect(() => {
    router.prefetch('/patterns');
  }, [router]);

  const handleCardClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    // Navigate to patterns page with anchor
    router.push(`/patterns#${slug}`);
  };

  return (
    <div id="categories" className="pt-4 pb-16">
      <motion.h2 
        className="text-3xl sm:text-4xl font-extrabold mb-10 text-center md:text-left tracking-tight relative inline-block"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <span className="text-text-primary">
          Discover
        </span>
        <motion.div 
          className="absolute -bottom-2 left-0 h-1 bg-accent-primary"
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        />
      </motion.h2>
      
      {/* Card grid with improved spacing */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
      >
        {categories.map((category, index) => (
          <div key={category.id} className="flex flex-col">
            <div>
              <a 
                href={`/patterns#${category.slug}`}
                onClick={(e) => handleCardClick(e, category.slug)}
                className="block"
              >
                <div className="group relative rounded-2xl overflow-hidden border border-border-primary hover:border-border-secondary transition-colors duration-200">
                  <div className="bg-surface-primary rounded-2xl overflow-hidden relative p-4 flex flex-col h-full">
                    {/* Card image at the top */}
                    <div className="relative w-full h-56 overflow-hidden rounded-xl mb-4">
                      <OptimizedMedia
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full"
                        width={400}
                        height={300}
                        priority={index < 6} // Prioritize loading the first 6 images
                      />
                    </div>
                    {/* Icon inside the card, above heading/description */}
                    <div className={`h-10 w-10 rounded-xl overflow-hidden flex-shrink-0 mx-auto mb-3 relative ${getIconBgColor(category.id)}`}> 
                      {getCategoryIcon(category.id)}
                    </div>
                    {/* Card heading and description below the icon */}
                    <div>
                      <h3 className="font-medium text-lg text-text-primary mb-1 text-center">{category.title}</h3>
                      <p className="text-text-secondary text-sm text-center">{category.description}</p>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatternCategories;
