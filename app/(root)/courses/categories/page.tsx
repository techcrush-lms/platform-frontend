import CategoryList from '@/components/dashboard/product/category/CategoryList';
import TrackList from '@/components/dashboard/product/category/CategoryList';
import PageHeading from '@/components/PageHeading';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';
import React from 'react';

const CourseCategories = () => {
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Categories'
          brief='Create and manage your course categories with ease'
          enableBreadCrumb={true}
          layer2='Courses'
          layer3='Categories'
          layer3Link='/courses/categories'
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Link
                href='/courses/categories/add'
                className='text-md flex gap-1 bg-primary p-2 px-4 rounded-lg'
              >
                <Icon url='/icons/landing/plus.svg' /> Add Category
              </Link>
            </div>
          }
        />

        <section className='my-4'>
          {/* Category List component */}
          <CategoryList />
        </section>
      </div>
    </main>
  );
};

export default CourseCategories;
