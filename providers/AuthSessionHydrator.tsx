import { getCurrentUser } from '@/lib/auth/server';
import { AuthSessionHydratorClient } from '@/providers/AuthSessionHydratorClient';

/** Loads session + profile inside Suspense so the root layout shell is not blocked. */
export async function AuthSessionHydrator() {
  const { user, profileData } = await getCurrentUser();
  if (!user) return null;
  return <AuthSessionHydratorClient user={user} profileData={profileData} />;
}
