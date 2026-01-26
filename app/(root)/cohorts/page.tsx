import CohortList from '@/components/dashboard/cohort/CohortList';
import PageHeading from '@/components/PageHeading';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';
import React from 'react';

const Cohorts = () => {
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Cohorts'
          brief='Easily create and manage your learning cohorts'
          enableBreadCrumb={true}
          layer2='Cohorts'
          layer2Link='/cohorts'
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Link
                href='/cohorts/add'
                className='text-md flex gap-1 bg-primary p-2 px-4 rounded-lg'
              >
                <Icon url='/icons/landing/plus.svg' /> Add Cohort
              </Link>
            </div>
          }
        />

        <section className='my-4'>
          <CohortList />
        </section>
      </div>
    </main>
  );
};

export default Cohorts;
