import React from 'react';

const Pagination = ({
  noMoreNextPage = false,
  paddingRequired = true,
  total = 3,
  currentPage,
  onClickNext,
  onClickPrev,
}: {
  noMoreNextPage?: boolean;
  paddingRequired?: boolean;
  total?: number;
  currentPage?: number;
  onClickNext?: () => void;
  onClickPrev?: () => void;
}) => {
  const results = total > 1 ? `${total} results` : `${total} result`;
  const isZero = currentPage! - 1 === 0;

  return (
    <div>
      {/* Pagination */}
      <div className={`flex justify-between ${paddingRequired && 'p-3'} mt-2`}>
        <div className='flex-1 text-gray-500'>
          <p>{results}</p>
        </div>
        <div className='flex justify-end'>
          <button
            className='flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            onClick={onClickPrev}
            disabled={isZero}
          >
            <svg
              className='w-3.5 h-3.5 me-2 rtl:rotate-180'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 14 10'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M13 5H1m0 0 4 4M1 5l4-4'
              />
            </svg>
            Previous
          </button>
          <button
            className='flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            onClick={onClickNext}
            disabled={noMoreNextPage}
          >
            Next
            <svg
              className='w-3.5 h-3.5 ms-2 rtl:rotate-180'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 14 10'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M1 5h12m0 0L9 1m4 4L9 9'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
