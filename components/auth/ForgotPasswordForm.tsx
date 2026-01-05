import React, { useState } from 'react';
import Input from '../ui/Input';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { RequestPasswordResetFormSchema } from '@/lib/schema/auth.schema';
import toast from 'react-hot-toast';
import { requestPasswordReset } from '@/redux/slices/authSlice';
import LoadingIcon from '../ui/icons/LoadingIcon';

const defaultValue = {
  email: '',
};

const ForgotPasswordForm = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [body, setBody] = useState(defaultValue);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBody((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      const { error, value } = RequestPasswordResetFormSchema.validate(body);

      // Handle validation results
      if (error) {
        throw new Error(error.details[0].message);
      }

      const response: any = await dispatch(requestPasswordReset(body));

      if (response.type === 'auth/request-password-reset/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = body.email.trim() !== '';

  return (
    <form className='w-full' onSubmit={handleSubmit}>
      <div className='w-full space-y-4 mb-6 sm:mb-8'>
        <div className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block mb-2 text-sm font-bold text-gray-900'
            >
              Email address
            </label>
            <Input
              type='email'
              name='email'
              placeholder='Enter your business email address'
              className='w-full rounded-lg text-gray-900'
              value={body.email}
              required={true}
              enableDarkMode={false}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <button
        type='submit'
        disabled={!isFormValid || isSubmitting}
        className={`w-full text-sm py-3 px-4 rounded-lg font-medium text-white transition-all ${
          isFormValid
            ? 'bg-primary-main hover:bg-primary-800'
            : 'bg-primary-faded cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <span className='flex items-center justify-center'>
            <LoadingIcon />
            Processing...
          </span>
        ) : (
          'Request'
        )}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
