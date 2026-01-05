'use client';

import Link from 'next/link';
import { Button } from './ui/Button';
import { IoIosArrowBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { cn, SystemRole } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import OnboardingAlert from './OnboardingAlert';

export interface BreadcrumbLayer {
  title: string;
  href?: string;
}

const PageHeading = ({
  title,
  brief,
  enableBreadCrumb,
  layer1 = 'Dashboard',
  layer2,
  layer3,
  layer4,
  layer2Link,
  layer3Link,
  layer4Link,
  enableBackButton,
  ctaButtons,
  enableBreadCrumbStyle,
}: {
  title?: string | JSX.Element;
  brief?: string | JSX.Element;
  enableBreadCrumb?: boolean;
  layer1?: string;
  layer2?: string;
  layer3?: string;
  layer4?: string;
  layer2Link?: string;
  layer3Link?: string;
  layer4Link?: string;
  enableBackButton?: boolean;
  ctaButtons?: JSX.Element | undefined;
  enableBreadCrumbStyle?: false;
}) => {
  const router = useRouter();
  const { org } = useSelector((state: RootState) => state.org);
  const { profile } = useSelector((state: RootState) => state.auth);

  const goBack = () => {
    router.back();
  };

  return (
    <>
      {/* Onboarding Alert */}
      {org && profile?.role.role_id !== SystemRole.USER && (
        <OnboardingAlert org={org} />
      )}
      <div
        className={cn(
          '',
          enableBreadCrumbStyle && 'dark:bg-black-1 pt-2 pb-6 px-4 rounded-lg'
        )}
      >
        {enableBreadCrumb && (
          <nav className='flex' aria-label='Breadcrumb'>
            <ol className='inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse'>
              {layer1 && (
                <li className='inline-flex items-center'>
                  <Link
                    href={
                      profile?.role.role_id === SystemRole.USER
                        ? '/dashboard/home'
                        : '/home'
                    }
                    className='inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-main dark:text-gray-400 dark:hover:text-white'
                  >
                    <svg
                      className='w-3 h-3 me-2.5'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z' />
                    </svg>
                    {layer4 ? (
                      <>
                        <span className='hidden lg:block' title={layer1}>
                          {layer1}
                        </span>
                        <span className='lg:hidden'>...</span>
                      </>
                    ) : (
                      layer1
                    )}
                  </Link>
                </li>
              )}
              {layer2 && (
                <li>
                  <div className='flex items-center'>
                    <svg
                      className='rtl:rotate-180 w-3 h-3 text-gray-400 mx-1'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 6 10'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m1 9 4-4-4-4'
                      />
                    </svg>
                    <Link
                      href={layer2Link ?? '#'}
                      className='ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white'
                    >
                      {layer4 ? (
                        <>
                          <span className='hidden lg:block' title={layer2}>
                            {layer2}
                          </span>
                          <span className='lg:hidden'>...</span>
                        </>
                      ) : (
                        layer2
                      )}
                    </Link>
                  </div>
                </li>
              )}
              {layer3 && (
                <li aria-current='page'>
                  <div className='flex items-center'>
                    <svg
                      className='rtl:rotate-180 w-3 h-3 text-gray-400 mx-1'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 6 10'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m1 9 4-4-4-4'
                      />
                    </svg>
                    {/* <span className='ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400'> */}
                    <Link
                      href={layer3Link ?? '#'}
                      className='ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white'
                    >
                      {layer4 ? (
                        <>
                          <span className='hidden lg:block' title={layer3}>
                            {layer3}
                          </span>
                          <span className='lg:hidden'>...</span>
                        </>
                      ) : (
                        layer3
                      )}
                    </Link>
                    {/* </span> */}
                  </div>
                </li>
              )}
              {layer4 && (
                <li aria-current='page'>
                  <div className='flex items-center'>
                    <svg
                      className='rtl:rotate-180 w-3 h-3 text-gray-400 mx-1'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 6 10'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m1 9 4-4-4-4'
                      />
                    </svg>
                    <Link
                      href={layer4Link ?? '#'}
                      className='ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white'
                    >
                      {layer4}
                    </Link>
                  </div>
                </li>
              )}
            </ol>
          </nav>
        )}

        <div className='space-y-4 gap-4 mt-5'>
          {enableBackButton && (
            <Button variant='primary' className='p-2 px-3' onClick={goBack}>
              <IoIosArrowBack />
              Go Back
            </Button>
          )}
          <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-1'>
            <div
              className='text-gray-700
dark:text-white mr-auto'
            >
              {title && <h1 className='text-2xl font-bold '>{title}</h1>}
              <p>{brief && brief}</p>
            </div>
            {ctaButtons}
          </div>
        </div>
      </div>
    </>
  );
};

export default PageHeading;
