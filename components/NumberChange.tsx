import { SetStateAction } from 'react';

export const handleNumberChange = (
  e: any,
  stateFunc: (value: SetStateAction<number | undefined>) => void,
) => {
  const value = e.target.value;

  // allow empty
  if (value === '') {
    stateFunc(value);
    return;
  }

  // only digits
  if (!/^\d+$/.test(value)) return;

  // ❌ disallow 0, 02, 0xxx
  if (value.startsWith('0')) return;

  stateFunc(value);
};
