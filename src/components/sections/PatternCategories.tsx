'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import categories from '../../data/categories';
import { useRouter } from 'next/navigation';
import OptimizedMedia from '../ui/OptimizedMedia';
import FavoriteButton from '../ui/FavoriteButton';

// Create icons for each category
const getCategoryIcon = (categoryId: string) => {
  switch(categoryId) {
    case 'contextual-assistance':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.091 3.091Z" />
          </svg>
        </div>
      );
    case 'progressive-disclosure':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        </div>
      );
    case 'human-in-the-loop':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
      );
    case 'conversational-ui':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
      );
    case 'explainable-ai':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
        </div>
      );
    case 'adaptive-interfaces':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
          </svg>
        </div>
      );
    case 'multimodal-interaction':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m6.115 5.19.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 0 3.95 8.05" />
          </svg>
        </div>
      );
    case 'guided-learning':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.91 59.91 0 0 1 12 3.493a59.913 59.913 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
        </div>
      );
    case 'augmented-creation':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
          </svg>
        </div>
      );
    case 'responsible-ai-design':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
          </svg>
        </div>
      );
    case 'error-recovery':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
      );
    case 'collaborative-ai':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>
        </div>
      );
    case 'ambient-intelligence':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </div>
      );
    case 'safe-exploration':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811Z" />
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

// Get background color based on category - updated with brand colors
const getIconBgColor = (categoryId: string) => {
  switch(categoryId) {
    case 'contextual-assistance':
      return 'bg-indigo-100 text-indigo-600';
    case 'progressive-disclosure':
      return 'bg-violet-100 text-violet-600';
    case 'human-in-the-loop':
      return 'bg-purple-100 text-purple-600';
    case 'conversational-ui':
      return 'bg-fuchsia-100 text-fuchsia-600';
    case 'adaptive-interfaces':
      return 'bg-indigo-50 text-indigo-500';
    case 'multimodal-interaction':
      return 'bg-indigo-100 text-indigo-600';
    case 'guided-learning':
      return 'bg-emerald-100 text-emerald-600';
    case 'augmented-creation':
      return 'bg-orange-100 text-orange-600';
    case 'explainable-ai':
      return 'bg-sky-100 text-sky-600';
    case 'responsible-ai-design':
      return 'bg-green-100 text-green-600';
    case 'error-recovery':
      return 'bg-red-100 text-red-600';
    case 'collaborative-ai':
      return 'bg-violet-100 text-violet-600';
    case 'ambient-intelligence':
      return 'bg-lime-100 text-lime-600';
    case 'safe-exploration':
      return 'bg-cyan-100 text-cyan-600';
    default:
      return 'bg-indigo-100 text-indigo-600';
  }
};

// Get card border gradient colors
const getCardBorderStyle = (index: number) => {
  const gradients = [
    'from-indigo-500 to-purple-500',
    'from-purple-500 to-pink-500',
    'from-pink-500 to-indigo-500',
    'from-indigo-400 to-fuchsia-500',
    'from-fuchsia-500 to-purple-500',
    'from-purple-400 to-indigo-500',
  ];
  
  return gradients[index % gradients.length];
};

const PatternCategories = () => {
  const router = useRouter();

  // Prefetch pattern pages for faster navigation
  React.useEffect(() => {
    categories.forEach(category => {
      router.prefetch(`/patterns/${category.slug}`);
    });
  }, [router]);

  const handleCardClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    // Use simple navigation approach without optional params to avoid linter issues
    router.push(`/patterns/${slug}`);
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
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
          Discover
        </span>
        <motion.div 
          className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"
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
                href={`/patterns/${category.slug}`}
                onClick={(e) => handleCardClick(e, category.slug)}
                className="block"
              >
                <div className={`group relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-br ${getCardBorderStyle(index)}`}>
                  <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden relative p-4 flex flex-col h-full">
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
                      {/* Favorite button overlay */}
                      <div className="absolute top-2 right-2">
                        <FavoriteButton 
                          patternId={category.id}
                          size="md"
                          className="bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm"
                        />
                      </div>
                    </div>
                    {/* Icon inside the card, above heading/description */}
                    <div className={`h-10 w-10 rounded-xl overflow-hidden flex-shrink-0 mx-auto mb-3 relative ${getIconBgColor(category.id)}`}> 
                      {getCategoryIcon(category.id)}
                    </div>
                    {/* Card heading and description below the icon */}
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 mb-1 text-center">{category.title}</h3>
                      <p className="text-gray-500 text-sm text-center">{category.description}</p>
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
