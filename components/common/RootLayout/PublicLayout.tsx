'use client';

import * as React from 'react';
import { PublicNavBar } from './PublicNavBar';
import { PublicFooter } from './PublicFooter';

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
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {showHeader && <PublicNavBar showDarkModeToggle={showDarkModeToggle} showNavigation={showNavigation} />}

      {/* Main Content */}
      <main className="flex-1 flex container flex-col pt-16 px-4 md:px-6 lg:px-8">{children}</main>

      {/* Footer */}
      {showFooter && (
        <PublicFooter />
      )}
    </div>
  );
}
