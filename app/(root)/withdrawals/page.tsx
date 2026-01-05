'use client';

import WithdrawalList, { RetrievalType } from '@/components/dashboard/withdrawal/WithdrawalList';
import PageHeading from '@/components/PageHeading';
import React from 'react';

const Withdrawals = () => {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="section-container">

                <PageHeading
                    title="Withdrawals"
                    brief="Manage and track all your withdrawals seamlessly"
                    enableBreadCrumb={true}
                    layer2="Withdrawals"
                />

                <WithdrawalList retrieve={RetrievalType.ALL} />
                
            </div>
        </main>
    );
};

export default Withdrawals;
