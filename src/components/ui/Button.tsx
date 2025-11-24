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
  const baseClasses = 'relative inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-ring-focus focus:ring-offset-2 cursor-pointer transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    // Primary: Filled with brand black - pill shape with scale hover
    primary: 'bg-black text-white hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98]',

    // Secondary: Black border, light background
    secondary: 'border border-black bg-white text-black hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98]',

    // Outline: Subtle border - pill shape
    outline: 'border border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]',
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
