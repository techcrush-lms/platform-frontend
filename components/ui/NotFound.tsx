import React from 'react';
import { Button } from '@/components/ui/Button';
import { Search, Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NotFoundProps {
  title?: string;
  description?: string;
  showSearch?: boolean;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

const NotFound: React.FC<NotFoundProps> = ({
  title = 'Product Not Found',
  description = 'The product you are looking for does not exist or has been removed.',
  showSearch = true,
  showHomeButton = true,
  showBackButton = true,
  onBack,
  searchPlaceholder = 'Search for other products...',
  onSearch,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <div className='text-center max-w-md mx-auto px-4'>
        {/* Icon */}
        <div className='mb-6'>
          <div className='w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center'>
            <Search className='w-12 h-12 text-gray-400' />
          </div>
        </div>

        {/* Title */}
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
          {title}
        </h1>

        {/* Description */}
        <p className='text-gray-600 dark:text-gray-400 mb-8 leading-relaxed'>
          {description}
        </p>

        {/* Search Form */}
        {/* {showSearch && onSearch && (
          <form onSubmit={handleSearch} className='mb-6'>
            <div className='flex gap-2'>
              <input
                type='text'
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent dark:bg-gray-800 dark:text-white'
              />
              <Button
                type='submit'
                variant='primary'
                disabled={!searchQuery.trim()}
              >
                Search
              </Button>
            </div>
          </form>
        )} */}

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          {showBackButton && (
            <Button
              variant='outline'
              onClick={handleBack}
              className='flex items-center gap-2'
            >
              <ArrowLeft className='w-4 h-4' />
              Go Back
            </Button>
          )}

          {showHomeButton && (
            <Button
              variant='primary'
              onClick={() => router.push('/dashboard/home')}
              className='flex items-center gap-2'
            >
              <Home className='w-4 h-4' />
              Go Home
            </Button>
          )}
        </div>

        {/* Additional Help */}
        <div className='mt-8 text-sm text-gray-500 dark:text-gray-400'>
          <p>Need help? Contact our support team</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
