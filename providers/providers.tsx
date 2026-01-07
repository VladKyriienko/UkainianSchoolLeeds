'use client';

import { AuthProvider } from '@/providers/auth-provider';
import { PostHogProvider } from './posthog-provider';
import { User } from '@supabase/supabase-js';
import { UserWithRoles } from '@/utils/supabase/server';

export default function Providers({
  children,
  user,
  userData,
}: {
  children: React.ReactNode;
  user?: User | null;
  userData?: UserWithRoles | null;
}) {
  return (
    <AuthProvider userResponse={user} userWithRoles={userData}>
      <PostHogProvider>
        {children}
      </PostHogProvider>
    </AuthProvider>
  );
}
