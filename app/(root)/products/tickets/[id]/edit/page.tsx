'use client';

import React, { useState, useEffect } from 'react';
import PageHeading from '@/components/PageHeading';

import { IoMdTrash } from 'react-icons/io';
import { Button } from '@/components/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import {
  deleteTicket,
  fetchTicket,
  updateTicket,
} from '@/redux/slices/ticketSlice';
import toast from 'react-hot-toast';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import EditTicketForm from '@/components/dashboard/product/ticket/EditTicketForm';
import useTicket from '@/hooks/page/useTicket';
import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import { cn, ProductStatus } from '@/lib/utils';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import { HiDocumentText, HiPaperAirplane } from 'react-icons/hi';
import { Trash2Icon } from 'lucide-react';

const EditTicket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { ticket, loading } = useTicket();
  const confetti = useConfettiStore();

  const { org } = useSelector((state: RootState) => state.org);

  const [deleteTicketOpenModal, setDeleteTicketOpenModal] = useState(false);
  const [allowAction, setAllowAction] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteTicketNavigation = async () => {
    try {
      setIsSubmitting(true);

      // Submit logic here
      const response: any = await dispatch(
        deleteTicket({
          id: ticket?.id!,
          business_id: org?.id!,
        })
      );

      if (response.type === 'product-ticket-crud/:id/delete/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success('Ticket deleted successfully!');
      router.push(`/products/tickets`);
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!ticket?.id || !org?.id) return;

    const statusUpdate =
      ticket?.status === ProductStatus.PUBLISHED
        ? ProductStatus.DRAFT
        : ProductStatus.PUBLISHED;
    try {
      const response: any = await dispatch(
        updateTicket({
          id: ticket.id as string,
          credentials: {
            status: statusUpdate,
          },
          business_id: org.id,
        })
      ).unwrap();

      if (response.type === 'product-course-crud/:id/update/rejected') {
        throw new Error(response.payload.message);
      }

      if (statusUpdate === ProductStatus.PUBLISHED) {
        confetti.onOpen();
      }

      dispatch(fetchTicket({ id: ticket.id, business_id: org.id }));

      const msg =
        statusUpdate === ProductStatus.PUBLISHED
          ? 'Course published successfully!'
          : 'Course moved to draft successfully.';
      toast.success(msg);
    } catch (error) {
      // console.log(error);

      console.error('Publish error:', error);
      toast.error('Failed to publish course');
    }
  };

  useEffect(() => {
    if (allowAction) {
      handleDeleteTicketNavigation();
      setAllowAction(false);
    }
  }, [allowAction]);

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Edit Ticket'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/products'
          layer3='Tickets'
          layer3Link='/products/tickets'
          layer4='Edit Ticket'
          enableBackButton={true}
          ctaButtons={
            <div className='flex flex-shrink-0 self-start mb-2 gap-2'>
              {ticket?.status === ProductStatus.PUBLISHED && (
                <Button
                  variant={'primary'}
                  className={cn(
                    'dark:text-white hover:text-white hover:bg-primary-800'
                  )}
                  onClick={handlePublish}
                  disabled={loading}
                >
                  {loading ? (
                    <span className='flex items-center justify-center'>
                      <LoadingIcon />
                      Processing...
                    </span>
                  ) : (
                    <span className='flex gap-1 items-center'>
                      <HiDocumentText />
                      Move to draft
                    </span>
                  )}
                </Button>
              )}
              {ticket?.status === ProductStatus.DRAFT && (
                <Button
                  variant={'green'}
                  className={cn('hover:bg-green-800')}
                  onClick={handlePublish}
                  disabled={loading}
                >
                  {loading ? (
                    <span className='flex items-center justify-center'>
                      <LoadingIcon />
                      Processing...
                    </span>
                  ) : (
                    <span className='flex gap-1 items-center'>
                      <HiPaperAirplane />
                      Publish
                    </span>
                  )}
                </Button>
              )}
              {ticket?.ticket?.purchased_tickets!?.length === 0 ? (
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
              ) : (
                <></>
              )}
            </div>
          }
        />

        <EditTicketForm />

        <ActionConfirmationModal
          body={`Are you sure you want to delete your ticket - ${ticket?.title}`}
          openModal={deleteTicketOpenModal}
          setOpenModal={setDeleteTicketOpenModal}
          allowAction={allowAction}
          setAllowAction={setAllowAction}
        />
      </div>
    </main>
  );
};

export default EditTicket;
