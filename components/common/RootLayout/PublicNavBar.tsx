'use client';

import * as React from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/icons/Logo';
import DarkModeToggle from './DarkModeToggle';
import LanguageToggle from './LanguageToggle';
import { NavItems, type NavItem } from '@/constants/navigation';
import { cn } from '@/utils/cn';
import { ChevronDown, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/language-provider';
import { BRAND_NAME, NAV_LABELS } from '@/content/navigation';

export type PublicNavBarProps = {
  showDarkModeToggle?: boolean;
  showNavigation?: boolean;
};

export function PublicNavBar({ showDarkModeToggle = true, showNavigation = true }: PublicNavBarProps) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedKey, setMobileExpandedKey] = useState<string | null>(null);

  const getTranslatedLabel = (defaultLabel: string, href: string) => {
    const labelsForLang = NAV_LABELS[language] ?? {};
    return labelsForLang[href] ?? defaultLabel;
  };

  const activeKey = useMemo(() => {
    const matchesItem = (item: NavItem) => {
      if (pathname === item.href) return true;
      if (item.href !== '/' && pathname.startsWith(`${item.href}/`)) return true;
      if (item.children?.some((c) => pathname === c.href || pathname.startsWith(`${c.href}/`))) {
        return true;
      }
      return false;
    };

    return NavItems.find((i) => matchesItem(i))?.key ?? null;
  }, [pathname]);

  const linkClass = (isActive: boolean) =>
    cn(
      'inline-flex items-center gap-1 px-1 pb-2 text-sm font-medium transition-colors',
      'text-muted-foreground hover:text-foreground',
      'border-b-2 border-transparent hover:border-primary/50',
      isActive && 'text-foreground border-primary'
    );

  return (
    <header className="border-b bg-background fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Logo className="h-8 w-8" />
          <span className="font-semibold">{BRAND_NAME[language]}</span>
        </Link>

        {/* Desktop Navigation */}
        {showNavigation && (
          <nav className="hidden lg:flex items-center gap-8">
            {NavItems.map((item) => {
              const isActive = activeKey === item.key;
              const hasChildren = !!item.children?.length;

              if (!hasChildren) {
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={linkClass(isActive)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {getTranslatedLabel(item.label, item.href)}
                  </Link>
                );
              }

              const isOpen = openKey === item.key;

              return (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => setOpenKey(item.key)}
                  onMouseLeave={() => setOpenKey(null)}
                >
                  <button
                    type="button"
                    className={linkClass(isActive)}
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                  >
                    {getTranslatedLabel(item.label, item.href)}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div
                      className={cn(
                        'absolute left-1/2 top-5 z-50 mt-3 w-80 -translate-x-1/2',
                        'rounded-xl border bg-background p-2 shadow-lg'
                      )}
                      role="menu"
                    >
                      {item.children!.map((child) => {
                        const childActive =
                          pathname === child.href ||
                          pathname.startsWith(`${child.href}/`);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'block rounded-lg px-4 py-3 text-sm transition-colors',
                              childActive
                                ? 'bg-muted text-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                            role="menuitem"
                            onClick={() => setOpenKey(null)}
                          >
                            {getTranslatedLabel(child.label, child.href)}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        )}


        {/* Actions */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          {showDarkModeToggle && <DarkModeToggle />}

          {/* Mobile Menu Button */}
          {showNavigation && (
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                {/* Hidden title for accessibility */}
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                <div className="flex flex-col gap-6 mt-8">
                  {/* Logo in mobile menu */}
                  <Link
                    href="/"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Logo className="h-8 w-8" />
                    <span className="font-semibold">{BRAND_NAME[language]}</span>
                  </Link>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-2">
                    {NavItems.map((item) => {
                      const isActive = activeKey === item.key;
                      const hasChildren = !!item.children?.length;

                      if (!hasChildren) {
                        return (
                          <Link
                            key={item.key}
                            href={item.href}
                            className={cn(
                              'block rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                            onClick={() => setMobileOpen(false)}
                          >
                            {getTranslatedLabel(item.label, item.href)}
                          </Link>
                        );
                      }

                      const isExpanded = mobileExpandedKey === item.key;

                      return (
                        <div key={item.key}>
                          <button
                            type="button"
                            className={cn(
                              'w-full flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                            onClick={() =>
                              setMobileExpandedKey(isExpanded ? null : item.key)
                            }
                            aria-expanded={isExpanded}
                          >
                            {getTranslatedLabel(item.label, item.href)}
                            <ChevronDown
                              className={cn(
                                'h-4 w-4 transition-transform',
                                isExpanded && 'rotate-180'
                              )}
                            />
                          </button>

                          {isExpanded && (
                            <div className="ml-4 mt-1 flex flex-col gap-1">
                              {item.children!.map((child) => {
                                const childActive =
                                  pathname === child.href ||
                                  pathname.startsWith(`${child.href}/`);
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className={cn(
                                      'block rounded-lg px-4 py-2 text-sm transition-colors',
                                      childActive
                                        ? 'bg-muted text-foreground font-medium'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    )}
                                    onClick={() => setMobileOpen(false)}
                                  >
                                    {getTranslatedLabel(child.label, child.href)}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
