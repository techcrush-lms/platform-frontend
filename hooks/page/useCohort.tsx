import { fetchCohort } from '@/redux/slices/cohortSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useCohort = () => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  let { cohort, loading } = useSelector((state: RootState) => state.cohort);
  const { org } = useSelector((state: RootState) => state.org);

  useEffect(() => {
    dispatch(
      fetchCohort({
        id: params?.id as string,
      }),
    );
  }, [dispatch, org]);

  return {
    cohort,
    loading,
  };
};

export default useCohort;
