'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Coins } from 'lucide-react';
import useCurrencies from '@/hooks/page/useCurrencies';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import {
  toggleBusinessCurrency,
  toggleProductCurrency,
} from '@/redux/slices/currencySlice';

const CurrenciesSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currencies } = useCurrencies();
  const { org } = useSelector((state: RootState) => state.org);

  const [productCurrencies, setProductCurrencies] = useState<string[]>([]);
  const [storeCurrencies, setStoreCurrencies] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleBusinessCurrency = async (currency: string) => {
    try {
      const response = await dispatch(
        toggleBusinessCurrency({ currency, business_id: org?.id! }),
      ).unwrap();

      toast.success(response.message);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleToggleProductCurrency = async (currency: string) => {
    try {
      const response = await dispatch(
        toggleProductCurrency({ currency, business_id: org?.id! }),
      ).unwrap();

      toast.success(response.message);
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className='text-black-1 dark:text-white'>
      <div className='space-y-6'>
        {/* ✅ Products' Enabled Currencies */}
        <Card className='dark:border-gray-600'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Coins className='w-5 h-5 text-indigo-500' />
              Learning Tracks' Enabled Currencies
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              These are the currencies you can set definite prices for when
              creating or updating a learning track. For example, you might sell
              in NGN and GHS, and provide actual prices for both.
            </p>

            <div className='grid grid-cols-2 gap-3'>
              {currencies?.system?.map((currency) => (
                <label
                  key={currency.currency}
                  className='flex items-center gap-2 cursor-pointer'
                >
                  <input
                    type='checkbox'
                    checked={currencies.product.some(
                      (_currency) => _currency.currency === currency.currency,
                    )}
                    onChange={() =>
                      handleToggleProductCurrency(currency.currency)
                    }
                  />
                  <span>{currency.currency}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ✅ Platform Enabled Currencies */}
        <Card className='dark:border-gray-600'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Coins className='w-5 h-5 text-green-500' />
              Platform Enabled Currencies
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              These are the currencies your students can view prices in on your
              checkout page. If you don’t provide a definite price for a
              currency, it will be converted automatically using exchange rates.
            </p>

            <div className='grid grid-cols-2 gap-3'>
              {currencies?.system?.map((currency) => (
                <label
                  key={currency.id}
                  className='flex items-center gap-2 cursor-pointer'
                >
                  <input
                    type='checkbox'
                    checked={currencies.account.some(
                      (_currency) => _currency.currency === currency.currency,
                    )}
                    onChange={() =>
                      handleToggleBusinessCurrency(currency.currency)
                    }
                  />
                  <span>{currency.currency}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurrenciesSettings;
