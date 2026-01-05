const ProductGridItemSkeleton = () => {
  return (
    <div className='shadow-md rounded-xl overflow-hidden min-h-[320px] animate-pulse bg-white dark:bg-gray-800'>
      <div className='h-48 w-full bg-gray-200 dark:bg-gray-700'></div>
      <div className='p-4 space-y-2'>
        <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
        <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
        <div className='mt-4 h-8 bg-gray-300 dark:bg-gray-700 rounded w-full'></div>
      </div>
    </div>
  );
};

export default ProductGridItemSkeleton;
