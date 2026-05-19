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
import { cn } from '@/utils/cn';

export type AuthenticatedLayoutProps = {
  children: React.ReactNode;
  navItems?: RouteConfig[] | undefined;
  showLanguageToggle?: boolean;
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
  /** Disable Card lift/shadow on hover (e.g. admin panel). */
  disableCardHover?: boolean;
};

function AuthenticatedLayoutContent({
  children,
  showDarkModeToggle,
  mobileBurgerPosition,
  showLanguageToggle,
  disableCardHover
}: Pick<
  AuthenticatedLayoutProps,
  | 'children'
  | 'showDarkModeToggle'
  | 'mobileBurgerPosition'
  | 'showLanguageToggle'
  | 'disableCardHover'
>) {
  const { isMobile } = useSidebar();

  return (
    <>
      <SidebarInset>
        {/* Mobile Header */}
        {isMobile && (
          <MobileHeader
            showDarkModeToggle={showDarkModeToggle ?? true}
            burgerPosition={mobileBurgerPosition || 'right'}
            showLanguageToggle={showLanguageToggle ?? true}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 md:p-6">
          <div
            className={cn(
              'mx-auto w-full min-w-0 max-w-6xl',
              disableCardHover &&
                '**:data-card:transition-none **:data-card:hover:translate-y-0 **:data-card:hover:shadow-md **:data-card:hover:shadow-primary/5'
            )}
          >
            {children}
          </div>
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
  showLanguageToggle = true,
  defaultOpen = true,
  mobileBurgerPosition = 'right',
  disableCardHover = false
}: AuthenticatedLayoutProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
        navItems={navItems}
        completionBannerData={completionBannerData}
        showDarkModeToggle={showDarkModeToggle}
        showLanguageToggle={showLanguageToggle}
        showSidebarTrigger={true}
        mobileBurgerPosition={mobileBurgerPosition}
      />
      <AuthenticatedLayoutContent
        children={children}
        showDarkModeToggle={showDarkModeToggle}
        mobileBurgerPosition={mobileBurgerPosition}
        showLanguageToggle={showLanguageToggle}
        disableCardHover={disableCardHover}
      />
      <Toaster />
    </SidebarProvider>
  );
}
