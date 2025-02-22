import React from 'react';
import { clsx } from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, className, ...props }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={clsx(
          'w-full border rounded-md p-2 min-h-[80px]',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'resize-none',
          className
        )}
        {...props}
      />
    </div>
  );
};
