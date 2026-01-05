import CreateInvoiceLayout from '@/components/dashboard/invoice/CreateInvoiceLayout';
import PageHeading from '@/components/PageHeading';
import React from 'react';

const CreateInvoice = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container'>
        <PageHeading
          title='Create Invoice'
          brief='Track and manage invoice payments in one place'
          enableBreadCrumb={true}
          layer2='Invoices'
          layer2Link='/invoices'
          layer3='Create'
          enableBackButton={true}
        />

        <section className='my-4'>
          <CreateInvoiceLayout />
        </section>
      </div>
    </main>
  );
};

export default CreateInvoice;
