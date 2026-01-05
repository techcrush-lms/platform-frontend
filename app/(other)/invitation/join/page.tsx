'use client';

import React, { Suspense } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import JoinInvitationForm from '@/components/other/JoinInvitationForm';
import useInvite from '@/hooks/page/useInvite';

const shimmer = 'animate-pulse bg-slate-200 rounded';

const ErrorView = () => (
  <>
    <Head>
      <title>Invalid Invitation</title>
    </Head>
    <div className='min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-light text-black-1'>
      <div className='w-full max-w-md text-center bg-white p-8 rounded-xl shadow-lg'>
        <h1 className='text-xl font-semibold text-red-600 mb-4'>
          Invalid or Expired Invitation
        </h1>
        <p className='text-gray-600'>
          The invitation link is either invalid or has expired. Please contact
          your team admin to resend the invite.
        </p>
        <Link
          href='/'
          className='inline-block mt-6 text-primary-main font-medium hover:underline'
        >
          Go back to homepage
        </Link>
      </div>
    </div>
  </>
);

const LoadingView = () => (
  <>
    <div className={`${shimmer} h-[60px] w-[60px]`} />
    <div className={`${shimmer} h-6 w-2/3 mb-2`} />
    <div className={`${shimmer} h-4 w-1/2 mb-6`} />
    <div className={`${shimmer} h-40 w-full rounded-lg`} />
  </>
);

const Logo = ({ loading }: { loading: boolean }) => (
  <Link href='/' className='flex items-center justify-center mb-6 sm:mb-8'>
    {loading ? (
      <div className={`${shimmer} h-[60px] w-[60px]`} />
    ) : (
      <Image
        src='/icons/icon.png'
        width={60}
        height={60}
        alt='Logo icon'
        className='rounded-lg'
        priority
      />
    )}
  </Link>
);

const InvitationContent = ({ invite }: { invite: any }) => (
  <>
    <h1 className='text-xl sm:text-2xl font-bold text-gray-800'>
      Join{' '}
      <span className='text-primary-main'>
        {invite?.business?.business_name}
      </span>
    </h1>

    <p className='text-sm sm:text-base text-gray-600 mt-2 text-center mb-6 max-w-md'>
      {invite?.user ? (
        <span>
          You've been invited to join{' '}
          <span className='font-medium text-gray-800'>
            {invite?.business?.business_name}{' '}
          </span>
          as a collaborator. Click below to accept and get started.
        </span>
      ) : (
        "You're almost there. Just complete the form below to join your team."
      )}
    </p>

    <JoinInvitationForm />
  </>
);

const JoinInvitationContent = () => {
  const { invite, loading, error, errorMsg } = useInvite();

  if (errorMsg || error) {
    return <ErrorView />;
  }

  return (
    <div className='min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-light text-black-1'>
      <Head>
        <title>Join {invite?.business?.business_name || 'Organization'}</title>
      </Head>

      <div className='w-full max-w-2xl border-2 border-white rounded-2xl bg-primary-light p-4 sm:p-8 md:p-10 my-4 sm:my-8 md:my-12'>
        <div className='w-full rounded-2xl p-6 sm:p-8 bg-white flex flex-col items-center justify-center'>
          <Logo loading={loading} />

          {loading ? <LoadingView /> : <InvitationContent invite={invite} />}
        </div>
      </div>
    </div>
  );
};

const JoinInvitation = () => {
  return (
    <Suspense fallback={<LoadingView />}>
      <JoinInvitationContent />
    </Suspense>
  );
};

export default JoinInvitation;
