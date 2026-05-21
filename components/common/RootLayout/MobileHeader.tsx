'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSidebar } from '@/components/ui/sidebar';
import DarkModeToggle from './DarkModeToggle';
import LanguageToggle from './LanguageToggle';
import { MobileMenuToggleButton } from './MobileMenuToggleButton';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/providers/language-provider';
import { BRAND_NAME_LINES } from '@/content/navigation';
import type { MobileHeaderProps } from '@/types';

export function MobileHeader({
  showDarkModeToggle = true,
  showLanguageToggle = true,
  burgerPosition = 'right',
  variant = 'default',
  className
}: MobileHeaderProps) {
  const { toggleSidebar, openMobile } = useSidebar();
  const { language } = useLanguage();
  const isPublicVariant = variant === 'public';

  const toggleClass = isPublicVariant
    ? undefined
    : 'text-foreground hover:bg-accent hover:text-accent-foreground';

  const menuToggle = (
    <MobileMenuToggleButton
      open={openMobile}
      onClick={toggleSidebar}
      {...(toggleClass ? { className: toggleClass } : {})}
    />
  );

  const languageToggle = showLanguageToggle ? (
    <div
      className={
        isPublicVariant
          ? '[&_button]:text-ukraine-header-fg [&_button]:hover:bg-white/10 [&_button]:hover:text-ukraine-header-fg'
          : undefined
      }
    >
      <LanguageToggle />
    </div>
  ) : null;

  const darkToggle = showDarkModeToggle ? (
    <div
      className={
        isPublicVariant
          ? '[&_button]:text-ukraine-header-fg [&_button]:hover:bg-white/10 [&_button]:hover:text-ukraine-header-fg'
          : undefined
      }
    >
      <DarkModeToggle />
    </div>
  ) : null;

  return (
    <header
      className={cn(
        isPublicVariant
          ? 'fixed top-0 right-0 left-0 z-200 isolate flex min-h-18 w-full items-center border-b-[3px] border-ukraine-yellow bg-ukraine-header-bg text-ukraine-header-fg'
          : 'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60',
        className
      )}
    >
      <div
        className={cn(
          'flex w-full items-center justify-between px-4',
          isPublicVariant
            ? 'container mx-auto min-h-18 gap-4 py-4'
            : 'h-14'
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          {burgerPosition === 'left' ? menuToggle : null}

          <Link
            href="/"
            className={cn(
              'flex min-w-0 items-center gap-2 transition-opacity hover:opacity-80',
              isPublicVariant && 'text-ukraine-header-fg'
            )}
          >
            <Image
              src="/logo.png"
              alt="Ukrainia School"
              width={isPublicVariant ? 48 : 32}
              height={isPublicVariant ? 48 : 32}
              className={cn(
                'shrink-0 object-contain',
                isPublicVariant ? 'h-12 w-12' : 'h-8 w-8'
              )}
            />
            <span
              className={cn(
                'flex flex-col font-semibold leading-tight',
                isPublicVariant ? 'text-base' : 'text-xs'
              )}
            >
              <span>{BRAND_NAME_LINES[language].line1}</span>
              <span>{BRAND_NAME_LINES[language].line2}</span>
            </span>
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {languageToggle}
          {darkToggle}
          {burgerPosition === 'right' ? menuToggle : null}
        </div>
      </div>
    </header>
  );
}
