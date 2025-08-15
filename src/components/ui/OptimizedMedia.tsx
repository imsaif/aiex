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
  const extension = src.split('.').pop()?.toLowerCase();
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Handle potential 404s for images
  useEffect(() => {
    const checkImageExists = async () => {
      try {
        const response = await fetch(src, { method: 'HEAD' });
        if (!response.ok) {
          console.warn(`Image at ${src} could not be loaded (${response.status})`);
        }
      } catch (e) {
        console.warn(`Error checking image at ${src}`);
      }
    };
    
    if (src) {
      checkImageExists();
    }
  }, [src]);
  
  // Handle media load completion
  const handleLoadComplete = () => {
    setIsLoading(false);
  };
  
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: `${width}/${height}` }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100">
        </div>
      )}
      
      {extension === 'gif' ? (
        // For GIFs, we'll use an img tag with lazy loading
        <img
          ref={imageRef}
          src={src || '/placeholder-image.png'} // Use a placeholder if src is empty
          alt={alt}
          className={`w-full h-full object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoadComplete}
          onClick={onClick}
          loading={priority ? 'eager' : 'lazy'}
        />
      ) : (
        // For regular images, use Next.js Image
        <Image
          src={src || '/placeholder-image.png'} // Use a placeholder if src is empty
          alt={alt}
          width={width}
          height={height}
          className={`object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoadComplete}
          onClick={onClick}
          priority={priority}
          unoptimized={extension === 'gif'} // Don't optimize GIFs with Next.js Image
        />
      )}
    </div>
  );
};

export default OptimizedMedia; 