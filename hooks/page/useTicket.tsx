import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchTicket } from '@/redux/slices/ticketSlice';

const useTicket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  const { org } = useSelector((state: RootState) => state.org);
  const { ticket, loading } = useSelector((state: RootState) => state.ticket);

  useEffect(() => {
    dispatch(
      fetchTicket({ id: params.id as string, business_id: org?.id })
    ).unwrap();
  }, [dispatch, org]);

  return {
    ticket,
    loading,
  };
};

export default useTicket;
