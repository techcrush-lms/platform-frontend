'use client';

import DeleteCohort from '@/components/dashboard/cohort/DeleteCohort';
import EditCohortForm from '@/components/dashboard/cohort/EditCohortForm';
import EditTrackForm from '@/components/dashboard/product/category/EditTrackForm';
import PageHeading from '@/components/PageHeading';
import { useParams } from 'next/navigation';
import React from 'react';
import { HiTrash } from 'react-icons/hi';

const EditCohort = () => {
  const params = useParams();

  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Edit Cohort'
          enableBreadCrumb={true}
          layer2='Cohorts'
          layer2Link='/cohorts'
          layer3='Cohort'
          layer4={'Edit Cohort'}
          layer4Link={`/cohorts/${params.id}`}
          enableBackButton={true}
          ctaButtons={
            <div className='flex'>
              <DeleteCohort />
            </div>
          }
        />

        <section>
          {/* Edit Learning Cohort Form Fields */}
          <EditCohortForm />
        </section>
      </div>
    </main>
  );
};

export default EditCohort;
