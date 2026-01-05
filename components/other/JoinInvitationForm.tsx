'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn, getAvatar } from '@/lib/utils';
import { AcceptInviteProps, acceptInviteSchema } from '@/lib/schema/org.schema';
import Input from '../ui/Input';
import { Button } from '../ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { acceptInvite } from '@/redux/slices/orgSlice';
import LoadingIcon from '../ui/icons/LoadingIcon';

const DEFAULT_FORM_VALUES: AcceptInviteProps = {
  name: '',
  password: '',
  token: '',
};

const JoinInvitationForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { invite, loading } = useSelector((state: RootState) => state.org);
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<AcceptInviteProps>({
    ...DEFAULT_FORM_VALUES,
    token: searchParams.get('token') || '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (invite) {
      setIsLoading(false);
    }
  }, [invite]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const submitData = {
        ...formData,
        ...(invite?.user && { name: invite.name }),
        ...(invite?.user && { password: undefined }),
      };

      const { error, value } = acceptInviteSchema.validate(submitData);
      if (error) {
        throw new Error(error.details[0].message);
      }

      const response: any = await dispatch(acceptInvite(submitData));

      if (response.type === 'contact/accept-invite/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
      router.push('/auth/signin');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.password.trim();

  const renderLoadingState = () => (
    <div className='animate-pulse space-y-4'>
      <div className='w-1/2 h-6 bg-gray-300 rounded'></div>
      <div className='w-full h-10 bg-gray-200 rounded'></div>
      <div className='w-full h-10 bg-gray-200 rounded'></div>
      <div className='w-full h-12 bg-gray-300 rounded'></div>
    </div>
  );

  const renderRegisteredUserView = () => (
    <form
      onSubmit={handleSubmit}
      className='max-w-md w-full mx-auto bg-white border border-gray-200 shadow-sm rounded-xl p-6 text-center space-y-4'
    >
      <img
        src={getAvatar(invite?.user?.profile?.profile_picture!, invite?.name!)}
        alt={invite?.name}
        className='w-20 h-20 rounded-full object-cover mx-auto border-2 border-gray-100 shadow-sm'
      />

      <div className='text-xl font-semibold text-gray-800'>{invite?.name}</div>

      <Button type='submit' variant='primary' disabled={isSubmitting}>
        {isSubmitting ? (
          <span className='flex items-center justify-center'>
            <LoadingIcon />
            Processing...
          </span>
        ) : (
          'Join Organization'
        )}
      </Button>
    </form>
  );

  const renderUnregisteredUserView = () => (
    <form onSubmit={handleSubmit} className='w-full'>
      <div className='space-y-4 mb-6 sm:mb-8'>
        <div className='space-y-4'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Name
            </label>
            <Input
              type='text'
              name='name'
              id='name'
              value={formData.name}
              onChange={handleInputChange}
              enableDarkMode={false}
              required
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Password
            </label>
            <div className='relative'>
              <Input
                type={showPassword ? 'text' : 'password'}
                name='password'
                id='password'
                value={formData.password}
                onChange={handleInputChange}
                enableDarkMode={false}
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        type='submit'
        className={cn(
          'w-full py-3 px-4 rounded-lg font-medium text-white transition-all',
          isFormValid
            ? 'bg-primary-main hover:bg-primary-800'
            : 'bg-primary-faded cursor-not-allowed'
        )}
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? (
          <span className='flex items-center justify-center'>
            <LoadingIcon />
            Processing...
          </span>
        ) : (
          'Join Organization'
        )}
      </button>
    </form>
  );

  if (isLoading) {
    return renderLoadingState();
  }

  return (
    <div className='w-full bg-white rounded-lg'>
      {invite?.user ? renderRegisteredUserView() : renderUnregisteredUserView()}
    </div>
  );
};

export default JoinInvitationForm;
