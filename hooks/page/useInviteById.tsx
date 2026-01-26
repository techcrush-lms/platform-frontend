import { AppDispatch, RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { viewInvite } from '@/redux/slices/orgSlice';

const useInviteById = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  const [errorMsg, setErrorMsg] = useState();

  const { invite, loading, error } = useSelector(
    (state: RootState) => state.org,
  );

  useEffect(() => {
    dispatch(viewInvite({ id: params?.id as string })).unwrap();
  }, [dispatch, params]);

  return {
    invite,
    loading,
    error,
    errorMsg,
  };
};

export default useInviteById;
