import CircularProgress from '@/components/CircularProgress';
import ThemeDivBorder from '@/components/ui/ThemeDivBorder';
import { truncate } from '@/lib/utils';
import { Course } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import { Interface } from 'readline/promises';

interface CourseCardProps {
  title: string;
  description: string;
  imageSrc: string;
  progress: number;
  price?: number;
  data?: Course;
}
const CourseCard = ({
  title,
  description,
  imageSrc,
  progress,
  price,
  data,
}: CourseCardProps) => {
  return (
    <ThemeDivBorder className='flex-1 border border-[#E5E5E7] rounded-xl overflow-hidden flex h-full'>
      {/* Image container - fills left space */}
      <div className='relative w-1/3 min-w-[120px]'>
        <Link href={`/products/courses/${data?.id}/edit`}>
          <Image
            src={imageSrc}
            alt={title}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, 33vw'
          />
        </Link>
      </div>

      {/* Content container - text and progress */}
      <div className='flex-1 p-4 flex flex-col justify-between'>
        <div>
          <Link
            href={`/products/courses/${data?.id}/edit`}
            className='font-medium text-base leading-6 hover:text-primary-300 mb-1'
            title={title}
          >
            {truncate(title, 27)}
          </Link>
          <p className='text-[#86868B] text-sm leading-5 mb-3'>
            {truncate(description, 80)}
          </p>
        </div>

        <CircularProgress percentage={progress} />
      </div>
    </ThemeDivBorder>
  );
};

export default CourseCard;
