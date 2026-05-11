import { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { Inter, Manrope } from 'next/font/google';
import { getURL } from '@/utils/helpers';
import { cookies } from 'next/headers';
import Providers from '@/providers/providers';
import 'styles/main.css';
import { getCurrentUser } from '@/utils/auth-helpers/server';
import { cn } from '@/utils/cn';

const inter = Inter({
  subsets: ['latin', 'cyrillic-ext'],
  variable: '--font-inter',
  display: 'swap'
});

const manrope = Manrope({
  subsets: ['latin', 'cyrillic-ext'],
  variable: '--font-manrope',
  display: 'swap'
});

const title = 'Ukrainia School';
const description = 'Ukrainia School is a school for Ukrainian children.';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  icons: {
    icon: '/logo.png'
  },
  openGraph: {
    title: title,
    description: description
  }
};

export default async function Layout({ children }: PropsWithChildren) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value;

  // Get user data for providers (cached, deduplicated with page.tsx)
  const { user, profileData } = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${theme || 'light'}`}
      suppressHydrationWarning
    >
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head>
      <Providers user={user} userData={profileData}>
        <body
          className={cn(
            inter.className,
            'min-h-full bg-background text-foreground antialiased text-body'
          )}
          suppressHydrationWarning
        >
          {children}
        </body>
      </Providers>
    </html>
  );
}
