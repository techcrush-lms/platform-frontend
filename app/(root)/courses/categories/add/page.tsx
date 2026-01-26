import AddCategoryForm from '@/components/dashboard/product/category/AddCategoryForm';
import PageHeading from '@/components/PageHeading';
import React from 'react';

const AddCategory = () => {
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Add Category'
          enableBreadCrumb={true}
          layer2='Courses'
          layer3='Categories'
          layer3Link='/courses/categories'
          layer4='Add Category'
          layer4Link='/courses/categories/add'
          enableBackButton={true}
        />

        <section>
          {/* Learning Category Form Fields */}
          <AddCategoryForm />
        </section>
      </div>
    </main>
  );
};

export default AddCategory;
