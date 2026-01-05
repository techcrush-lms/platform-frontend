'use client';

import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();
  return router.push('/dashboard/home');
};

export default page;
