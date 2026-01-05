import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '../useQueryParams';
import { fetchInvoices } from '@/redux/slices/invoiceSlice';
import { InvoiceStatus, RetrievalType } from '@/lib/schema/invoice.schema';

const useInvoices = ({ activeTab }: { activeTab: RetrievalType }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { org } = useSelector((state: RootState) => state.org);
  const { invoices, loading, error, count } = useSelector(
    (state: RootState) => state.invoice
  );

  const {
    currentPage,
    perPage,
    q,
    startDate,
    endDate,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useQueryParams(invoices);

  useEffect(() => {
    const load = () => {
      const filter = {
        ...(activeTab === RetrievalType.DRAFT && {
          status: InvoiceStatus.DRAFT,
        }),
        ...(activeTab === RetrievalType.PUBLISHED && {
          status: InvoiceStatus.PUBLISHED,
        }),
        ...(activeTab === RetrievalType.PAID && { paid: true }),
        ...(activeTab === RetrievalType.UNPAID && { paid: false }),
      };

      dispatch(
        fetchInvoices({
          ...filter,
          ...(org?.id && { business_id: org.id }),
          page: currentPage,
          limit: perPage,
          ...(q && { q }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        })
      ).unwrap();
    };

    load();
  }, [dispatch, currentPage, perPage, q, startDate, endDate, org, activeTab]);

  return {
    q,
    startDate,
    endDate,
    invoices,
    count,
    currentPage,
    perPage,
    loading,
    error,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  };
};

export default useInvoices;
