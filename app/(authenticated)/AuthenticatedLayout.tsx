'use client';

import * as React from 'react';
import { AppSidebar } from '@/components/common/AppSidebar/AppSidebar';
import { MobileHeader } from '@/components/common/RootLayout/MobileHeader';
import {
  SidebarInset,
  SidebarProvider,
  useSidebar
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import type { CompletionFieldConfig } from '@/utils/auth-helpers/completion';
import type { CompletionData } from '@/components/common/CompletionBanner/types';
import { RouteConfig } from '@/utils/route-protection';

export type AuthenticatedLayoutProps = {
  children: React.ReactNode;
  navItems?: RouteConfig[] | undefined;
  completionBannerData?:
    | {
        completionData: CompletionData;
        settings: {
          showCompletionBanner: boolean;
        };
        postSignupSettings: {
          requirePostSignupCompletion: boolean;
          postSignupCompletionPath: string;
        };
        fieldConfig: CompletionFieldConfig[];
      }
    | null
    | undefined;
  showDarkModeToggle?: boolean;
  defaultOpen?: boolean;
  mobileBurgerPosition?: 'left' | 'right';
};

function AuthenticatedLayoutContent({
  children,
  showDarkModeToggle,
  mobileBurgerPosition
}: Pick<
  AuthenticatedLayoutProps,
  'children' | 'showDarkModeToggle' | 'mobileBurgerPosition'
>) {
  const { isMobile } = useSidebar();

  return (
    <>
      <SidebarInset>
        {/* Mobile Header */}
        {isMobile && (
          <MobileHeader
            showDarkModeToggle={showDarkModeToggle || true}
            burgerPosition={mobileBurgerPosition || 'right'}
          />
        )}

        <div className="flex container flex-1 flex-col gap-4 p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </>
  );
}

export function AuthenticatedLayout({
  children,
  navItems,
  completionBannerData,
  showDarkModeToggle = true,
  defaultOpen = true,
  mobileBurgerPosition = 'right'
}: AuthenticatedLayoutProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
        navItems={navItems}
        completionBannerData={completionBannerData}
        showDarkModeToggle={showDarkModeToggle}
        showSidebarTrigger={true}
        mobileBurgerPosition={mobileBurgerPosition}
      />
      <AuthenticatedLayoutContent
        children={children}
        showDarkModeToggle={showDarkModeToggle}
        mobileBurgerPosition={mobileBurgerPosition}
      />
      <Toaster />
    </SidebarProvider>
  );
}
