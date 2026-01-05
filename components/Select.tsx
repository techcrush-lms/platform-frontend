import { cn } from '@/lib/utils';
import { capitalize } from 'lodash';
import React from 'react';
import type { SelectProps } from '@/types';

const Select = ({
  name,
  className,
  data,
  required,
  value,
  onChange,
  multiple,
  placeholder,
}: SelectProps & { placeholder?: string }) => {
  return (
    <>
      <select
        id={name}
        className={cn(
          'bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
          className
        )}
        value={value}
        onChange={onChange}
        required={required}
        multiple={multiple}
      >
        {placeholder && (
          <option value='' disabled={true} hidden={true}>
            {placeholder}
          </option>
        )}
        {data.map((value) => (
          <option key={value} value={value}>
            {value === '*' ? 'All' : value}
          </option>
        ))}
      </select>
    </>
  );
};

export default Select;
