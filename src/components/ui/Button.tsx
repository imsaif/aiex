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
 * - Primary: Filled with brand black (accent-primary)
 * - Secondary: Black border with transparent background
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
  const baseClasses = 'relative inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-ring-focus focus:ring-offset-2 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    // Primary: Filled with brand black
    primary: 'bg-accent-primary text-background-primary hover:bg-accent-hover active:opacity-90',

    // Secondary: Black border, light background
    secondary: 'border-2 border-accent-primary bg-surface-primary text-accent-primary hover:bg-accent-subtle active:opacity-90',

    // Outline: Border only
    outline: 'border border-border-primary bg-surface-primary text-text-primary hover:bg-background-secondary active:opacity-90',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-lg',
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
