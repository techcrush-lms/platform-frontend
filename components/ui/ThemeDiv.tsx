import { cn } from '@/lib/utils';
import React from 'react';

const ThemeDiv = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) => {
  return (
    <div
      className={cn(
        'text-gray-700 dark:text-white border dark:bg-gray-800 border-gray-200 dark:border-black-2 rounded-lg',
        className && className
      )}
    >
      {children}
    </div>
  );
};

export default ThemeDiv;
