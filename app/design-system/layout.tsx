import { PropsWithChildren } from 'react';
import { createClient } from '@/utils/supabase/server';
import { PublicLayout } from '@/components/common/RootLayout/PublicLayout';
import { Toaster } from '@/components/ui/sonner';

export default async function Layout({ children }: PropsWithChildren) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // If user is authenticated, they'll see the sidebar from authenticated layout elsewhere
  // For non-authenticated users, show public layout
  if (!user) {
    return (
      <>
        <PublicLayout showHeader={true} showDarkModeToggle={true}>
          {children}
        </PublicLayout>
        <Toaster />
      </>
    );
  }

  // Authenticated users just get the content (sidebar comes from root authenticated layout)
  return <>{children}</>;
}
