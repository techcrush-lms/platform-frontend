'use client';

import { baseUrl } from '@/lib/utils';
import { RootState } from '@/redux/store';
import { ArrowUpRight, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/Button';

export const StoreLink = ({ slug }: { slug: string }) => {
  const fullUrl = `${baseUrl}/b/${slug}`;
  const { org } = useSelector((state: RootState) => state.org);

  const handleVisit = () => {
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
    toast.success('Opened in new tab!');
  };

  if (!org) return null;

  return (
    <div className='flex items-center px-3 py-2'>
      <Button
        variant='outline'
        onClick={handleVisit}
        className='flex items-center gap-1 text-sm px-2 py-1 h-7 dark:border-gray-400'
        title='Visit Business link'
      >
        <Store className='w-4 h-4' />
        Visit <span className='hidden md:block'>Store</span>
      </Button>
    </div>
  );
};
