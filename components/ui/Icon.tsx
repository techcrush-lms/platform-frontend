import Image from 'next/image';
import React from 'react';

interface IconProps {
  url: string;
  width?: number;
  height?: number;
  className?: string;
}
const Icon = ({ url, width = 20, height = 20, className }: IconProps) => {
  return (
    <>
      <Image
        src={url}
        width={width}
        height={height}
        alt='icon'
        objectFit='contain'
        className={className}
      />
    </>
  );
};

export default Icon;
