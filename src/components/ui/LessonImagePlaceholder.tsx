'use client';

import React from 'react';

interface LessonImagePlaceholderProps {
  label: string;
  src?: string;
  alt?: string;
  className?: string;
}

export default function LessonImagePlaceholder({
  label,
  src,
  alt = label,
  className = '',
}: LessonImagePlaceholderProps) {
  if (src) {
    return (
      <figure className={`rounded-lg overflow-hidden border border-border-primary ${className}`}>
        <img
          src={src}
          alt={alt}
          width={800}
          height={450}
          className="w-full h-auto object-cover"
        />
        {label && (
          <figcaption className="px-4 py-2 bg-background-secondary text-sm text-text-tertiary border-t border-border-primary">
            {label}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <div
      className={`rounded-lg border-2 border-dashed border-border-secondary bg-background-secondary p-8 text-center ${className}`}
    >
      <div className="text-text-disabled mb-2">
        <svg
          className="w-12 h-12 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p className="text-text-tertiary font-medium">{label}</p>
      <p className="text-text-disabled text-sm mt-1">Image will be added here</p>
    </div>
  );
}
