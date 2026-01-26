import AddCourseForm from '@/components/dashboard/product/course/AddCourseForm';
import CourseProgressIndicator from '@/components/dashboard/product/course/TrackProgressIndicator';
import PageHeading from '@/components/PageHeading';
import React from 'react';

const AddTrack = () => {
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Add Learning Track'
          enableBreadCrumb={true}
          layer2='Courses'
          layer3='Tracks'
          layer3Link='/courses/tracks'
          layer4='Add Learning Track'
          layer4Link='/courses/tracks/add'
          enableBackButton={true}
        />

        <section>
          {/* Step Progress Indicator */}
          <CourseProgressIndicator />

          {/* Course Form Fields */}
          <AddCourseForm />
        </section>
      </div>
    </main>
  );
};

export default AddTrack;
