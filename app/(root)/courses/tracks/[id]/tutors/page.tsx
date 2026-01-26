'use client';

import TrackProgressIndicator from '@/components/dashboard/product/course/TrackProgressIndicator';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import ThemeDiv from '@/components/ui/ThemeDiv';

import React, { useState } from 'react';
import TutorInfoStep from '@/components/dashboard/TutorInfoStep';
import { useParams, useRouter } from 'next/navigation';
import TutorInfoStepCourseDetails from '@/components/dashboard/TutorInfoStepCourseDetails';

const EditTrackTutors = () => {
  const router = useRouter();
  const params = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const nextPage = () => {
    router.push(`/courses/tracks/${params?.id}/modules`);
  };
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title="Learning Track's Tutor(s)"
          enableBreadCrumb={true}
          layer2='Courses'
          layer3='Learning Tracks'
          layer3Link='/courses/tracks'
          layer4='Tutor(s)'
          enableBackButton={true}
          ctaButtons={
            <div className='flex gap-2 h-10'>
              <Button
                variant='primary'
                className='dark:text-white hover:bg-primary-800 hover:text-white'
                disabled={isSubmitting || loading}
              >
                Next
              </Button>
            </div>
          }
        />

        <section className='mt-4'>
          <TrackProgressIndicator step={2} />
        </section>

        {/* Right Content */}
        <ThemeDiv className='mt-6 p-6'>
          <TutorInfoStepCourseDetails onNext={nextPage} />
        </ThemeDiv>
      </div>
    </main>
  );
};

export default EditTrackTutors;
