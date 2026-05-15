'use client';

import * as React from 'react';
import { PublicNavBar } from './PublicNavBar';
import { PublicFooter } from './PublicFooter';
import { cn } from '@/utils/cn';
import { CookieConsentPopup } from '@/components/common/CookieConsentPopup';

export type PublicLayoutProps = {
  children: React.ReactNode;
  showHeader?: boolean;
  showDarkModeToggle?: boolean;
  showFooter?: boolean;
  showNavigation?: boolean;
};

export function PublicLayout({
  children,
  showHeader = true,
  showDarkModeToggle = true,
  showFooter = false,
  showNavigation = true
}: PublicLayoutProps) {
  const [sheetPortalContainer, setSheetPortalContainer] = React.useState<HTMLDivElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const sheetPortalRef = React.useCallback((node: HTMLDivElement | null) => {
    setSheetPortalContainer(node);
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      {/* Header — z-[200] so it stays above the sheet portal container */}
      {showHeader && (
        <PublicNavBar
          showDarkModeToggle={showDarkModeToggle}
          showNavigation={showNavigation}
          sheetPortalContainer={sheetPortalContainer}
          onMobileMenuOpenChange={setMobileMenuOpen}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex container flex-col pt-21 px-4 md:px-6 lg:px-8">{children}</main>

      {/* Sheet portal container: fixed below header, z-40. When menu open, allow pointer events so menu content is clickable. Use inert when closed so we don't hide focused descendants with aria-hidden. */}
      <div
        ref={sheetPortalRef}
        className={cn(
          'fixed tp-18 left-0 right-0 bottom-0 z-40',
          !mobileMenuOpen && 'pointer-events-none'
        )}
        inert={!mobileMenuOpen ? true : undefined}
      >
        {mobileMenuOpen && showNavigation && (
          <div
            className="absolute inset-0 z-0 bg-black/80 pointer-events-auto touch-none"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
            aria-hidden
          />
        )}
      </div>

      {/* Footer */}
      {showFooter && (
        <PublicFooter />
      )}

      <CookieConsentPopup />
    </div>
  );
}
