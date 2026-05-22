'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { NavMain } from './NavMain';
import { NavUser } from './NavUser';
import { InstallPwaMenuButton } from '@/components/common/InstallPwaMenuButton';
import { CompletionBanner } from '@/components/common/CompletionBanner/CompletionBanner';
import DarkModeToggle from '@/components/common/RootLayout/DarkModeToggle';
import LanguageToggle from '@/components/common/RootLayout/LanguageToggle';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/providers/language-provider';
import { BRAND_NAME_LINES } from '@/content/navigation';
import type { AppSidebarProps } from '@/types';

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

  return (
    <Sidebar
      side={isMobile ? mobileBurgerPosition : desktopSidebarPosition}
      collapsible="icon"
      className={cn(className)}
      {...props}
    >
      {!isMobile ? (
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center justify-between p-2 group-data-[collapsible=icon]:hidden">
            <Link
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <Image
                src="/logo.png"
                alt="Ukrainia School"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="flex flex-col text-xs font-semibold leading-tight text-sidebar-foreground">
                <span>{BRAND_NAME_LINES[language].line1}</span>
                <span>{BRAND_NAME_LINES[language].line2}</span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              {showLanguageToggle && <LanguageToggle />}
              {showDarkModeToggle && <DarkModeToggle />}
              {showSidebarTrigger && (
                <SidebarTrigger className="h-8 w-8" />
              )}
            </div>
          </div>

          <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center gap-2 p-2">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Image
                src="/logo.png"
                alt="Ukrainia School"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </Link>
            {showSidebarTrigger && <SidebarTrigger className="h-8 w-8" />}
          </div>

          {completionBannerData ? (
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
          ) : null}
        </SidebarHeader>
      ) : null}

      <SidebarContent
        className={cn(
          isMobile && 'flex-1 overflow-y-auto bg-ukraine-header-bg px-2 pt-4'
        )}
      >
        {isMobile && completionBannerData ? (
          <div className="mb-4">
            <CompletionBanner
              completionData={completionBannerData.completionData}
              settings={completionBannerData.settings}
              postSignupSettings={completionBannerData.postSignupSettings}
              fieldConfig={completionBannerData.fieldConfig}
              variant="sidebar"
              className="border-0 shadow-none"
            />
          </div>
        ) : null}
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter
        className={cn(
          'shrink-0 border-t pb-[max(0.5rem,env(safe-area-inset-bottom))]',
          isMobile
            ? 'border-white/10 bg-ukraine-header-bg'
            : 'border-sidebar-border bg-sidebar'
        )}
      >
        <NavUser />
        {isMobile ? (
          <div className="px-2 pb-2">
            <InstallPwaMenuButton
              variant="public"
              className="border-t-0 pt-2"
              onAction={() => setOpenMobile(false)}
            />
          </div>
        ) : null}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
