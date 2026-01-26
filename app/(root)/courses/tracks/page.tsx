import CoursesComp from '@/components/dashboard/product/course/Courses';
import PageHeading from '@/components/PageHeading';

import Icon from '@/components/ui/Icon';
import Link from 'next/link';
import React from 'react';

const CourseTracks = () => {
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Learning Tracks'
          brief='Create and manage your learning tracks with ease'
          enableBreadCrumb={true}
          layer2='Courses'
          layer3='Tracks'
          layer3Link='/courses/tracks'
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Link
                href='/courses/tracks/add'
                className='text-md flex gap-1 bg-primary p-2 px-4 rounded-lg'
              >
                <Icon url='/icons/landing/plus.svg' /> Add Track
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

export default CourseTracks;
