import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'relative inline-flex items-center justify-center rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer transition-colors duration-200';
  
  const variantClasses = {
    primary: 'bg-accent-primary text-background-primary hover:bg-accent-hover focus:ring-border-focus',
    secondary: 'bg-surface-secondary text-text-primary hover:bg-background-tertiary focus:ring-border-focus border border-gray-200',
    outline: 'border border-gray-200 bg-surface-primary text-text-primary hover:bg-accent-subtle focus:ring-border-focus',
    gradient: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-8 py-3 text-base',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;
  
  return (
    <button 
      className={buttonClasses} 
      {...props}
    >
      {children}
    </button>
  );
}
