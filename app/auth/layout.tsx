import { PropsWithChildren } from 'react';
import { PublicLayout } from '@/components/common/RootLayout/PublicLayout';
import { Toaster } from '@/components/ui/sonner';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <PublicLayout showHeader={true} showNavigation={false} showDarkModeToggle={false}>
        <div className="flex flex-1 h-full items-center justify-center md:p-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </PublicLayout>
      <Toaster />
    </>
  );
}
