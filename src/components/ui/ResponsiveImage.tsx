'use client';

import { useState } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
}

export default function ResponsiveImage({ 
  src, 
  alt, 
  className = "object-cover rounded shadow-sm", 
  fallbackSrc = "/images/placeholder-image.png",
  priority,
  sizes,
  width,
  height,
  loading
}: ResponsiveImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  
  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      width={width}
      height={height}
      loading={loading}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
} 