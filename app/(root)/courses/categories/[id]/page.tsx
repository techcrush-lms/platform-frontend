'use client';

import EditTrackForm from '@/components/dashboard/product/category/EditTrackForm';
import PageHeading from '@/components/PageHeading';
import { useParams } from 'next/navigation';
import React from 'react';

const EditTrack = () => {
  const params = useParams();
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Edit Track'
          enableBreadCrumb={true}
          layer2='Courses'
          layer3='Track'
          layer3Link='/courses/tracks'
          layer4={'Edit Track'}
          layer4Link={`/courses/tracks/${params.id}`}
          enableBackButton={true}
        />

        <section>
          {/* Learning Track Form Fields */}
          <EditTrackForm />
        </section>
      </div>
    </main>
  );
};

export default EditTrack;
