'use client';

import React from 'react';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  onClick?: () => void;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  rounded?: 'none' | 'small' | 'medium' | 'large';
}

export default function Card({
  children,
  className = '',
  title,
  subtitle,
  image,
  imageAlt,
  onClick,
  padding = 'medium',
  shadow = 'medium',
  rounded = 'medium'
}: CardProps) {
  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-6',
    large: 'p-8'
  };

  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg'
  };

  const roundedClasses = {
    none: '',
    small: 'rounded-sm',
    medium: 'rounded-lg',
    large: 'rounded-xl'
  };

  const baseClasses = `bg-surface-primary border border-gray-200 ${paddingClasses[padding]} ${shadowClasses[shadow]} ${roundedClasses[rounded]} ${onClick ? 'cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all duration-200' : ''}`;

  const cardContent = (
    <>
      {image && (
        <div className="mb-4">
          <img
            src={image}
            alt={imageAlt || title || 'Card image'}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-text-secondary mb-4">
          {subtitle}
        </p>
      )}
      {children}
    </>
  );

  if (onClick) {
    return (
      <div
        className={`${baseClasses} ${className}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      {cardContent}
    </div>
  );
}