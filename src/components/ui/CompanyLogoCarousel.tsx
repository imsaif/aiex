'use client';

import React from 'react';
import { CompanyLogo } from '@/data/company-logos';
import { useThemeFilter } from '@/hooks/useTheme';

interface CompanyLogoCarouselProps {
  /**
   * Array of companies to display
   */
  companies: CompanyLogo[];

  /**
   * Animation duration in seconds
   * @default 30
   */
  duration?: number;

  /**
   * Size variant for logos
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Gap between logos
   * @default 'default' (uses size-based gap)
   */
  gap?: 'default' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Show label/text under logos
   * @default false
   */
  showLabel?: boolean;

  /**
   * Custom CSS class
   */
  className?: string;
}

/**
 * CompanyLogoCarousel Component
 *
 * Displays company logos in an infinite horizontal scroll.
 * Uses CSS animation for smooth, performant scrolling.
 *
 * Features:
 * - Infinite loop (seamless)
 * - Grayscale with reduced opacity
 * - Non-interactive
 * - Responsive sizing
 * - Brand design tokens
 */
export default function CompanyLogoCarousel({
  companies,
  duration = 30,
  size = 'md',
  gap = 'default' as const,
  showLabel = false,
  className = '',
}: CompanyLogoCarouselProps) {
  // Get theme-aware filter for logos
  const logoFilter = useThemeFilter('grayscale(100%)');

  // Duplicate the companies array for seamless looping
  const doubledCompanies = [...companies, ...companies];

  // Size configurations
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
  };

  // Gap configurations - determine the spacing between logos
  let containerGap = 'gap-12';

  if (gap === 'default') {
    if (size === 'sm') containerGap = 'gap-8';
    else if (size === 'lg') containerGap = 'gap-16';
    else containerGap = 'gap-12';
  } else if (gap === 'sm') {
    containerGap = 'gap-6';
  } else if (gap === 'md') {
    containerGap = 'gap-12';
  } else if (gap === 'lg') {
    containerGap = 'gap-16';
  } else if (gap === 'xl') {
    containerGap = 'gap-20';
  }

  return (
    <div className={`relative w-full overflow-hidden py-8 min-h-16 ${className}`}>
      {/* Gradient fade effect on sides */}
      <div className="absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background-primary to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background-primary to-transparent" />

      {/* Scrolling container */}
      <style>{`
        @keyframes scroll-left-to-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .logo-carousel {
          animation: scroll-left-to-right ${duration}s linear infinite;
        }

        .logo-carousel:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className={`flex logo-carousel ${containerGap}`}>
        {doubledCompanies.map((company, index) => (
          <div
            key={`${company.name}-${index}`}
            className="flex-shrink-0 flex flex-col items-center justify-center"
          >
            {/* Logo Image */}
            <img
              src={company.logo}
              alt={company.name}
              className={`${sizeClasses[size]} w-auto object-contain opacity-60 transition-all duration-300 hover:opacity-100`}
              style={{ filter: logoFilter }}
            />

            {/* Optional Label */}
            {showLabel && (
              <p className="text-xs text-text-secondary mt-2 text-center whitespace-nowrap">
                {company.name}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
