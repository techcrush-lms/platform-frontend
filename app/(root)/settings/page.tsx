'use client';

import PageHeading from '@/components/PageHeading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FiShield, FiSettings, FiBriefcase } from 'react-icons/fi';
import GeneralSettings from '@/components/settings/GeneralSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import { IoIosBusiness } from 'react-icons/io';
import BankAccountSettings from '@/components/settings/BankAccountSettings';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { SystemRole } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';
import { BsPatchCheck } from 'react-icons/bs';
import BusinessAccountSettings from '@/components/settings/BusinessAccountSettings';
import KYCSettings from '@/components/settings/KYCSettings';
import { Bus, Coins, MapPin } from 'lucide-react';
import CurrenciesSettings from '@/components/settings/CurrenciesSettings';
import ShippingLocationSettings from '@/components/settings/ShippingLocationSettings';

const Settings = () => {
  const { profile } = useSelector((state: RootState) => state.auth);
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab') || 'general';

  const handleTabChange = (value: string) => {
    router.push(`/settings?tab=${value}`);
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
                      value='kyc'
                      className='w-full justify-start px-4 py-3 data-[state=active]:bg-primary-main text-black-1 dark:text-white
                      data-[state=active]:text-white'
                    >
                      <BsPatchCheck className='w-4 h-4' />
                      &nbsp; KYC
                    </TabsTrigger>

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
                    <TabsTrigger
                      value='currencies'
                      className='w-full justify-start px-4 py-3 data-[state=active]:bg-primary-main text-black-1 dark:text-white data-[state=active]:text-white'
                    >
                      <Coins className='w-4 h-4' />
                      &nbsp; Currencies
                    </TabsTrigger>
                    <TabsTrigger
                      value='shipping-locations'
                      className='w-full justify-start px-4 py-3 data-[state=active]:bg-primary-main text-black-1 dark:text-white data-[state=active]:text-white'
                    >
                      <MapPin className='w-4 h-4' />
                      &nbsp; Shipping Locations
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
              {profile?.role.role_id === SystemRole.BUSINESS_SUPER_ADMIN && (
                <>
                  <TabsContent value='kyc'>
                    <KYCSettings />
                  </TabsContent>

                  <TabsContent value='business-account'>
                    <BusinessAccountSettings />
                  </TabsContent>
                  <TabsContent value='bank-account'>
                    <BankAccountSettings />
                  </TabsContent>
                  <TabsContent value='currencies'>
                    <CurrenciesSettings />
                  </TabsContent>
                  <TabsContent value='shipping-locations'>
                    <ShippingLocationSettings />
                  </TabsContent>
                </>
              )}
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
