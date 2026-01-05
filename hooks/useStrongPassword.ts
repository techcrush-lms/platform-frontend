import { useEffect, useState } from 'react';

type PasswordStrength = {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  specialChar: boolean;
  digit: boolean;
};

interface useStrongPasswordProps {
  password: string;
}
export const useStrongPassword = ({ password }: useStrongPasswordProps) => {
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    length: false,
    lowercase: false,
    uppercase: false,
    specialChar: false,
    digit: false,
  });
  const [passwordScore, setPasswordScore] = useState<number>(0);

  const passwordVerificationInfo = [
    { key: 'length', text: '8+ characters' },
    { key: 'lowercase', text: 'Lowercase letter' },
    { key: 'uppercase', text: 'Uppercase letter' },
    { key: 'specialChar', text: 'Special character' },
    { key: 'digit', text: 'Digit' },
  ];

  const getStrengthColor = () => {
    if (passwordScore <= 1) return 'text-red-500';
    if (passwordScore <= 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStrengthText = () => {
    if (passwordScore <= 1) return 'Very Weak';
    if (passwordScore <= 2) return 'Weak';
    if (passwordScore <= 3) return 'Moderate';
    if (passwordScore <= 4) return 'Strong';
    return 'Very Strong';
  };

  useEffect(() => {
    const strength = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      digit: /\d/.test(password),
    };
    setPasswordStrength(strength);
    setPasswordScore(Object.values(strength).filter(Boolean).length);
  }, [password]);

  return {
    password,
    passwordScore,
    getStrengthColor,
    getStrengthText,
    passwordStrength,
    passwordVerificationInfo,
  };
};
