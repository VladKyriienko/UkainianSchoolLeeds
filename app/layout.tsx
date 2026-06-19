import type { Metadata, Viewport } from 'next';
import { PropsWithChildren, Suspense } from 'react';
import { Inter, Manrope } from 'next/font/google';
import { getURL } from '@/utils/helpers';
import { cookies } from 'next/headers';
import Providers from '@/providers/providers';
import 'styles/main.css';
import { getSessionUser } from '@/lib/auth/server';
import { UserProfileHydrator } from '@/providers/UserProfileHydrator';
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
const themeColor = '#2563EB';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  applicationName: title,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/icons/apple-touch-icon.png'
  },
  themeColor: themeColor,
  openGraph: {
    title: title,
    description: description
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: themeColor
};

export default async function Layout({ children }: PropsWithChildren) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value;

  const { user } = await getSessionUser();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${theme || 'light'}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        {process.env.NODE_ENV === 'development' && (
          <script
            async
            crossOrigin="anonymous"
            src="https://tweakcn.com/live-preview.min.js"
          />
        )}
      </head>
      <body
        className={cn(
          inter.className,
          'min-h-full touch-manipulation bg-background text-foreground antialiased text-body'
        )}
        suppressHydrationWarning
      >
        <Providers user={user} userData={null}>
          {user ? (
            <Suspense fallback={null}>
              <UserProfileHydrator />
            </Suspense>
          ) : null}
          {children}
        </Providers>
      </body>
    </html>
  );
}
