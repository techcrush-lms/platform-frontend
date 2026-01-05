import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'w-full text-base font-medium text-center text-white dark:text-white rounded-lg focus:ring-4 focus:ring-primary-300 sm:w-auto bg-primary-main hover:bg-secondary-main-hover focus:bg-secondary-main-focus dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input text-primary-main bg-background dark:hover:bg-primary-main dark:hover:text-gray-200  dark:hover:border-primary-main hover:bg-primary-main hover:text-gray-200 dark:text-white',
        secondary:
          'bg-secondary-main text-white dark:text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:text-white',
        link: 'text-primary underline-offset-4 hover:underline',
        red: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-800 dark:hover:bg-red-900 dark:focus:ring-red-900',
        green:
          'bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:bg-green-800 dark:hover:bg-green-900 dark:focus:ring-green-900',
        primary:
          'bg-primary-main text-white hover:bg-primary-400 focus:ring-4 focus:ring-primary-800 dark:bg-primary-main dark:hover:bg-primary-800 dark:focus:bg-primary-800',
      },
      size: {
        default: 'px-5 py-3',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
