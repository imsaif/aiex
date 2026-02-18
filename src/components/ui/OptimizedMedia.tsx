'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

interface OptimizedMediaProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
  fill?: boolean;
  sizes?: string;
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

// For GIF sources, derive the MP4 path (created by ffmpeg conversion)
function getVideoSrc(src: string): string {
  return src.replace(/\.gif$/i, '.mp4');
}

const OptimizedMedia: React.FC<OptimizedMediaProps> = ({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  onClick,
  fill = false,
  sizes,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const extension = src.split('.').pop()?.toLowerCase();
  const isGif = extension === 'gif';

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

  // Check if this is claude-feedback.gif, chatgpt-feedback.gif, or bemyeyes to apply object-contain
  const isFeedbackExample = src?.includes('claude-feedback.gif') || src?.includes('chatgpt-feedback.gif') || src?.includes('bemyeyes');
  const objectFitClass = isFeedbackExample ? 'object-contain' : 'object-cover';

  // For GIFs, prefer MP4 video (much smaller file size). Fall back to GIF if MP4 fails.
  const videoComponent = isGif && !videoError ? (
    <video
      src={getVideoSrc(src)}
      autoPlay
      loop
      muted
      playsInline
      className={`${objectFitClass} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 w-full h-full ${fill ? 'absolute inset-0' : ''}`}
      onLoadedData={handleLoadComplete}
      onError={() => {
        // MP4 not available, fall back to GIF image
        setVideoError(true);
        setIsLoading(true);
      }}
      onClick={onClick}
    />
  ) : null;

  const imageComponent = (
    <Image
      src={src || '/placeholder-image.png'}
      alt={alt}
      {...(fill ? { fill: true, sizes: sizes || '100vw' } : { width, height })}
      className={`${objectFitClass} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${fill ? 'absolute inset-0' : ''}`}
      onLoad={handleLoadComplete}
      onError={handleLoadError}
      onClick={onClick}
      priority={priority}
      unoptimized={isGif}
    />
  );

  const content = (
    <>
      {!shouldLoad && (
        <div className="absolute inset-0 bg-background-secondary animate-pulse flex items-center justify-center">
          <svg className="w-8 h-8 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
          </svg>
        </div>
      )}

      {shouldLoad && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background-secondary animate-pulse">
          <div className="w-6 h-6 border-2 border-border-primary border-t-accent-primary rounded-full animate-spin"></div>
        </div>
      )}

      {shouldLoad && (
        <>
          {isGif && !videoError ? videoComponent : imageComponent}
          {loadError && (
            <div className="w-full h-full flex items-center justify-center bg-background-secondary text-text-secondary">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm">Media failed to load</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <div ref={elementRef} className={`relative ${className}`} style={!fill ? { aspectRatio: `${width}/${height}` } : undefined}>
      {content}
    </div>
  );
};

export default OptimizedMedia;
