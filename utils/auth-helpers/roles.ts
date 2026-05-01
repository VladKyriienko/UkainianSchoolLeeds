import type { UserWithRoles } from '@/utils/supabase/server';

/** True if the profile has an `admin` role (used for home redirect and admin guards). */
export function hasAdminRole(profileData: UserWithRoles | null): boolean {
  return (
    profileData?.roles?.some(
      (role: { role: string }) => role.role === 'admin'
    ) ?? false
  );
}

/** True if the profile has a `teacher` role. */
export function hasTeacherRole(profileData: UserWithRoles | null): boolean {
  return (
    profileData?.roles?.some(
      (role: { role: string }) => role.role === 'teacher'
    ) ?? false
  );
}
