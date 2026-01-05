'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Input from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '../theme-toggle';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { UserProfileProps } from '@/lib/schema/auth.schema';
import useProfile from '@/hooks/page/useProfile';
import { saveProfile } from '@/redux/slices/authSlice';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { countries, Gender } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import { uploadImage } from '@/redux/slices/multimediaSlice';
import { capitalize } from 'lodash';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import PhoneInput from '../ui/PhoneInput';

const GeneralSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileData, setFileData] = useState();

  const [formData, setFormData] = useState<UserProfileProps>({
    name: '',
    phone: '',
    country: '',
    profile_picture: '',
    address: '',
    bio: '',
    date_of_birth: null,
    gender: null,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        profile_picture: profile.profile?.profile_picture || '',
        address: profile.profile?.address || '',
        bio: profile.profile?.bio || '',
        date_of_birth: profile.profile?.date_of_birth || null,
        gender: profile.profile?.gender || null,
      });
    }
  }, [profile]);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle file input (profile_picture)
    if (
      e.target instanceof HTMLInputElement &&
      e.target.files &&
      name === 'profile_picture'
    ) {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setPreviewUrl(imageUrl);

        // Create FormData for file upload
        const fileData = new FormData();
        fileData.append('image', file);

        let response: any;
        try {
          response = await dispatch(
            uploadImage({
              form_data: fileData,
            })
          );

          if (response.type === 'multimedia-upload/image/rejected') {
            throw new Error(response.payload.message);
          }

          setFormData({
            ...formData,
            profile_picture: response.payload.multimedia.url,
          });
        } catch (error: any) {
          // console.log(error);
          toast.error(error.message);
        }
      }
      return;
    }

    // Handle all other input types
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response: any = await dispatch(saveProfile(formData));

      if (response.requestStatus === 'rejected')
        throw new Error(response.payload);
      toast.success(response?.payload?.message);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='text-black-1 dark:text-white'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <Card className='dark:border-gray-600'>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <Label htmlFor='profile_picture'>Profile Picture</Label>
              <div className='relative w-20 h-20'>
                <input
                  type='file'
                  id='profile_picture'
                  name='profile_picture'
                  accept='image/*'
                  onChange={handleChange}
                  className='hidden'
                />
                <label htmlFor='profile_picture' className='cursor-pointer'>
                  <div className='w-20 h-20 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600'>
                    {formData.profile_picture ? (
                      <img
                        src={formData.profile_picture}
                        alt='Profile'
                        className='object-cover w-full h-full'
                      />
                    ) : (
                      <div className='flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-700'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='w-8 h-8 text-gray-500'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M5 20h14M12 4v16m8-8H4'
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className='absolute bottom-0 right-0 bg-black/60 rounded-full p-1'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='w-4 h-4 text-white'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                    >
                      <path d='M12 5c-.55 0-1 .45-1 1v1H9.5C8.67 7 8 7.67 8 8.5v1h8v-1c0-.83-.67-1.5-1.5-1.5H13V6c0-.55-.45-1-1-1zm-2 7h4v4h-4v-4zm2 8c-2.76 0-5-2.24-5-5h2a3 3 0 106 0h2c0 2.76-2.24 5-5 5z' />
                    </svg>
                  </div>
                </label>
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div>
                <Label htmlFor='name'>Full Name</Label>
                <Input
                  type='text'
                  id='name'
                  name='name'
                  placeholder='Your name'
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  name='email'
                  placeholder='your@email.com'
                  readOnly
                  value={profile?.email || ''}
                />
              </div>
              {/* <div className='space-y-2'> */}
              {/* <Label
                  htmlFor='phone'
                  className='block text-sm font-medium text-gray-700 dark:text-white'
                >
                  Phone
                </Label> */}
              {/* <div className='flex'>
              
                  <select
                    id='country'
                    name='country'
                    value={formData.country || 'NG'}
                    onChange={handleChange}
                    className='rounded-l-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-2 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 w-16'
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.dialCode}>
                        {country.flag} {country.dialCode}
                      </option>
                    ))}
                  </select>

                
                  <Input
                    id='phone'
                    name='phone'
                    type='tel'
                    placeholder='9094993341'
                    value={formData.phone}
                    onChange={handleChange}
                    className='rounded-l-none flex-1'
                  />
                </div> */}
              <PhoneInput formData={formData} setFormData={setFormData} />
              {/* </div> */}
            </div>
            <div>
              <Label htmlFor='bio'>Bio</Label>
              <Input
                type='text'
                name='bio'
                id='bio'
                placeholder='Tell us about yourself'
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor='gender'>Select gender</Label>
              <Select
                name='gender'
                value={formData.gender || ''}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({
                    ...prev,
                    gender: value as Gender,
                  }))
                }
                required
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select gender' />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Gender).map((g, index) => (
                    <SelectItem key={index} value={g}>
                      {capitalize(g)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='address'>Address</Label>
              <Textarea
                name='address'
                value={formData.address || ''}
                onChange={handleChange as any}
              />
            </div>
          </CardContent>
        </Card>

        <Card className='dark:border-gray-600'>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <Label>Screen Mode</Label>
                <p className='text-sm text-muted-foreground'>
                  Switch between light and dark theme
                </p>
              </div>
              <ThemeToggle />
            </div>
            <Separator />
            <div className='flex items-center justify-between'>
              <div>
                <Label>Language</Label>
                <p className='text-sm text-muted-foreground'>
                  Set your preferred language
                </p>
              </div>
              <div className='w-48'>
                <Input
                  type='text'
                  name='lang'
                  value='English'
                  className='h-10'
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='flex justify-end'>
          <Button size='sm' type='submit' disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={20} className='animate-spin' /> &nbsp; Loading...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;
