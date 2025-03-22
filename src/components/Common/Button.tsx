import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'h-10 rounded-md transition-all duration-200 font-medium text-base shadow-sm hover:shadow flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed px-4 cursor-pointer';
  
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600',
  };

  const widthStyles = fullWidth ? 'w-full' : 'w-full sm:w-auto';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? '処理中...' : children}
    </button>
  );
} 