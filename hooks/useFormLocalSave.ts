import { useEffect, useState } from 'react';

import { SaveState } from '@/lib/utils';

export function useFormLocalSave<T>(key: string, defaultValue: T) {
  const [formData, setFormData] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const [saveStatus, setSaveStatus] = useState<SaveState>(SaveState.IDLE);

  useEffect(() => {
    setSaveStatus(SaveState.SAVING);

    const timeout = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(formData));
      setSaveStatus(SaveState.SAVED);
    }, 400);

    return () => clearTimeout(timeout);
  }, [formData, key]);

  const resetForm = (newValue?: T) => {
    localStorage.removeItem(key);
    setFormData(newValue ?? defaultValue);
    setSaveStatus(SaveState.IDLE);
  };

  return { formData, setFormData, resetForm, saveStatus };
}
