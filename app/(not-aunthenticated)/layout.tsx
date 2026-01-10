import { PropsWithChildren } from 'react';
import { PublicLayout } from '@/components/common/RootLayout/PublicLayout';
import { Toaster } from '@/components/ui/sonner';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <PublicLayout showHeader={true} showDarkModeToggle={false} showFooter={true}>
        <div className="flex container mx-auto h-full items-center justify-center p-6">
          <div className="w-full">{children}</div>
        </div>
      </PublicLayout>
      <Toaster />
    </>
  );
}
