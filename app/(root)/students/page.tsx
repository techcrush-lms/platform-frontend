import CustomersList from '@/components/dashboard/customers/CustomersList';
import PageHeading from '@/components/PageHeading';
import React from 'react';

const Customers = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container space-y-6'>
        {/* Header */}
        <PageHeading
          title='Students Management'
          brief='Monitor student growth and engagement trends over time'
          enableBreadCrumb={true}
          layer2='Students Management'
        />

        <CustomersList />
      </div>
    </main>
  );
};

export default Customers;
