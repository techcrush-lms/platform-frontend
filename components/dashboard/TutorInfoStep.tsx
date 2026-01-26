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

const TUTOR_SELECTION_STORAGE_KEY = 'selected_tutor';

interface TutorInfoStepProps {
  onNext: () => void;
  course: Course;
}

const TutorInfoStep = ({ onNext, course }: TutorInfoStepProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  const {
    customers: tutors,
    limit,
    currentPage,
  } = useCustomers({ role: SystemRole.TUTOR });

  const { org, selectedCustomerId } = useSelector(
    (state: RootState) => state.org,
  );

  const [classroom, setClassroom] = useState<number>();

  const [waGroups, setWaGroups] = useState<string[]>([]);

  const [selectedTutors, setSelectedTutors] = useState<string[]>([]);

  const hasInitialized = useRef(false);

  const fetchMoreCustomers = async () => {
    dispatch(
      fetchCustomers({
        page: currentPage + 1,
        limit: limit,
        role: SystemRole.TUTOR,
        ...(org?.id && { business_id: org?.id as string }),
      }),
    );
  };

  const tutorsList = tutors.map((tutor) => ({
    value: tutor.id,
    label: `${tutor?.name!} - (${tutor?.email})`,
  }));

  const handleSelectCustomer = (value: string) => {
    dispatch(selectCustomer(value));

    localStorage.setItem(TUTOR_SELECTION_STORAGE_KEY, value);
  };

  const handleContinue = async () => {
    if (!selectedCustomerId) {
      toast.error('Please select a tutor');
      return;
    }

    try {
      const payload: UpdateCourseProps = {
        classroom: +classroom!,
        tutors: selectedTutors.map((value, index) => ({
          tutor_id: value,
          group_link: classroom! > 1 ? waGroups[index] : waGroups[0],
        })),
      };

      const response = await dispatch(
        updateCourse({
          id: course.id,
          credentials: payload,
          business_id: org?.id!,
        }),
      ).unwrap();

      toast.success('Learning track saved successfully.');

      onNext();
    } catch (error) {
      // console.log(error);

      console.error('Publish error:', error);
      toast.error('Failed to update/save learning track');
    }
  };

  const handleClassroomChange = (e: any) => {
    handleNumberChange(e, setClassroom);
  };

  useEffect(() => {
    if (course) {
      setClassroom(course.classroom);

      setWaGroups(course.tutors?.map((tutor) => tutor.group_link!));
    }
  }, [course]);

  useEffect(() => {
    if (!course?.tutors || hasInitialized.current) return;

    setSelectedTutors(
      course?.tutors!.map((t: CourseTutorProps) => t.tutor_id!).filter(Boolean),
    );

    hasInitialized.current = true;
  }, [course, selectedTutors]);

  useEffect(() => {
    const savedCustomerId = localStorage.getItem(TUTOR_SELECTION_STORAGE_KEY);

    if (savedCustomerId && savedCustomerId !== selectedCustomerId) {
      dispatch(selectCustomer(savedCustomerId));
    }
  }, []);

  useEffect(() => {
    if (!classroom) return;

    if (classroom > selectedTutors.length) {
      toast.error('Classrooms cannot exceed number of tutors');
      setClassroom(selectedTutors.length);
    }

    setWaGroups((prev) =>
      Array.from({ length: classroom }, (_, index) => {
        return course?.tutors?.[index]?.group_link ?? prev[index] ?? '';
      }),
    );
  }, [classroom, course]);

  return (
    <section className='space-y-8'>
      {/* Header */}
      <div>
        <h2 className='text-xl font-semibold tracking-tight text-foreground'>
          Tutor Information
        </h2>
        <p className='mt-1 text-sm text-muted-foreground'>
          Choose one or more tutors from the existing list, or add a new tutor.
        </p>
      </div>

      {/* Select Box Area */}
      <div className='space-y-3 max-w-md'>
        <Label>
          Tutor <span className='text-red-500'>*</span>
        </Label>

        <MultiSelect
          options={tutorsList}
          onValueChange={setSelectedTutors}
          value={selectedTutors}
          placeholder='Select tutors'
          variant='inverted'
          animation={2}
          maxCount={3}
        />
      </div>

      <div className='space-y-3 max-w-md'>
        <Label>
          Classroom(s) <span className='text-red-500'>*</span>
        </Label>
        <Input
          type='number'
          inputMode='numeric'
          name='classroom'
          placeholder='Enter the classroom for this track'
          className='w-full border rounded-md px-4 text-gray-600 dark:text-white placeholder-gray-400 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-bold'
          value={classroom}
          onChange={handleClassroomChange}
          required
        />
        {classroom! > 1 && (
          <small>
            Paid students would be evenly distributed in these classrooms
          </small>
        )}
      </div>

      {/* WA Group link(s) */}
      {classroom! > 0 && (
        <div>
          <h2 className='text-xl font-semibold tracking-tight text-foreground'>
            Learning Group Information
          </h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Add links to the learning group(s) that enrolled students would be
            added in.
          </p>
        </div>
      )}

      {classroom! > 0 && (
        <div className='grid grid-cols-2 gap-2'>
          {waGroups.map((value, index) => (
            <div key={index} className='space-y-3'>
              <Label>
                Whatsapp Group Link {classroom! > 1 && index + 1}{' '}
                <span className='text-red-500'>*</span>
              </Label>

              <Input
                type='text'
                name={`wa_group_${index + 1}`}
                placeholder='Enter the link'
                value={value}
                onChange={(e) => {
                  const updated = [...waGroups];
                  updated[index] = e.target.value;
                  setWaGroups(updated);
                }}
                required
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className='flex justify-end pt-6 border-border'>
        <Button
          variant='primary'
          onClick={handleContinue}
          className='min-w-[120px]'
        >
          Save and Continue
        </Button>
      </div>
    </section>
  );
};

export default TutorInfoStep;
