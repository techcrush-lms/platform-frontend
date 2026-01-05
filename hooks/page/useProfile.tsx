import { viewProfile } from '@/redux/slices/authSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useProfile = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { profile, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await dispatch(viewProfile()).unwrap();
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, [dispatch]);

  return {
    profile,
    loading,
    error,
    isAuthenticated: !!profile,
  };
};

export default useProfile;
