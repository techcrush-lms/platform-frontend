import React, { useEffect, useState } from 'react';
import Input from '../ui/Input';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { RequestPasswordCreationFormSchema } from '@/lib/schema/auth.schema';
import toast from 'react-hot-toast';
import { requestPasswordCreation } from '@/redux/slices/authSlice';
import LoadingIcon from '../ui/icons/LoadingIcon';

const defaultValue = {
  email: '',
};

interface PasswordCreationRequestProps {
  email: string;
}
const PasswordCreationRequestForm = ({
  email,
}: PasswordCreationRequestProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [body, setBody] = useState({ ...defaultValue, email });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0); // countdown in seconds

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBody((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || cooldown > 0) return;

    try {
      setIsSubmitting(true);

      const { error } = RequestPasswordCreationFormSchema.validate(body);
      if (error) throw new Error(error.details[0].message);

      const response: any = await dispatch(requestPasswordCreation(body));

      if (response.type === 'auth/request-password-creation/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);

      // start 60s cooldown after successful request
      setCooldown(60);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // countdown effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const isFormValid = body.email.trim() !== '';
  const isDisabled = !isFormValid || isSubmitting || cooldown > 0;

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
              disabled={body.email ? true : false}
            />
          </div>
        </div>
      </div>

      <button
        type='submit'
        disabled={isDisabled}
        className={`w-full text-sm py-3 px-4 rounded-lg font-medium text-white transition-all ${
          isDisabled
            ? 'bg-primary-faded cursor-not-allowed'
            : 'bg-primary-main hover:bg-primary-800'
        }`}
      >
        {isSubmitting ? (
          <span className='flex items-center justify-center'>
            <LoadingIcon />
            Processing...
          </span>
        ) : cooldown > 0 ? (
          `Retry in ${cooldown}s`
        ) : (
          'Request'
        )}
      </button>
    </form>
  );
};

export default PasswordCreationRequestForm;
