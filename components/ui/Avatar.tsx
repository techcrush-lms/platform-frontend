// components/ui/Avatar.tsx
import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

const Avatar = ({ src, alt, size = 'md' }: AvatarProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover ${sizeMap[size]} border border-gray-300 dark:border-gray-600`}
    />
  );
};

export default Avatar;
