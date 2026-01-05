'use client';

import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

interface CourseProgressIndicator {
  step?: number;
}
const CourseProgressIndicator = ({ step = 1 }: CourseProgressIndicator) => {
  const params = useParams();
  const router = useRouter();

  const openStepPage = (newStep: number) => {
    const path = `/products/courses/${params.id}`;
    if (params?.id) {
      if (newStep === 1) {
        router.push(`${path}/edit`);
      } else if (newStep === 2) {
        router.push(`${path}/contents`);
      } else if (newStep === 3) {
        router.push(`${path}/preview`);
      }
    }
  };

  return (
    <>
      <div className='flex items-center justify-between mx-auto mt-2 md:mt-0 mb-2'>
        <div className='flex flex-1 items-center'>
          <div className='flex flex-col'>
            <div
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-full font-semibold border-2 border-primary-main text-primary-main',
                (step === 1 || step === 2 || step === 3) &&
                  'bg-primary-main text-white',
                params?.id && 'hover:cursor-pointer'
              )}
              onClick={openStepPage.bind(this, 1)}
            >
              1
            </div>
          </div>
          <div
            className={cn(
              'flex-1 h-px mx-2 bg-gray-600',
              (step === 1 || step === 2 || step === 3) && 'bg-gray-300'
            )}
          ></div>
        </div>

        <div className='flex flex-1 items-center'>
          <div className='flex flex-col'>
            <div
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-full font-semibold border-2 border-primary-main text-primary-main',
                (step === 2 || step === 3) && 'bg-primary-main text-white',
                params?.id && 'hover:cursor-pointer'
              )}
              onClick={openStepPage.bind(this, 2)}
            >
              2
            </div>
          </div>
          <div
            className={cn(
              'flex-1 h-px mx-2 bg-gray-600',
              (step === 2 || step === 3) && 'bg-gray-300'
            )}
          ></div>
        </div>
        <div className='flex flex-1 items-center '>
          <div className='flex flex-col'>
            <div
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-full font-semibold border-2 border-primary-main text-primary-main',
                step === 3 && 'bg-primary-main text-white',
                params?.id && 'hover:cursor-pointer'
              )}
              onClick={openStepPage.bind(this, 3)}
            >
              3
            </div>
          </div>
          <div
            className={cn(
              'flex-1 h-px mx-2 bg-gray-600',
              step === 3 && 'bg-gray-300'
            )}
          ></div>
        </div>
      </div>
      <div className='flex items-center justify-between mx-auto mb-2'>
        <div className='flex flex-1 items-center'>
          <div className='flex flex-col'>
            <div
              className={cn(
                'w-full flex items-center justify-center font-semibold text-sm md:text-base',
                (step === 1 || step === 2 || step === 3) && 'dark:text-white'
              )}
            >
              Course Landing
            </div>
          </div>
        </div>

        <div className='flex flex-1 items-center'>
          <div className='flex flex-col'>
            <div
              className={cn(
                'w-full flex items-center justify-center text-sm md:text-base font-semibold',
                (step === 2 || step === 3) && 'dark:text-white'
              )}
            >
              Course Content
            </div>
          </div>
        </div>
        <div className='flex flex-1 items-center '>
          <div className='flex flex-col'>
            <div
              className={cn(
                'w-full flex items-center justify-center text-sm md:text-base font-semibold',
                step === 3 && 'dark:text-white'
              )}
            >
              Preview
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseProgressIndicator;
