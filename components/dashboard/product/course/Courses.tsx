'use client';

import ThemeDiv from '@/components/ui/ThemeDiv';
import React from 'react';
import CourseCard from './CourseCard';
import ProductGridItem from '../ProductGridItem';
import Filter from '@/components/Filter';
import useCourses from '@/hooks/page/useCourses';
import { PAGINATION_LIMIT, ProductStatus, ProductType } from '@/lib/utils';
import ProductGridItemSkeleton from '../ProductGridItemSkeleton';
import Pagination from '@/components/Pagination';
import { useSearchParams } from 'next/navigation';
import { GraduationCapIcon } from 'lucide-react';

const CoursesComp = () => {
  const searchParams = useSearchParams();

  const {
    courses,
    currentPage,
    perPage,
    onClickNext,
    onClickPrev,
    count,
    loading,
    handleSearchSubmit,
    handleRefresh,
    handleFilterByDateSubmit,
  } = useCourses();

  const draftedCourses = courses.filter(
    (course) => course.status === ProductStatus.DRAFT
  );

  return (
    <ThemeDiv className='mt-3 border-0 dark:bg-transparent'>
      <div className=''>
        {/* Header */}
        {loading ? (
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductGridItemSkeleton key={idx} />
            ))}
          </div>
        ) : (
          Boolean(draftedCourses.length) && (
            <>
              <h1 className='text-xl font-semibold leading-8'>Recent Drafts</h1>
              <div className='flex max-w-full overflow-x-auto mb-8 gap-3 scroll-smooth scrollbar-hide'>
                {[...draftedCourses]
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .slice(0, 3)
                  .map((course, index) => (
                    <div key={index} className='flex-shrink-0 w-72 lg:w-1/3'>
                      <CourseCard
                        title={course.title}
                        description={course.description || 'No description'}
                        imageSrc={course.multimedia?.url}
                        progress={course.readiness_percent!}
                        data={course}
                      />
                    </div>
                  ))}
              </div>
            </>
          )
        )}

        {/* Search and Filter - exact replication */}
        <div className='mb-2'>
          <Filter
            pageTitle='All Courses'
            pageTitleClass='text-xl'
            showPeriod={false}
            enableRightSearchBar={true}
            showFullSearchWidth={true}
            handleSearchSubmit={handleSearchSubmit}
            handleFilterByDateSubmit={handleFilterByDateSubmit}
            handleRefresh={handleRefresh}
          />
        </div>

        {/* Course List - exact styling */}
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {loading ? (
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductGridItemSkeleton key={idx} />
              ))}
            </div>
          ) : courses.length > 0 ? (
            courses.map((item, index) => (
              <ProductGridItem
                key={index}
                id={item.id}
                imageSrc={item.multimedia.url}
                title={item.title}
                type={ProductType.COURSE}
                data={item}
              />
            ))
          ) : (
            <div className='col-span-full flex flex-col items-center justify-center py-16 text-center'>
              <GraduationCapIcon className='w-10 h-10 text-gray-500 dark:text-gray-400 mb-2' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                {searchParams.has('q') ? 'No Courses Found' : 'No Courses Yet'}
              </h3>
              <p className='text-gray-500 dark:text-gray-400 max-w-md'>
                {searchParams.has('q')
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : 'Start by creating your first course. You can add educational content, lessons, modules, and resources that students can purchase and access.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && count > PAGINATION_LIMIT && (
          <Pagination
            total={count}
            currentPage={currentPage}
            onClickNext={onClickNext}
            onClickPrev={onClickPrev}
            noMoreNextPage={courses.length === 0}
          />
        )}
      </div>
    </ThemeDiv>
  );
};

export default CoursesComp;
