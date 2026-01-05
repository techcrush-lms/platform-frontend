interface LoadingSkeletonSchema {
  length?: number;  
  columns?: number;  
}

const DEFAULT_COLUMNS = Math.floor(70 / 10);

const LoadingSkeleton = ({
  length = DEFAULT_COLUMNS,
  columns = DEFAULT_COLUMNS,
}: LoadingSkeletonSchema) => {
  return (
    <tbody>
      {Array.from({ length }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className='animate-pulse bg-gray-100 dark:bg-gray-800 w-full'>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className='px-6 py-3'>
              <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-[10vw]'></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default LoadingSkeleton;
