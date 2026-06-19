'use client';

import { useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import type { UserWithRoles } from '@/lib/supabase/server';
import { useAuthContext } from '@/providers/auth-provider';

export function AuthSessionHydratorClient({
  user,
  profileData
}: {
  user: User;
  profileData: UserWithRoles | null;
}) {
  const { hydrateSession } = useAuthContext();

  useEffect(() => {
    hydrateSession(user, profileData);
  }, [user, profileData, hydrateSession]);

  return null;
}
