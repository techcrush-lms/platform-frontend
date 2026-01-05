'use client';

import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, toggleTheme, isMounted, setTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [showSystemOption, setShowSystemOption] = useState(false);

  // Add keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 't' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  if (!isMounted) {
    return (
      <div className='w-16 h-9 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse' />
    );
  }

  const handleSystemTheme = () => {
    setTheme('system');
    setShowSystemOption(false);
  };

  return (
    <div className='relative'>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') setShowSystemOption(true);
        }}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        aria-haspopup='true'
        aria-expanded={showSystemOption}
        className={cn(
          'relative w-16 h-9 rounded-full transition-all duration-300 ease-out',
          'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700',
          'border border-gray-200 dark:border-gray-700',
          'shadow-sm hover:shadow-md',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          'flex items-center px-1'
        )}
      >
        {/* Sun icon (light mode) */}
        <Sun
          className={cn(
            'absolute z-10 w-5 h-5 transition-all duration-300 ease-out',
            'text-amber-500 hover:text-amber-600 dark:text-amber-400/80',
            theme === 'light' ? 'opacity-100 left-2' : 'opacity-0 -left-2'
          )}
        />

        {/* Moon icon (dark mode) */}
        <Moon
          className={cn(
            'absolute z-10 w-5 h-5 transition-all duration-300 ease-out',
            'text-indigo-500 dark:text-indigo-300',
            'hover:text-indigo-600 dark:hover:text-indigo-200',
            theme === 'dark' ? 'opacity-100 right-2' : 'opacity-0 -right-2'
          )}
        />

        {/* System icon (shown when hovering) */}
        {isHovered && (
          <Laptop
            className={cn(
              'absolute z-10 w-4 h-4 transition-all duration-300 ease-out',
              'text-gray-500 dark:text-gray-400',
              'left-1/2 transform -translate-x-1/2',
              theme === 'system' ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}

        {/* Toggle knob */}
        <span
          className={cn(
            'relative z-0 w-7 h-7 rounded-full transition-all duration-300 ease-out',
            'bg-white dark:bg-gray-100',
            'border border-gray-200 dark:border-gray-300',
            'shadow-md hover:shadow-lg',
            theme === 'light'
              ? 'translate-x-0'
              : theme === 'dark'
              ? 'translate-x-[28px]'
              : 'translate-x-[14px]' // Middle position for system
          )}
        >
          {/* Subtle shimmer effect */}
          <span
            className={cn(
              'absolute inset-0 opacity-0 hover:opacity-30 transition-opacity duration-300',
              'bg-gradient-to-r from-transparent via-white/80 to-transparent',
              theme === 'light'
                ? 'animate-shimmer-amber'
                : 'animate-shimmer-indigo'
            )}
          />
        </span>
      </button>

      {/* System theme option dropdown */}
      {showSystemOption && (
        <div
          className='absolute z-50 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          onMouseLeave={() => setShowSystemOption(false)}
        >
          <button
            onClick={handleSystemTheme}
            className='w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2'
          >
            <Laptop className='w-4 h-4' />
            Use system theme
          </button>
        </div>
      )}

      {/* Tooltip */}
      {/* <Tooltip content={`Current: ${theme} mode (Press ⌘+T to toggle)`}>
        <div className='absolute inset-0' />
      </Tooltip> */}
    </div>
  );
}
