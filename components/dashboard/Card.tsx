import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={` bg-white dark:bg-gray-800
border-neutral-3 dark:border-black-2 dark:text-white rounded-xl shadow-sm border border-gray-200 p-4 ${className}`}
    >
      {children}
    </div>
  );
}
