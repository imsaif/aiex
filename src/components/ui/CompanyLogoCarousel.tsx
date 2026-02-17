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
  size?: 'xs' | 'sm' | 'md' | 'lg';

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
  duration = 100, // Very slow, ambient animation
  size = 'md',
  gap = 'default' as const,
  showLabel = false,
  className = '',
}: CompanyLogoCarouselProps) {
  // Get theme-aware filter for logos - navy tint to match design system (#162036)
  // brightness(0) makes it black, then invert + sepia + hue-rotate shifts to darker navy
  const logoFilter = useThemeFilter('brightness(0) saturate(100%) invert(10%) sepia(50%) saturate(2000%) hue-rotate(200deg) brightness(85%) contrast(95%)');

  // Duplicate the companies array for seamless looping
  const doubledCompanies = [...companies, ...companies];

  // Size configurations
  const sizeClasses = {
    xs: 'h-5',
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
  };

  // Explicit pixel sizes for width/height attributes (prevents unstyled blowup)
  const sizeMap = {
    xs: 20,
    sm: 32,
    md: 48,
    lg: 64,
  };

  // Gap configurations - determine the spacing between logos
  let containerGap = 'gap-12';

  if (gap === 'default') {
    if (size === 'xs') containerGap = 'gap-6';
    else if (size === 'sm') containerGap = 'gap-8';
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
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Scrolling container using CSS animation for seamless loop */}
      <div
        className={`flex ${containerGap} animate-scroll`}
        style={{
          animationDuration: `${duration}s`,
          width: 'max-content',
        }}
      >
        {doubledCompanies.map((company, index) => (
          <div
            key={`${company.name}-${index}`}
            className="flex-shrink-0 flex flex-col items-center justify-center"
          >
            {/* Logo Image - navy tint with original color on hover */}
            <img
              src={company.logo}
              alt={company.name}
              width={sizeMap[size]}
              height={sizeMap[size]}
              className={`${sizeClasses[size]} w-auto object-contain logo-navy`}
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

      {/* CSS for seamless scrolling and logo styling */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-scroll {
          animation: scroll linear infinite;
        }
        .logo-navy {
          filter: brightness(0) saturate(100%) invert(10%) sepia(50%) saturate(2000%) hue-rotate(200deg) brightness(85%) contrast(95%);
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        .logo-navy:hover {
          filter: none;
          opacity: 1;
        }
        /* Dark mode: use light gray/white filter instead of navy */
        :global([data-theme="dark"]) .logo-navy {
          filter: brightness(0) invert(1);
          opacity: 0.5;
        }
        :global([data-theme="dark"]) .logo-navy:hover {
          filter: none;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
