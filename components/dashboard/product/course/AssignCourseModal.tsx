'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import ThemeDiv from '@/components/ui/ThemeDiv';
import { Course } from '@/types/product';
import { useState } from 'react';
import TutorInfoStep from '../../TutorInfoStep';
import { useParams, useRouter } from 'next/navigation';
import useCourse from '@/hooks/page/useCourse';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { viewInvite } from '@/redux/slices/orgSlice';

type AssignCourseModalProps = {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSubmit: (courseId: string) => void;
  isSubmitting?: boolean;
  onNext?: () => void;
};

export const AssignCourseModal = ({
  id,
  isOpen,
  onClose,
  courses,
  onSubmit,
  isSubmitting = false,
  onNext,
}: AssignCourseModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();

  const { course } = useCourse({ id });

  const [selectedCourse, setSelectedCourse] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    onSubmit(selectedCourse);
  };

  const nextPage = async () => {
    onClose();
    onNext?.();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='max-w-xl'>
      <div className='relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg'>
        {/* Close button */}
        <button
          type='button'
          onClick={onClose}
          className='absolute top-0 right-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none'
          aria-label='Close modal'
        >
          <X />
        </button>
        {/* Right Content */}
        <TutorInfoStep course={course!} onNext={nextPage} />
      </div>
    </Modal>
  );
};
