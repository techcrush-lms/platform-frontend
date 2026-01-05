import Image from 'next/image';
import React from 'react';

const Logo = ({
  width = 150,
  height = 120,
  logo = '/logo.png',
  logo_white = '/logo-white.png',
}: {
  width?: number;
  height?: number;
  logo?: string;
  logo_white?: string;
}) => {
  return (
    <>
      <Image
        src={logo}
        width={width}
        height={height}
        alt='Logo'
        className='mr-3 object-contain block dark:hidden'
      />
      <Image
        src={logo_white}
        width={width}
        height={height}
        alt='Logo'
        className='mr-3 object-contain hidden dark:block'
      />
    </>
  );
};

export default Logo;
