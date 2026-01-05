'use client';

import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import React, { useEffect, useState } from 'react';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import Avatar from '@/components/ui/Avatar';
import DeactivateIcon from '@/components/ui/icons/DeactivateIcon';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  deactivateMember,
  reinviteMember,
  removeMember,
  restoreMember,
  viewInvite,
} from '@/redux/slices/orgSlice';
import { ContactInviteStatus, getAvatar } from '@/lib/utils';
import { capitalize } from 'lodash';
import toast from 'react-hot-toast';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import ActivateIcon from '@/components/ui/icons/ActivateIcon';
import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import useInvites from '@/hooks/page/useInvites';
import { IoIosChatboxes } from 'react-icons/io';
import Chat from '@/components/dashboard/chat/Chat';
import { XIcon } from 'lucide-react';

const TeamMember = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { invite } = useSelector((state: RootState) => state.org);
  const { invites, count, loading, onClickNext, onClickPrev } = useInvites();

  const [chatOpen, setChatOpen] = useState(false);

  const [isSubmittingResendInvite, setIsSubmittingResendInvite] =
    useState(false);
  const [isSubmittingRemoveMember, setIsSubmittingRemoveMember] =
    useState(false);
  const [isSubmittingDeactivateMember, setIsSubmittingDeactivateMember] =
    useState(false);
  const [isSubmittingRestoreMember, setIsSubmittingRestoreMember] =
    useState(false);

  const [removeMemberOpenModal, setRemoveMemberOpenModal] = useState(false);
  const [allowRemoveMemberAction, setAllowRemoveMemberAction] = useState(false);

  const [deactivateMemberOpenModal, setDeactivateMemberOpenModal] =
    useState(false);
  const [allowDeactivateMemberAction, setAllowDeactivateMemberAction] =
    useState(false);

  const [restoreMemberOpenModal, setRestoreMemberOpenModal] = useState(false);
  const [allowRestoreMemberAction, setAllowRestoreMemberAction] =
    useState(false);

  const [resendInviteOpenModal, setResendInviteOpenModal] = useState(false);
  const [allowResendInviteAction, setAllowResendInviteAction] = useState(false);

  const handleResendInvite = async () => {
    try {
      setIsSubmittingResendInvite(true);

      // Submit logic here
      const response: any = await dispatch(
        reinviteMember({ invite_id: params?.id as string })
      );

      if (response.type === 'contact/reinvite-member/:invite_id/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmittingResendInvite(false);
    }
  };

  const handleRemoveMember = async () => {
    try {
      setIsSubmittingRemoveMember(true);

      // Submit logic here
      const response: any = await dispatch(
        removeMember({ invite_id: params?.id as string })
      );

      if (response.type === 'contact/remove-member/:invite_id/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
      router.push('/team');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmittingRemoveMember(false);
    }
  };

  const handleDeactivateMember = async () => {
    try {
      setIsSubmittingDeactivateMember(true);

      // Submit logic here
      const response: any = await dispatch(
        deactivateMember({ invite_id: params?.id as string })
      );

      if (response.type === 'contact/deactivate-member/:invite_id/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmittingDeactivateMember(false);
    }
  };

  const handleRestoreMember = async () => {
    try {
      setIsSubmittingRestoreMember(true);

      // Submit logic here
      const response: any = await dispatch(
        restoreMember({ invite_id: params?.id as string })
      );

      if (response.type === 'contact/restore-member/:invite_id/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmittingRestoreMember(false);
    }
  };

  useEffect(() => {
    if (invites) {
      dispatch(viewInvite(params?.id as string));
    }
  }, [dispatch, invites]);

  useEffect(() => {
    if (allowRemoveMemberAction) {
      handleRemoveMember();
      setAllowRemoveMemberAction(false);
    }
  }, [allowRemoveMemberAction]);

  useEffect(() => {
    if (allowDeactivateMemberAction) {
      handleDeactivateMember();
      setAllowDeactivateMemberAction(false);
    }
  }, [allowDeactivateMemberAction]);

  useEffect(() => {
    if (allowRestoreMemberAction) {
      handleRestoreMember();
      setAllowRestoreMemberAction(false);
    }
  }, [allowRestoreMemberAction]);

  useEffect(() => {
    if (allowResendInviteAction) {
      handleResendInvite();
      setAllowResendInviteAction(false);
    }
  }, [allowResendInviteAction]);

  const isSubmitting =
    isSubmittingResendInvite ||
    isSubmittingRemoveMember ||
    isSubmittingDeactivateMember ||
    isSubmittingRestoreMember;

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900 pb-12'>
      <div className='section-container space-y-6'>
        {/* Page Heading */}
        <PageHeading
          title='Team Member'
          brief='Manage your team member'
          enableBreadCrumb
          layer2='Team'
          layer3='Team Member'
          layer2Link='/team'
          enableBackButton
          ctaButtons={
            <div className='flex gap-2'>
              {invite?.user && invite.status === ContactInviteStatus.ACTIVE && (
                <Button
                  variant='primary'
                  className='text-md bg-primary gap-1 py-2 rounded-lg flex items-center px-3'
                  onClick={() => setChatOpen(!chatOpen)}
                >
                  <IoIosChatboxes className='text-lg' />
                  {chatOpen ? 'Close Chat' : 'Chat'}
                </Button>
              )}
              {invite?.status === ContactInviteStatus.PENDING ||
              invite?.status === ContactInviteStatus.EXPIRED ? (
                <Button
                  variant='outline'
                  className='text-md flex p-2 px-4 gap-2 dark:text-white dark:hover:bg-white dark:hover:text-gray-800'
                  onClick={() => setResendInviteOpenModal(true)}
                  disabled={isSubmitting}
                >
                  {isSubmittingResendInvite ? (
                    <span className='flex items-center justify-center'>
                      <LoadingIcon />
                      Processing...
                    </span>
                  ) : (
                    'Resend Invite'
                  )}
                </Button>
              ) : invite?.status === ContactInviteStatus.ACTIVE ? (
                <Button
                  type='button'
                  variant='red'
                  className='text-md flex p-2 px-4 gap-2'
                  onClick={() => setDeactivateMemberOpenModal(true)}
                  disabled={isSubmitting}
                >
                  {isSubmittingDeactivateMember ? (
                    <span className='flex items-center justify-center'>
                      <LoadingIcon />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <DeactivateIcon />
                      Deactivate
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type='button'
                  variant='green'
                  className='text-md flex p-2 px-4 gap-2'
                  onClick={() => setRestoreMemberOpenModal(true)}
                  disabled={isSubmitting}
                >
                  {isSubmittingRestoreMember ? (
                    <span className='flex items-center justify-center'>
                      <LoadingIcon />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <ActivateIcon />
                      Activate
                    </>
                  )}
                </Button>
              )}
            </div>
          }
        />

        {/* Profile Card */}
        <div className='w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6'>
          {/* Header */}
          <div className='flex items-center gap-5'>
            {invite?.user?.profile?.profile_picture ? (
              <Avatar
                src={invite?.user?.profile?.profile_picture!}
                alt={invite?.name!}
                size='xl'
              />
            ) : (
              <img
                src={getAvatar(
                  invite?.user?.profile?.profile_picture!,
                  invite?.name!
                )}
                alt={invite?.name}
                className='w-[100px] h-[100px] rounded-full object-cover'
              />
            )}

            <div>
              <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
                {invite?.name}
              </h2>
              <div className='flex items-center gap-2 mt-1 text-sm'>
                <span className='inline-flex items-center gap-1 text-gray-700 dark:text-gray-200'>
                  {invite?.is_owner && (
                    <MdOutlineAdminPanelSettings className='text-blue-500' />
                  )}
                  <span
                    className={`font-medium py-1 px-3 rounded-full ${
                      invite?.is_owner
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-800/20 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300'
                    }`}
                  >
                    {invite?.is_owner ? 'Admin' : 'Member'}
                  </span>
                </span>
              </div>
            </div>
            <span
              className={`font-medium px-2 py-1 rounded-full ${
                invite?.status === ContactInviteStatus.ACTIVE
                  ? 'bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800/20 dark:text-yellow-400'
              }`}
            >
              {capitalize(invite?.status)}
            </span>
          </div>

          {/* Info Grid */}
          <div className='grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300'>
            <div className='flex items-center gap-2'>
              <FaEnvelope className='text-gray-400 dark:text-gray-500' />
              <span>{invite?.email}</span>
            </div>
            {/* <div className='flex items-center gap-2'>
              <FaPhone className='text-gray-400 dark:text-gray-500' />
              <span>{invite?.}</span>
            </div> */}
            <div className='flex items-center gap-2'>
              <FaCalendarAlt className='text-gray-400 dark:text-gray-500' />
              <span>
                Joined on {new Date(invite?.created_at!).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className='pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3'>
            {/* Later */}
            {/* <Button
              variant='outline'
              className='dark:border-gray-600 dark:text-white'
            >
              Edit Details
            </Button> */}
            <Button
              type='button'
              variant='red'
              onClick={() => setRemoveMemberOpenModal(true)}
              disabled={isSubmitting}
            >
              {isSubmittingRemoveMember ? (
                <span className='flex items-center justify-center'>
                  <LoadingIcon />
                  Processing...
                </span>
              ) : (
                'Remove Member'
              )}
            </Button>
          </div>
        </div>

        <ActionConfirmationModal
          body={`Are you sure you want to remove your team member - ${invite?.name}`}
          openModal={removeMemberOpenModal}
          setOpenModal={setRemoveMemberOpenModal}
          allowAction={allowRemoveMemberAction}
          setAllowAction={setAllowRemoveMemberAction}
        />

        <ActionConfirmationModal
          body={`Are you sure you want to deactivate your team member - ${invite?.name}`}
          openModal={deactivateMemberOpenModal}
          setOpenModal={setDeactivateMemberOpenModal}
          allowAction={allowDeactivateMemberAction}
          setAllowAction={setAllowDeactivateMemberAction}
        />

        <ActionConfirmationModal
          body={`Are you sure you want to restore your team member - ${invite?.name}`}
          openModal={restoreMemberOpenModal}
          setOpenModal={setRestoreMemberOpenModal}
          allowAction={allowRestoreMemberAction}
          setAllowAction={setAllowRestoreMemberAction}
        />

        <ActionConfirmationModal
          body={`Are you sure you want to resend an invitation to this team member - ${invite?.name}`}
          openModal={resendInviteOpenModal}
          setOpenModal={setResendInviteOpenModal}
          allowAction={allowResendInviteAction}
          setAllowAction={setAllowResendInviteAction}
        />

        {invite?.user && chatOpen && (
          <div className='fixed bottom-4 right-4 w-80 max-w-[95vw] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden z-10'>
            <>
              <Chat
                chatbuddyId={invite.user?.id!}
                height='h-[50vh] max-h-[40vh] md:max-h-[30vh] lg:max-h-[38vh]'
                enabledBackButton={false}
                rightSideComponent={
                  <button onClick={() => setChatOpen(false)}>
                    <XIcon />
                  </button>
                }
              />
            </>
          </div>
        )}
      </div>
    </main>
  );
};

export default TeamMember;
