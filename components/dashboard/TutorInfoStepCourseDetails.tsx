'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { User } from 'lucide-react';

import AddCustomerSheet from '@/components/dashboard/AddCustomerSheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import useCustomers from '@/hooks/page/useCustomers';
import { PlusCircle, PlusIcon } from 'lucide-react';
import { FaAngleDoubleDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchCustomers, selectCustomer } from '@/redux/slices/orgSlice';
import toast from 'react-hot-toast';
import { prepareInvoiceData } from '@/redux/slices/invoiceSlice';
import Link from 'next/link';
import { listFromNumber, SystemRole } from '@/lib/utils';
import { MultiSelect } from '../ui/MultiSelect';
import { Customer } from '@/types/notification';
import Input from '../ui/Input';
import { handleNumberChange } from '../NumberChange';
import {
  CourseTutorProps,
  UpdateCourseProps,
} from '@/lib/schema/product.schema';
import { useParams } from 'next/navigation';
import { updateCourse } from '@/redux/slices/courseSlice';
import useCourse from '@/hooks/page/useCourse';
import { Course } from '@/types/product';
import TutorInfoStep from './TutorInfoStep';

const TUTOR_SELECTION_STORAGE_KEY = 'selected_tutor';

interface TutorInfoStepProps {
  onNext: () => void;
}

const TutorInfoStepCourseDetails = ({ onNext }: TutorInfoStepProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  const { course } = useCourse({ id: params?.id as string });

  return <TutorInfoStep course={course!} onNext={onNext} />;
};

export default TutorInfoStepCourseDetails;
