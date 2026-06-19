import { getUserProfile } from '@/lib/auth/server';
import { ProfileHydratorClient } from '@/providers/ProfileHydratorClient';

export async function UserProfileHydrator() {
  const profileData = await getUserProfile();
  if (!profileData) return null;
  return <ProfileHydratorClient profileData={profileData} />;
}
