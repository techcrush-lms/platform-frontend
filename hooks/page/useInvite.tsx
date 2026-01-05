import { AppDispatch, RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { viewInviteByToken } from '@/redux/slices/orgSlice';

const useInvite = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();

  const [errorMsg, setErrorMsg] = useState();

  const { invite, loading, error } = useSelector(
    (state: RootState) => state.org
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const response: any = await dispatch(
          viewInviteByToken({ token: searchParams.get('token') as string })
        );

        if (response.type === 'contact/invite/:token/rejected') {
          throw new Error(response.payload.message);
        }
      } catch (error: any) {
        // console.log(error);
        setErrorMsg(error.message);
      }
    }

    fetchData();
  }, [dispatch, errorMsg]);

  return {
    invite,
    loading,
    error,
    errorMsg,
  };
};

export default useInvite;
