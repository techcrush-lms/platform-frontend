import AddCohortForm from '@/components/dashboard/cohort/AddCohortForm';
import AddCategoryForm from '@/components/dashboard/product/category/AddCategoryForm';
import PageHeading from '@/components/PageHeading';
import React from 'react';

const AddCohort = () => {
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Add Cohort'
          enableBreadCrumb={true}
          layer2='Cohorts'
          layer2Link='/cohorts'
          layer3='Add Cohort'
          enableBackButton={true}
        />

        <section>
          {/* Add Learning Cohort Form Fields */}
          <AddCohortForm />
        </section>
      </div>
    </main>
  );
};

export default AddCohort;
