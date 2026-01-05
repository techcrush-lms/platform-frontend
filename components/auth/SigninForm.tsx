import React, { useState } from 'react';
import Input from '../ui/Input';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { LoginFormSchema, LoginProps } from '@/lib/schema/auth.schema';
import { login } from '@/redux/slices/authSlice';
import { encryptInput, SystemRole } from '@/lib/utils';
import toast from 'react-hot-toast';
import LoadingIcon from '../ui/icons/LoadingIcon';
import { Eye, EyeOff } from 'lucide-react';
import { socketService } from '@/lib/services/socketService';

const defaultValue = {
  email: '',
  password: '',
};

const SigninForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useSearchParams();

  const router = useRouter();

  const [body, setBody] = useState({
    ...defaultValue,
  } as LoginProps);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBody((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      const { error, value } = LoginFormSchema.validate(body);

      // Handle validation results
      if (error) {
        throw new Error(error.details[0].message);
      }

      const response: any = await dispatch(login(body));

      if (response.type === 'auth/request-account-otp/rejected') {
        throw new Error(response.payload.message);
      }

      // Encrypt input
      const encrypted = encryptInput(JSON.stringify(body));

      const redirect_url = params.get('redirect_url')
        ? `&redirect_url=${params.get('redirect_url')}`
        : '';

      router.push(`/auth/verify-signin?token=${encrypted}${redirect_url}`);
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = body.email.trim() !== '' && body.password.trim() !== '';

  return (
    <>
      <form onSubmit={handleSubmit} className='w-full'>
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
                type='text'
                name='email'
                placeholder='Enter your email address'
                className='w-full rounded-lg text-gray-900'
                value={body.email}
                required={true}
                enableDarkMode={false}
                onChange={handleChange}
              />
            </div>

            <div className='relative'>
              <label
                htmlFor='password'
                className='block mb-2 text-sm font-bold text-gray-900'
              >
                Password
              </label>
              <Input
                type={showPassword ? 'text' : 'password'}
                name='password'
                placeholder='Enter your password'
                className='w-full rounded-lg text-gray-900'
                value={body.password}
                required={true}
                enableDarkMode={false}
                onChange={handleChange}
              />
              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='absolute right-3 top-[70%] -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className='flex justify-end'>
              <Link
                href='/auth/forgot-password'
                className='text-primary-main font-bold'
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>

        <button
          type='submit'
          disabled={!isFormValid || isSubmitting}
          className={`w-full text-sm py-3 px-4 rounded-lg font-medium text-white transition-all ${
            isFormValid
              ? 'bg-primary-main hover:bg-red-800'
              : 'bg-primary-faded cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span className='flex items-center justify-center'>
              <LoadingIcon />
              Processing...
            </span>
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    </>
  );
};

export default SigninForm;
