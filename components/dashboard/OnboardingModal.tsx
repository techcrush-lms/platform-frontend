import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/progress';
import { Modal } from '@/components/ui/Modal';
import { onboardingProcesses, OnboardingStep } from '@/lib/utils';
import { OnboardingSteps } from '@/components/OnboardingSteps';
import { XCircle } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const OnboardingModal = ({ isOpen, setIsOpen }: OnboardingModalProps) => {
  const router = useRouter();
  const { org } = useSelector((state: RootState) => state.org);

  const processes = onboardingProcesses(org!);

  const steps = OnboardingSteps;

  const handleStepClick = (step: OnboardingStep) => {
    if (step.path) {
      router.push(step.path);
    }
  };

  const getProgressPercentage = () => {
    const completedSteps = steps.filter((step) =>
      processes.includes(step.process)
    ).length;
    return (completedSteps / steps.length) * 100;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title='Welcome to Your Business Dashboard'
      className='max-w-xl w-[95%] sm:w-full'
    >
      {/* X Close Button */}
      <button
        onClick={() => setIsOpen(false)}
        className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors'
      >
        <XCircle className='w-5 h-5' />
      </button>
      <div className=''>
        {/* Progress Bar */}
        <div className='w-full space-y-2'>
          <Progress value={getProgressPercentage()} className='h-2' />
          <p className='text-sm text-right text-gray-800 dark:text-gray-200'>
            {Math.round(getProgressPercentage())}% Complete
          </p>
        </div>

        {/* Steps */}
        <div className='space-y-4 mt-6'>
          {steps.map((step) => (
            <div
              key={step.id}
              className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all ${
                processes.includes(step.process)
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => handleStepClick(step)}
            >
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4'>
                <div className='flex items-start sm:items-center gap-3 sm:gap-4'>
                  <div className='relative flex-shrink-0'>
                    {step.icon}
                    {processes.includes(step.process) && (
                      <FaCheckCircle className='absolute -top-2 -right-2 text-green-500 w-4 h-4' />
                    )}
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900 dark:text-white text-sm sm:text-base'>
                      {step.title}
                    </h4>
                    <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
                      {step.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant={
                    processes.includes(step.process) ? 'outline' : 'primary'
                  }
                  className='w-full sm:w-auto min-w-[120px] text-sm'
                >
                  {processes.includes(step.process) ? 'Completed' : step.action}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default OnboardingModal;
