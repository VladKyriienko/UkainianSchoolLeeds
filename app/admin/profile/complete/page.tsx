import { Suspense } from 'react';
import { checkUserCompletionStatus } from '@/lib/auth/completion';
import { getPostSignupSettings } from '@/lib/auth/settings';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CompleteProfileForm } from './complete-profile-form';
import { FullPageLoader } from '@/components/common/FullPageLoader';
import { CompletionBannerWrapper } from '@/components/common/CompletionBanner/CompletionBannerWrapper';

async function CompleteProfileContent({
  user
}: {
  user: { id: string; email?: string };
}) {
  const supabase = createClient();

  // Check if user has already completed the required action
  const isCompleted = await checkUserCompletionStatus(user.id);

  if (isCompleted) {
    redirect('/');
  }

  // Fetch existing user profile data
  const { data: userData } = await supabase
    .from('users')
    .select('full_name, birthdate')
    .eq('id', user.id)
    .single();

  return (
    <div className="space-y-6">
      {/* Completion Progress Banner */}
      <CompletionBannerWrapper
        userId={user.id}
        variant="card"
        showCompleteProfileButton={false}
      />

      {/* Profile Completion Form */}
      <CompleteProfileForm userData={userData} />
    </div>
  );
}

export default async function CompleteProfilePage() {
  const supabase = createClient();
  const settings = getPostSignupSettings();

  // Check if post-signup completion is required
  if (!settings.requirePostSignupCompletion) {
    redirect('/');
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="flex flex-grow w-full items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <Suspense
          fallback={
            <FullPageLoader
              message="Loading your profile information..."
              size="lg"
              variant="default"
            />
          }
        >
          <CompleteProfileContent user={user} />
        </Suspense>
      </div>
    </div>
  );
}
