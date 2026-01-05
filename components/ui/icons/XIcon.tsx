import { cn } from '@/lib/utils';
import React from 'react';

interface XIconProps {
  className?: string;
  strokeWidth?: number;
}

const XIcon: React.FC<XIconProps> = ({ className, strokeWidth = 2 }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={strokeWidth}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={cn('h-5 w-5', className)}
    >
      <line x1='18' y1='6' x2='6' y2='18'></line>
      <line x1='6' y1='6' x2='18' y2='18'></line>
    </svg>
  );
};

export default XIcon;
