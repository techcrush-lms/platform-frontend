import { OnboardingProcess, OnboardingStep } from '@/lib/utils';
import React from 'react';
import {
  FaBuilding,
  FaCheckCircle,
  FaCreditCard,
  FaShoppingBag,
  FaUsers,
} from 'react-icons/fa';

export const OnboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    process: OnboardingProcess.BUSINESS_DETAILS,
    title: 'Business Information',
    description: 'Provide your business details to get started',
    icon: <FaBuilding className='w-6 h-6 text-blue-500' />,
    action: 'Complete Profile',
    path: '/settings?tab=business-account',
  },
  {
    id: 2,
    process: OnboardingProcess.KYC,
    title: 'Add KYC Details',
    description: 'Provide your KYC details to unlock full access',
    icon: <FaCheckCircle className='w-6 h-6 text-indigo-500' />,
    action: 'Add KYC',
    path: '/settings?tab=kyc',
  },
  {
    id: 3,
    process: OnboardingProcess.WITHDRAWAL_ACCOUNT,
    title: 'Withdrawal Account',
    description: 'Set up your bank account for receiving payments',
    icon: <FaCreditCard className='w-6 h-6 text-green-500' />,
    action: 'Add Account',
    path: '/settings?tab=bank-account',
  },
  {
    id: 4,
    process: OnboardingProcess.TEAM_MEMBERS_INVITATION,
    title: 'Invite Team Members',
    description: 'Add your team members to collaborate',
    icon: <FaUsers className='w-6 h-6 text-purple-500' />,
    action: 'Invite Team',
    path: '/team',
  },
  {
    id: 5,
    process: OnboardingProcess.PRODUCT_CREATION,
    title: 'Create Your First Product',
    description: 'Start by creating a course, event, or subscription',
    icon: <FaShoppingBag className='w-6 h-6 text-orange-500' />,
    action: 'Create Product',
    path: '/products',
  },
];
