import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '../useQueryParams';
import { fetchWithdrawals } from '@/redux/slices/withdrawalSlice';

const useWithdrawals = (limit?: number) => {
    const dispatch = useDispatch<AppDispatch>();

    const { withdrawals, loading, error, count } = useSelector(
        (state: RootState) => state.withdrawal
    );
    const { org } = useSelector((state: RootState) => state.org);

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
    } = useQueryParams(withdrawals);

    useEffect(() => {
        dispatch(
            fetchWithdrawals({
                page: currentPage,
                limit: limit || perPage,
                ...(q && { q }),
                ...(startDate && { startDate }),
                ...(endDate && { endDate }),
                ...(org?.id && { business_id: org.id }),
            })
        ).unwrap();
    }, [dispatch, currentPage, perPage, q, startDate, endDate, org, limit]);

    return {
        withdrawals,
        count,
        loading,
        error,
        onClickNext,
        onClickPrev,
        handleSearchSubmit,
        handleFilterByDateSubmit,
        handleRefresh,
    };
};

export default useWithdrawals;
