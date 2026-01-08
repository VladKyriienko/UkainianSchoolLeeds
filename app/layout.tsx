import { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { getURL } from '@/utils/helpers';
import { cookies } from 'next/headers';
import Providers from '@/providers/providers';
import 'styles/main.css';
import { createClient, UserWithRoles } from '@/utils/supabase/server';

const title = 'Ukrainia School';
const description = 'Ukrainia School is a school for Ukrainian children.';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description
  }
};

export default async function Layout({ children }: PropsWithChildren) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value;

  const supabase = createClient();
  let profileData: UserWithRoles | null = null;

  // Get user data for providers
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    // Get user profile data from users table
    profileData = (
      await supabase
        .from('users')
        .select('*, roles(*)')
        .eq('id', user.id)
        .single()
    ).data;
  }

  return (
    <html lang="en" className={theme || 'light'}>
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head>
      <Providers user={user} userData={profileData}>
        <body>{children}</body>
      </Providers>
    </html>
  );
}
