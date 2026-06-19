'use client';

import { useEffect } from 'react';
import type { UserWithRoles } from '@/lib/supabase/server';
import { useAuthContext } from '@/providers/auth-provider';

export function ProfileHydratorClient({
  profileData
}: {
  profileData: UserWithRoles;
}) {
  const { hydrateProfile } = useAuthContext();

  useEffect(() => {
    hydrateProfile(profileData);
  }, [profileData, hydrateProfile]);

  return null;
}
