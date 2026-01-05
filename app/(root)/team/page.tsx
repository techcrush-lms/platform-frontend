'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal'; // Assuming you have one
import Input from '@/components/ui/Input'; // Assuming you have one
import useInvites from '@/hooks/page/useInvites';
import TeamList from '@/components/dashboard/team/TeamList';
import Pagination from '@/components/Pagination';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { ContactInvite } from '@/types/org';
import {
  InviteContactProps,
  inviteContactSchema,
} from '@/lib/schema/org.schema';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchInvites,
  inviteMember,
  setOnboardingStep,
  updateOnboardingProcess,
} from '@/redux/slices/orgSlice';
import toast from 'react-hot-toast';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import { BusinessOwnerOrgRole, OnboardingProcess } from '@/lib/utils';

const defaultValue: InviteContactProps = {
  email: '',
  name: '',
  business_id: '',
};

const Team = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { invites, count, loading, onClickNext, onClickPrev } = useInvites();
  const { org } = useSelector((state: RootState) => state.org);

  const [body, setBody] = useState<InviteContactProps>({
    ...defaultValue,
    business_id: org?.id!,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [members, setMembers] = useState<ContactInvite[]>([]);
  const [isInviteOpen, setInviteOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBody((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemove = (email: string) => {
    setMembers(members.filter((m) => m.email !== email));
  };

  const isFormValid = body.email.trim() !== '' && body.name.trim() !== '';

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      const { error, value } = inviteContactSchema.validate(body);
      if (error) throw new Error(error.details[0].message);

      // Submit logic here
      const response = await dispatch(
        inviteMember({
          ...body,
        })
      ).unwrap();

      // Update onboarding process
      if (
        !org?.onboarding_status.onboard_processes?.includes(
          OnboardingProcess.TEAM_MEMBERS_INVITATION
        )
      ) {
        await dispatch(
          updateOnboardingProcess({
            business_id: org?.id!,
            process: OnboardingProcess.TEAM_MEMBERS_INVITATION,
          })
        ).unwrap();
      }

      toast.success(response.message);
      setInviteOpen(false);
      setBody({ ...body, name: '', email: '' });

      // Fetch
      dispatch(
        fetchInvites({
          role: BusinessOwnerOrgRole.BUSINESS_ADMIN,
          ...(org?.id && { business_id: org.id }),
        })
      ).unwrap();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container space-y-6'>
        {/* Page Heading */}
        <PageHeading
          title='Team'
          brief='Manage your team members'
          enableBreadCrumb={true}
          layer2='Team'
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Button
                variant='primary'
                className=' text-md flex p-2 px-4 gap-2'
                onClick={() => setInviteOpen(true)}
              >
                <Icon url='/icons/landing/plus.svg' />
                Invite
              </Button>
            </div>
          }
        />

        <TeamList loading={loading} />

        {!loading && (
          <Pagination
            paddingRequired={false}
            total={count}
            onClickNext={onClickNext}
            onClickPrev={onClickPrev}
            noMoreNextPage={invites.length === 0}
          />
        )}

        {/* Invite Modal */}
        <Modal
          isOpen={isInviteOpen}
          onClose={() => setInviteOpen(false)}
          title='Invite Team Member'
        >
          <form className='space-y-4' onSubmit={handleAddMember}>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Name
              </label>
              <Input
                type='text'
                name='name'
                placeholder='Enter name'
                value={body.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Email Address
              </label>
              <Input
                type='email'
                name='email'
                placeholder='Enter email'
                value={body.email}
                onChange={handleChange}
              />
            </div>

            <div className='flex justify-end gap-2 mt-4'>
              <Button
                type='button'
                variant='outline'
                className='dark:border-gray-600 dark:text-white text-gray-600'
                onClick={() => setInviteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant='primary'
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <span className='flex items-center justify-center'>
                    <LoadingIcon />
                    Processing...
                  </span>
                ) : (
                  'Send Invite'
                )}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </main>
  );
};

export default Team;
