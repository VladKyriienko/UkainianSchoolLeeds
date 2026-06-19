import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/features/profile/ProfileForm';
import { PageWrapper } from '@/components/common/PageWrapper';
import { USER_PROFILE_COLUMNS } from '@/lib/supabase/columns';

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/auth/login');
  }

  // Fetch user profile data
  const { data: userData, error: profileError } = await supabase
    .from('users')
    .select(USER_PROFILE_COLUMNS)
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching user profile:', profileError);
  }

  // Check authentication provider
  const provider = (user.app_metadata?.provider as string) || 'email';
  const isEmailAuth = provider === 'email';

  return (
    <PageWrapper
      title="Profile"
      description="Manage your account settings and preferences."
    >
      <ProfileForm
        user={user}
        userData={userData}
        isEmailAuth={isEmailAuth}
      />
    </PageWrapper>
  );
}
