import { cn } from '@/lib/utils';
import React from 'react';

interface LoadingIconProps {
  className?: string;
  strokeWidth?: number;
}

const LoadingIcon: React.FC<LoadingIconProps> = ({
  className,
  strokeWidth = 4,
}) => {
  return (
    // <svg
    //   xmlns='http://www.w3.org/2000/svg'
    //   viewBox='0 0 24 24'
    //   fill='none'
    //   stroke='currentColor'
    //   strokeWidth={strokeWidth}
    //   strokeLinecap='round'
    //   strokeLinejoin='round'
    //   className={cn('h-5 w-5', className)}
    // >
    //   <line x1='18' y1='6' x2='6' y2='18'></line>
    //   <line x1='6' y1='6' x2='18' y2='18'></line>
    // </svg>

    <svg
      className={cn('animate-spin -ml-1 mr-2 h-4 w-4 text-white', className)}
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth={strokeWidth}
      ></circle>
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      ></path>
    </svg>
  );
};

export default LoadingIcon;
