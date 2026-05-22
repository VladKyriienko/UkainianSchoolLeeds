'use client';

import { AuthProvider } from '@/providers/auth-provider';
import { LanguageProvider } from './language-provider';
import { InstallPwaBanner } from '@/components/common/InstallPwaBanner';
import { ScrollToTopOnNavigate } from '@/components/common/ScrollToTopOnNavigate';
import { User } from '@supabase/supabase-js';
import { UserWithRoles } from '@/lib/supabase/server';

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
    <LanguageProvider>
      <AuthProvider userResponse={user} userWithRoles={userData}>
        <ScrollToTopOnNavigate />
        {children}
        <InstallPwaBanner />
      </AuthProvider>
    </LanguageProvider>
  );
}
