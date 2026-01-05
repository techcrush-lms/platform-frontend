'use client';

import useProfile from '@/hooks/page/useProfile';
import { SystemRole } from '@/lib/utils';
import { redirect, useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const { profile } = useProfile();

  if (profile) {
    if (profile.role.role_id === SystemRole.USER) {
      return router.push('/dashboard/home');
    }
  }

  return redirect('/home');
}
