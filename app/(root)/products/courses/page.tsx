import CoursesComp from '@/components/dashboard/product/course/Courses';
import PageHeading from '@/components/PageHeading';

import Icon from '@/components/ui/Icon';
import Link from 'next/link';
import React from 'react';

const Courses = () => {
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Courses'
          brief='Create and manage your courses with ease'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/products'
          layer3='Courses'
          layer3Link='/products/courses'
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Link
                href='/products/courses/add'
                className='text-md flex gap-1 bg-primary p-2 px-4 rounded-lg'
              >
                <Icon url='/icons/landing/plus.svg' /> Add Course
              </Link>
            </div>
          }
        />

        <section className='my-4'>
          {/* Courses component */}
          <CoursesComp />
        </section>
      </div>
    </main>
  );
};

export default Courses;
