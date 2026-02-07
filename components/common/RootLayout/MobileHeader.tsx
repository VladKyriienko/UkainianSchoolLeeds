'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import Logo from '@/components/icons/Logo';
import DarkModeToggle from './DarkModeToggle';
import LanguageToggle from './LanguageToggle';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/providers/language-provider';
import { BRAND_NAME_LINES } from '@/content/navigation';

export type MobileHeaderProps = {
  showDarkModeToggle?: boolean;
  burgerPosition?: 'left' | 'right';
  className?: string;
};

export function MobileHeader({
  showDarkModeToggle = true,
  burgerPosition = 'right',
  className
}: MobileHeaderProps) {
  const { toggleSidebar } = useSidebar();
  const { language } = useLanguage();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Left side content */}
        <div className="flex items-center space-x-3">
          {burgerPosition === 'left' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
          )}

          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8 shrink-0" />
            <span className="flex flex-col text-xs font-semibold leading-tight">
              <span>{BRAND_NAME_LINES[language].line1}</span>
              <span>{BRAND_NAME_LINES[language].line2}</span>
            </span>
          </Link>

          {showDarkModeToggle && burgerPosition === 'right' && (
            <DarkModeToggle />
          )}
          <LanguageToggle />
        </div>

        {/* Right side content */}
        <div className="flex items-center space-x-2">
          {showDarkModeToggle && burgerPosition === 'left' && (
            <DarkModeToggle />
          )}

          {burgerPosition === 'right' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
