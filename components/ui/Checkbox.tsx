import { cn } from '@/lib/utils';
import React from 'react';
import type { InputProps } from '@/types';

const Checkbox = ({
  type = 'checkbox',
  name,
  placeholder = '',
  className,
  onChange,
  checked,
  enableDarkMode = true,
  disabled,
}: InputProps) => {
  return (
    <>
      <input
        type={type}
        aria-describedby={name}
        name={name}
        id={name}
        className={cn(
          'w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300',
          className,
          enableDarkMode &&
            'dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600'
        )}
        placeholder={placeholder}
        onChange={onChange}
        checked={checked}
        required
        disabled={disabled}
      />
    </>
  );
};

export default Checkbox;
