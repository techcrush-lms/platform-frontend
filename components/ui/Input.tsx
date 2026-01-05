import { cn } from '@/lib/utils';
import React from 'react';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onKeyPress'> {
  enableDarkMode?: boolean;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input = ({
  id,
  type = 'text',
  name,
  placeholder = '',
  className,
  onChange,
  value,
  defaultValue,
  required,
  readOnly = false,
  enableDarkMode = true,
  onKeyPress,
  ...props
}: InputProps) => {
  return (
    <>
      <input
        type={type}
        name={name}
        id={id}
        className={cn(
          'bg-gray-50 border border-gray-300 text-gray-600 text-sm sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5',
          className,
          enableDarkMode &&
            'dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
        )}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        value={value}
        required={required}
        onKeyPress={onKeyPress}
        readOnly={readOnly}
        {...props}
      />
    </>
  );
};

export default Input;
