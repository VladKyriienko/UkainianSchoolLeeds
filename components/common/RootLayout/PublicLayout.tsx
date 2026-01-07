'use client';

import * as React from 'react';
import { PublicNavBar } from './PublicNavBar';

export type PublicLayoutProps = {
  children: React.ReactNode;
  showHeader?: boolean;
  showDarkModeToggle?: boolean;
  showFooter?: boolean;
};

export function PublicLayout({
  children,
  showHeader = true,
  showDarkModeToggle = true,
  showFooter = false
}: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {showHeader && <PublicNavBar showDarkModeToggle={showDarkModeToggle} />}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      {showFooter && (
        <footer className="border-t py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>
              Built with Next.js, Supabase, and ❤️ by{' '}
              <a
                href="https://decodifi.com"
                className="hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Decodifi
              </a>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
