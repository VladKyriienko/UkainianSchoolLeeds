import { PropsWithChildren } from 'react';
import { PublicLayout } from '@/components/common/RootLayout/PublicLayout';
import { Toaster } from '@/components/ui/sonner';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <PublicLayout showHeader={true} showDarkModeToggle={false} showFooter={true}>
        <div className="w-full py-8">{children}</div>
      </PublicLayout>
      <Toaster />
    </>
  );
}
