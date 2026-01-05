const ShimmerCard = () => {
  return (
    <div className='animate-pulse space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
      <div className='h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4'></div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className='h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4'
          ></div>
        ))}
      </div>
      <div className='h-6 mt-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4'></div>
      <div className='flex items-center gap-4 mt-2'>
        <div className='w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-full'></div>
        <div className='flex-1 space-y-2'>
          <div className='h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2'></div>
          <div className='h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3'></div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerCard;
