import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from './profile-form';

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
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching user profile:', profileError);
  }

  // Check authentication provider
  const provider = (user.app_metadata?.provider as string) || 'email';
  const isEmailAuth = provider === 'email';

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <ProfileForm
          user={user}
          userData={userData}
          isEmailAuth={isEmailAuth}
        />
      </div>
    </div>
  );
}
