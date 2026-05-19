'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { NavMain } from './NavMain';
import { NavUser } from './NavUser';
import { CompletionBanner } from '@/components/common/CompletionBanner/CompletionBanner';
import DarkModeToggle from '@/components/common/RootLayout/DarkModeToggle';
import LanguageToggle from '@/components/common/RootLayout/LanguageToggle';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/providers/language-provider';
import { BRAND_NAME_LINES } from '@/content/navigation';
import type { CompletionFieldConfig } from '@/lib/auth/completion';
import type { CompletionData } from '@/components/common/CompletionBanner/types';
import type { RouteConfig } from '@/utils/route-protection';

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: User | null | undefined;
  userProfile?:
  | { full_name: string | null; avatar_url: string | null }
  | null
  | undefined;
  isAdmin?: boolean | undefined;
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
  showLanguageToggle?: boolean;
  showSidebarTrigger?: boolean;
  className?: string;
  mobileBurgerPosition?: 'left' | 'right';
};

export function AppSidebar({
  navItems = [],
  completionBannerData,
  showDarkModeToggle = true,
  showSidebarTrigger = false,
  className,
  showLanguageToggle = true,
  mobileBurgerPosition = 'right',
  side: desktopSidebarPosition = 'left',
  ...props
}: AppSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar();
  const { language } = useLanguage();

  const handleMobileClose = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar
      side={isMobile ? mobileBurgerPosition : desktopSidebarPosition}
      collapsible="icon"
      className={cn(className)}
      {...props}
    >
      <SidebarHeader className="border-b border-sidebar-border">
        {/* Expanded state */}
        <div className="flex items-center justify-between p-2 group-data-[collapsible=icon]:hidden">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image src="/logo.png" alt="Ukrainia School" width={32} height={32} className="h-8 w-8 object-contain" />
            <span className="flex flex-col text-xs font-semibold leading-tight text-sidebar-foreground">
              <span>{BRAND_NAME_LINES[language].line1}</span>
              <span>{BRAND_NAME_LINES[language].line2}</span>
            </span>
          </Link>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {showLanguageToggle && <LanguageToggle />}
            {showDarkModeToggle && <DarkModeToggle />}
            {showSidebarTrigger && !isMobile && (
              <SidebarTrigger className="h-8 w-8" />
            )}
            {/* Mobile close button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMobileClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            )}
          </div>
        </div>

        {/* Collapsed state */}
        {!isMobile && (
          <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center gap-2 p-2">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="Ukrainia School" width={32} height={32} className="h-8 w-8 object-contain" />
            </Link>
            {showSidebarTrigger && <SidebarTrigger className="h-8 w-8" />}
          </div>
        )}

        {/* Completion Banner - only show when expanded and data exists */}
        {completionBannerData && (
          <div className="px-2 pb-2 group-data-[collapsible=icon]:hidden">
            <CompletionBanner
              completionData={completionBannerData.completionData}
              settings={completionBannerData.settings}
              postSignupSettings={completionBannerData.postSignupSettings}
              fieldConfig={completionBannerData.fieldConfig}
              variant="sidebar"
              className="border-0 shadow-none"
            />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter className="shrink-0 border-t border-sidebar-border bg-sidebar pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
