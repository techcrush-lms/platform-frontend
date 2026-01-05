import useStoreCurrencies from '@/hooks/page/useStoreCurrencies';
import { switchCurrency } from '@/redux/slices/currencySlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CurrencySwitcher = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { store_currencies } = useStoreCurrencies();
  const { currency } = useSelector((state: RootState) => state.currency);

  // Set default to the first currency once store_currencies is fetched
  useEffect(() => {
    if (
      store_currencies?.currencies &&
      store_currencies.currencies.length > 0 &&
      !currency
    ) {
      dispatch(switchCurrency(store_currencies.currencies[0]));
    }
  }, [store_currencies, currency, dispatch]);

  return (
    <div className='mx-2'>
      <select
        value={currency}
        onChange={(e) => dispatch(switchCurrency(e.target.value))}
        className='border rounded-md px-2 py-1 text-sm dark:bg-gray-800 dark:text-white'
      >
        {store_currencies?.currencies.map((cur) => (
          <option key={cur} value={cur}>
            {cur}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySwitcher;
