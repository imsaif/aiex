'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedMediaProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
}

// Hook for intersection observer-based lazy loading
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '50px', // Load 50px before entering viewport
        threshold: 0.1,
        ...options 
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded]);

  return { elementRef, isVisible, hasLoaded };
};

const OptimizedMedia: React.FC<OptimizedMediaProps> = ({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  onClick
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const extension = src.split('.').pop()?.toLowerCase();
  
  // Progressive loading with intersection observer
  const { elementRef, isVisible } = useIntersectionObserver();
  
  // Don't lazy load if priority is set
  const shouldLoad = priority || isVisible;
  
  // Handle media load completion
  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  // Handle media load errors
  const handleLoadError = () => {
    setLoadError(true);
    setIsLoading(false);
  };
  
  return (
    <div ref={elementRef} className={`relative ${className}`} style={{ aspectRatio: `${width}/${height}` }}>
      {/* Loading placeholder */}
      {!shouldLoad && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
          </svg>
        </div>
      )}

      {/* Loading indicator while media loads */}
      {shouldLoad && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {shouldLoad && (
        <>
          <Image
            src={src || '/placeholder-image.png'}
            alt={alt}
            width={width}
            height={height}
            className={`object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onLoad={handleLoadComplete}
            onError={handleLoadError}
            onClick={onClick}
            priority={priority}
            placeholder="blur"
            unoptimized={extension === 'gif'} // Add unoptimized for GIFs to prevent 404s for video formats
          />
          
          {/* Error fallback */}
          {loadError && (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm">Media failed to load</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OptimizedMedia;
