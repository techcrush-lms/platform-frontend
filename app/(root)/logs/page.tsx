'use client';

import LogsList from '@/components/logs/LogsList';
import PageHeading from '@/components/PageHeading';
import Filter from '@/components/Filter';
import useLogs from '@/hooks/page/useLogs';
import { fetchLogs } from '@/redux/slices/logSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Logs = () => {
  const {
    logs,
    loading,
    count,
    currentPage,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
    onClickNext,
    onClickPrev,
  } = useLogs();

  return (
    <main>
      <header className='section-container'>
        {/* Page heading */}
        <PageHeading title='Logs' enableBreadCrumb={true} layer2='Logs' />
        {/* Filter */}
        <Filter
          searchPlaceholder='Search logs by IP, User agent and Entity'
          showPeriod={false}
          handleSearchSubmit={handleSearchSubmit}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
        />
      </header>
      <section className='section-container-padding-0 mt-2'>
        <div className='overflow-x-auto rounded-none'>
          <div className='relative overflow-x-auto'>
            <LogsList
              logs={logs}
              count={count}
              onClickNext={onClickNext}
              onClickPrev={onClickPrev}
              currentPage={currentPage}
              loading={loading}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Logs;
