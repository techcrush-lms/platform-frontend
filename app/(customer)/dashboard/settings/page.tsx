'use client';

import PageHeading from '@/components/PageHeading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FiShield, FiSettings, FiBriefcase } from 'react-icons/fi';
import GeneralSettings from '@/components/settings/GeneralSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import { IoIosBusiness } from 'react-icons/io';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { SystemRole } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Settings = () => {
  const { profile } = useSelector((state: RootState) => state.auth);
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab') || 'general';

  const handleTabChange = (value: string) => {
    const route =
      profile?.role.role_id === SystemRole.USER
        ? `/dashboard/settings?tab=${value}`
        : `/settings?tab=${value}`;
    router.push(route);
  };

  return (
    <main className='min-h-screen'>
      <header className='section-container pt-6 pb-4'>
        <PageHeading
          title='Settings'
          enableBreadCrumb={true}
          layer2='Settings'
        />
      </header>

      <section className='section-container-pt-0 '>
        <Tabs value={tab} onValueChange={handleTabChange} className='w-full'>
          <div className='flex flex-col lg:flex-row gap-6'>
            {/* Sidebar Navigation */}
            <div className='w-full lg:w-64 shrink-0'>
              <TabsList className='flex flex-col h-auto p-2 bg-background'>
                <TabsTrigger
                  value='general'
                  className='w-full justify-start px-4 py-3 data-[state=active]:bg-primary-main text-black-1 dark:text-white data-[state=active]:text-white'
                >
                  <FiSettings className='w-4 h-4' />
                  &nbsp; General
                </TabsTrigger>
                {profile?.role.role_id === SystemRole.BUSINESS_SUPER_ADMIN && (
                  <>
                    <TabsTrigger
                      value='business-account'
                      className='w-full justify-start px-4 py-3 data-[state=active]:bg-primary-main text-black-1 dark:text-white data-[state=active]:text-white'
                    >
                      <FiBriefcase className='w-4 h-4' />
                      &nbsp; Business Account
                    </TabsTrigger>
                    <TabsTrigger
                      value='bank-account'
                      className='w-full justify-start px-4 py-3 data-[state=active]:bg-primary-main text-black-1 dark:text-white data-[state=active]:text-white'
                    >
                      <IoIosBusiness className='w-4 h-4' />
                      &nbsp; Bank Account
                    </TabsTrigger>
                  </>
                )}
                <TabsTrigger
                  value='security'
                  className='w-full justify-start px-4 py-3 data-[state=active]:bg-primary-main text-black-1 dark:text-white data-[state=active]:text-white'
                >
                  <FiShield className='w-4 h-4' />
                  &nbsp; Security
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Main Content Area */}
            <div className='flex-1'>
              <TabsContent value='general'>
                <GeneralSettings />
              </TabsContent>

              <TabsContent value='security'>
                <SecuritySettings />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </section>
    </main>
  );
};

export default Settings;
