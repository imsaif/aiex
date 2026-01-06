import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

/**
 * Standardized Button Component
 *
 * Uses brand design tokens exclusively:
 * - Primary: Filled with brand navy (accent-primary)
 * - Secondary: Navy border with transparent background
 * - Outline: Border only, no fill
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'relative inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-ring-focus focus:ring-offset-2 cursor-pointer transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    // Primary: Filled with brand navy - pill shape with scale hover
    // In dark mode, accent-primary is white, so we need dark text
    primary: 'bg-accent-primary text-white dark:text-gray-900 hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98]',

    // Secondary: Navy border, light background
    secondary: 'border border-accent-primary bg-white dark:bg-gray-900 text-accent-primary hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98]',

    // Outline: Subtle border - pill shape
    outline: 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.98]',
  };

  const sizeClasses = {
    sm: 'px-5 py-2.5 text-sm rounded-full',
    md: 'px-6 py-3 text-base rounded-full',
    lg: 'px-8 py-4 text-base rounded-full',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'disabled' : '';

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
