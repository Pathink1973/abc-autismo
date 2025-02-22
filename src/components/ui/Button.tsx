import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors',
        {
          'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
          'bg-gray-100 text-gray-700 hover:bg-gray-200': variant === 'secondary',
          'border border-gray-300 text-gray-700 hover:bg-gray-50':
            variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};