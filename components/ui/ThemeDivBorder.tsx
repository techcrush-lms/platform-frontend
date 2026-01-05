import { cn } from '@/lib/utils';
import React from 'react';

const ThemeDivBorder = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) => {
  return (
    <div
      className={cn(
        'text-gray-700 dark:text-white border border-gray-200 dark:border-black-2',
        className && className
      )}
    >
      {children}
    </div>
  );
};

export default ThemeDivBorder;
