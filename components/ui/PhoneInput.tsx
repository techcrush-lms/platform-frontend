'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { cn, countries, DEFAULT_COUNTRY } from '@/lib/utils'; // assuming DEFAULT_COUNTRY = { code: 'NG', dialCode: '+234' }

export default function PhoneInput({
  formData,
  setFormData,
  allowDarkMode = true,
}: {
  formData: any;
  setFormData: any;
  allowDarkMode?: boolean;
}) {
  const defaultCountry =
    countries.find((c) => c.code === (formData.country || DEFAULT_COUNTRY)) ||
    countries.find((c) => c.code === 'NG') ||
    countries[0];

  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);

  useEffect(() => {
    // Ensure the form always has a default phone setup
    if (!formData.phone || !formData.country_dial_code) {
      setFormData((prev: any) => ({
        ...prev,
        country: selectedCountry.code,
        country_dial_code: selectedCountry.dialCode,
        phone: `${selectedCountry.dialCode}`,
      }));
    }
  }, []);

  const handleCountryChange = (e: any) => {
    const newCountry = countries.find(
      (c: any) => c.dialCode === e.target.value
    )!;
    setSelectedCountry(newCountry);

    setFormData((prev: any) => {
      const oldPhone = prev.phone || '';
      const cleaned = oldPhone.replace(/^\+\d+\s*/, '').trim();
      return {
        ...prev,
        country: newCountry.code,
        country_dial_code: newCountry.dialCode,
        phone: `${newCountry.dialCode}${cleaned}`,
      };
    });
  };

  const handlePhoneChange = (e: any) => {
    let value = e.target.value;
    if (!value.startsWith(selectedCountry.dialCode)) {
      value = `${selectedCountry.dialCode}${value.replace(/^\+\d+\s*/, '')}`;
    }
    setFormData((prev: any) => ({ ...prev, phone: value }));
  };

  return (
    <div>
      <Label
        htmlFor='phone'
        className={cn(
          'text-sm font-bold text-gray-900',
          allowDarkMode && 'dark:text-gray-200 font-medium'
        )}
      >
        Phone Number
      </Label>

      <div className='flex'>
        {/* Country selector */}
        <select
          id='country'
          name='country'
          value={selectedCountry.dialCode}
          onChange={handleCountryChange}
          className={cn(
            'rounded-l-md border border-gray-300 bg-gray-50 px-2 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 w-24',
            allowDarkMode && 'dark:border-gray-700 dark:bg-gray-700'
          )}
        >
          {countries.map((country) => (
            <option
              key={country.code}
              value={country.dialCode}
              className='bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100'
            >
              {country.flag} {country.dialCode} {country.code}
            </option>
          ))}
        </select>

        {/* Phone input */}
        <Input
          id='phone'
          name='phone'
          type='tel'
          placeholder={`${selectedCountry.dialCode}9094993341`}
          value={formData.phone}
          onChange={handlePhoneChange}
          className={cn(
            'rounded-l-none flex-1 border border-gray-300 bg-white text-gray-800 focus:border-blue-500 focus:ring-blue-500',
            allowDarkMode &&
              'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
          )}
          enableDarkMode={allowDarkMode}
        />
      </div>
    </div>
  );
}
