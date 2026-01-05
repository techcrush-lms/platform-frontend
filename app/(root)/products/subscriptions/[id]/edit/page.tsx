'use client';

import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import { Trash2Icon } from 'lucide-react';
import React, { useState } from 'react';
import { IoMdTrash } from 'react-icons/io';

const EditSubscription = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTicketOpenModal, setDeleteTicketOpenModal] = useState(false);

  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Edit Subscription'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/products'
          layer3='Subscription'
          enableBackButton={true}
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Button
                variant='red'
                className='flex gap-1'
                onClick={() => setDeleteTicketOpenModal(true)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className='flex items-center justify-center'>
                    <LoadingIcon />
                    Processing...
                  </span>
                ) : (
                  <>
                    <Trash2Icon size={15} />
                    Delete
                  </>
                )}
              </Button>
            </div>
          }
        />
      </div>
    </main>
  );
};

export default EditSubscription;
