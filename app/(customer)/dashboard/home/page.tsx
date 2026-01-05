'use client';
import SelectOrgModal from '@/components/dashboard/SelectOrgModal';
import ThemeDiv from '@/components/ui/ThemeDiv';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SystemRole } from '@/lib/utils';
import Link from 'next/link';

const QUICK_ACTIONS = [
  {
    label: 'View Products',
    className: 'bg-blue-50 text-primary-main hover:bg-blue-100',
    link: '/dashboard/products', // TODO: Implement action
  },
  {
    label: 'Create New Order',
    className: 'bg-primary-main text-white hover:bg-blue-700',
    link: '/dashboard/cart', // TODO: Implement action
  },
];

const HELP_LINK = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/contact`;

function DashboardCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='bg-white dark:bg-gray-800 border border-neutral-3 dark:border-black-2 rounded-lg shadow p-4 flex flex-col gap-2'>
      <div className='font-medium text-gray-800 mb-2 dark:text-white'>
        {title}
      </div>
      {children}
    </div>
  );
}

const DashboardHome = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { profile } = useSelector((state: RootState) => state.auth);
  const { orgs, org } = useSelector((state: RootState) => state.org);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOrgModal, setShowOrgModal] = useState(false);

  useEffect(() => {
    // Redirect based on role
    if (profile?.role?.role_id === SystemRole.USER) {
      router.replace('/dashboard/home');
    } else if (
      profile?.role?.role_id === SystemRole.BUSINESS_ADMIN ||
      profile?.role?.role_id === SystemRole.BUSINESS_SUPER_ADMIN
    ) {
      router.replace('/home');
    }
    // Show org selection modal if no org is selected
    if (!org && orgs.length > 0) {
      setShowOrgModal(true);
    }
  }, [profile?.role?.role_id, org, orgs, router]);

  // Early return after all hooks are called
  if (!org && orgs.length > 0) {
    return <SelectOrgModal isOpen={true} organizations={orgs} />;
  }

  return (
    <div className='section-container'>
      <div className='h-full'>
        <div className='mx-auto space-y-3 text-black-1 dark:text-white'>
          {/* Welcome Header */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
            <h1 className='text-2xl font-bold'>
              Welcome{profile?.name ? `, ${profile.name}` : ''}!
            </h1>
          </div>

          {/* Organization Info or Prompt */}
          <DashboardCard title='Your Organization'>
            {org ? (
              <div>{org.business_name}</div>
            ) : (
              <div className='text-gray-700 dark:text-gray-300'>
                You are not a member of any organization yet. <br />
                {orgs.length === 0 ? (
                  <span>
                    Contact support or check your invitation email to join an
                    organization.
                  </span>
                ) : (
                  <span>Select an organization to continue.</span>
                )}
              </div>
            )}
          </DashboardCard>

          {/* Dashboard Sections */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            {/* Recent Activity */}
            <DashboardCard title='Recent Activity'>
              <div className='text-gray-500 text-sm dark:text-gray-400'>
                No recent activity yet.
              </div>
            </DashboardCard>

            {/* Quick Actions */}
            <DashboardCard title='Quick Actions'>
              <div className='flex flex-row md:flex-col lg:flex-row md:justify-center lg:justify-start gap-2'>
                {QUICK_ACTIONS.map((action, idx) => (
                  <Link
                    key={action.label}
                    className={`rounded px-4 py-2 text-sm font-medium transition mb-2 ${action.className}`}
                    href={action.link}
                    type='button'
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </DashboardCard>

            {/* Help/Support */}
            <DashboardCard title='Help & Support'>
              <div className='text-gray-500 text-sm dark:text-gray-400'>
                Need help?{' '}
                <a
                  href={HELP_LINK}
                  className='text-primary-main hover:underline'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Visit our Help Center
                </a>
                .
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
