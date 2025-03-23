import { type ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'transparent';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  children,
  variant = 'primary',
  size = 'sm',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  icon,
  iconPosition = 'left',
  ...props
}: ButtonProps) {
  const baseStyles = 'cursor-pointer rounded-md transition-all duration-200 font-medium text-base shadow-sm hover:shadow flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed px-2';

  const sizeStyles = {
    xs: 'h-8',
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-14',
  };
  
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600',
    transparent: 'bg-transparent text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 !shadow-none',
  };

  const widthStyles = fullWidth ? 'w-full' : 'w-auto';

  const renderContent = () => {
    if (isLoading) return '処理中...';
    
    if (icon && !children) return icon;
    
    if (icon && children) {
      return (
        <span className="flex items-center gap-1 w-max">
          {iconPosition === 'left' && icon}
          {children}
          {iconPosition === 'right' && icon}
        </span>
      );
    }
    
    return children;
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {renderContent()}
    </button>
  );
} 