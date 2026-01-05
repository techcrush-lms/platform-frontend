'use client';

import React, { useState } from 'react';
import Select from '@/components/Select';
import Input from '@/components/ui/Input';

const priceRangeOptions = [
  'All Prices',
  'Under ₦10,000',
  '₦10,000 - ₦50,000',
  '₦50,000 - ₦100,000',
  'Over ₦100,000',
];

interface CourseFiltersProps {
  search: string;
  priceRange: string;
  onSearch: (value: string) => void;
  onPriceRangeChange: (value: string) => void;
}

const ProductFilters = ({
  search,
  priceRange,
  onSearch,
  onPriceRangeChange,
}: CourseFiltersProps) => {
  const [inputValue, setInputValue] = useState(search);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(inputValue);
    }
  };

  return (
    <div className='flex flex-row gap-4 items-center'>
      <Input
        type='text'
        placeholder='Search for anything...'
        className='border border-gray-300 rounded px-3  py-2 md:py-[10px] text-base w-full  dark:bg-gray-800 dark:text-white'
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
      />
      <Select
        name='price-range'
        className='font-bold text-base w-full py-2 rounded'
        data={priceRangeOptions}
        required={true}
        value={priceRange}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onPriceRangeChange(e.target.value)
        }
      />
    </div>
  );
};

export default ProductFilters;
