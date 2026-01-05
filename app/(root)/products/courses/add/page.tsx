import AddCourseForm from '@/components/dashboard/product/course/AddCourseForm';
import CourseProgressIndicator from '@/components/dashboard/product/course/CourseProgressIndicator';
import PageHeading from '@/components/PageHeading';
import React from 'react';

const AddCourse = () => {
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Add Course'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/products'
          layer3='Courses'
          layer3Link='/products/courses'
          layer4='Add Course'
          layer4Link='/products/course/add'
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

export default AddCourse;
