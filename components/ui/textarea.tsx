import * as React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'onKeyPress'
  > {
  enableDarkMode?: boolean;
  onKeyPress?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      placeholder = '',
      enableDarkMode = true,
      onKeyPress,
      ...props
    },
    ref
  ) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
          enableDarkMode &&
            'bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
        )}
        ref={ref}
        placeholder={placeholder}
        onKeyPress={onKeyPress}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
