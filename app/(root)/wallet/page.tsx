'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import { CiBank } from 'react-icons/ci';
import { FaArrowDown, FaArrowUp, FaListUl, FaWallet } from 'react-icons/fa6';
import { cn, formatMoney, SystemRole } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import usePayments from '@/hooks/page/usePayments';
import PaymentList from '@/components/dashboard/payment/PaymentList';
import useOrg from '@/hooks/page/useOrg';
import WithdrawalList from '@/components/dashboard/withdrawal/WithdrawalList';
import WithdrawalModal from '@/components/dashboard/withdrawal/WithdrawalModal';
import WalletStats from '@/components/dashboard/wallet/WalletStats';

const Wallet = () => {
  const { org: organization } = useSelector((state: RootState) => state.org);
  const { org } = useOrg(organization?.id!);
  const { profile } = useSelector((state: RootState) => state.auth);

  const {
    payments,
    loading,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
    count,
  } = usePayments();

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container space-y-6'>
        <PageHeading
          title='Wallet'
          brief='Track and access your funds effortlessly'
          enableBreadCrumb={true}
          layer2='Wallet'
          // ctaButtons={
          //   <div
          //     className={cn(
          //       'flex-shrink-0 self-start',
          //       profile?.role?.role_id !== SystemRole.BUSINESS_SUPER_ADMIN &&
          //         'hidden'
          //     )}
          //   >
          //     <Button
          //       variant='primary'
          //       className='text-md gap-2 py-2 rounded-lg'
          //     >
          //       <CiBank className='text-lg' />
          //       Withdraw Funds
          //     </Button>
          //   </div>
          // }
        />

        {/* Wallet Stat Cards */}

        {profile?.role?.role_id === SystemRole.BUSINESS_SUPER_ADMIN && (
          <WalletStats />
        )}

        {/* Payments and Withdrawals */}
        <PaymentList
          payments={payments}
          loading={loading}
          onClickNext={onClickNext}
          onClickPrev={onClickPrev}
          handleSearchSubmit={handleSearchSubmit}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
          count={count}
        />

        <WithdrawalList />
      </div>
    </main>
  );
};

export default Wallet;
