import { getCurrentUser } from '@/utils/auth-helpers/server';
import { redirect } from 'next/navigation';
import { PublicHomeClient } from './client';
import { PublicLayout } from '@/components/common/RootLayout/PublicLayout';

export default async function HomePage() {
  const { user } = await getCurrentUser();

  if (user) {
    redirect('/admin');
  }

  return (
    <PublicLayout showHeader={true} showDarkModeToggle={false} showFooter={true}>
      <PublicHomeClient />
    </PublicLayout>
  );
}
