'use client';

import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import DarkModeToggle from './DarkModeToggle';
import LanguageToggle from './LanguageToggle';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/language-provider';
import {
  BRAND_NAME_LINES,
  NAV_LABELS,
  NavItems,
  type NavItem
} from '@/content/navigation';

export type PublicNavBarProps = {
  showDarkModeToggle?: boolean;
  showNavigation?: boolean;
  /** Container for mobile sheet portal so overlay renders below header (z-index) */
  sheetPortalContainer?: HTMLDivElement | null;
  /** Called when mobile menu open state changes (for custom overlay in layout) */
  onMobileMenuOpenChange?: (open: boolean) => void;
};

type KeyInfoNavDocument = {
  id: string;
  title: string;
  title_uk: string | null;
  slug: string;
};

const KEY_INFO_MENU_CONTENT = {
  en: {
    empty: 'No documents yet'
  },
  uk: {
    empty: 'Документи ще не додані'
  }
} as const;

export function PublicNavBar({
  showDarkModeToggle = true,
  showNavigation = true,
  sheetPortalContainer = null,
  onMobileMenuOpenChange
}: PublicNavBarProps) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const keyInfoMenuContent = KEY_INFO_MENU_CONTENT[language];
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedKey, setMobileExpandedKey] = useState<string | null>(null);
  const [keyInfoDocuments, setKeyInfoDocuments] = useState<KeyInfoNavDocument[]>([]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    onMobileMenuOpenChange?.(false);
  };

  // Lock body scroll and ensure overlay dims content when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  useEffect(() => {
    let isMounted = true;

    async function loadKeyInfoDocuments() {
      try {
        const response = await fetch('/api/key-info-documents');
        if (!response.ok) return;

        const data = (await response.json()) as {
          documents?: KeyInfoNavDocument[];
        };

        if (isMounted) {
          setKeyInfoDocuments(data.documents ?? []);
        }
      } catch (error) {
        console.error('Failed to load key info navigation documents:', error);
      }
    }

    loadKeyInfoDocuments();

    return () => {
      isMounted = false;
    };
  }, []);

  const getTranslatedLabel = (defaultLabel: string, href: string) => {
    const labelsForLang = NAV_LABELS[language] ?? {};
    return labelsForLang[href] ?? defaultLabel;
  };

  const navigationItems = useMemo<NavItem[]>(
    () =>
      NavItems.map((item) => {
        if (item.key !== 'keyInfo') return item;

        return {
          ...item,
          children: keyInfoDocuments.map((document) => ({
            label:
              language === 'uk' && document.title_uk ? document.title_uk : document.title,
            href: `/key-info/${document.slug}`
          }))
        };
      }),
    [keyInfoDocuments, language]
  );

  const activeKey = useMemo(() => {
    const matchesItem = (item: NavItem) => {
      if (pathname === item.href) return true;
      if (item.href !== '/' && pathname.startsWith(`${item.href}/`)) return true;
      if (item.children?.some((c) => pathname === c.href || pathname.startsWith(`${c.href}/`))) {
        return true;
      }
      return false;
    };

    return navigationItems.find((i) => matchesItem(i))?.key ?? null;
  }, [navigationItems, pathname]);

  const linkClass = (isActive: boolean) =>
    cn(
      'inline-flex items-center gap-1 px-1 pb-2 text-base font-medium leading-snug transition-colors',
      'border-b-2 border-transparent text-ukraine-header-muted hover:border-ukraine-yellow/50 hover:text-ukraine-header-fg',
      isActive && 'border-ukraine-yellow text-ukraine-header-fg'
    );

  return (
    <header className="border-b-[3px] border-ukraine-yellow bg-ukraine-header-bg text-ukraine-header-fg fixed top-0 left-0 right-0 z-200 min-h-18 flex items-center isolate">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between w-full">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity text-ukraine-header-fg"
        >
          <Image src="/logo.png" alt="Ukrainia School" width={48} height={48} className="h-12 w-12 object-contain shrink-0" />
          <span className="flex flex-col text-base font-semibold leading-tight text-ukraine-header-fg">
            <span>{BRAND_NAME_LINES[language].line1}</span>
            <span>{BRAND_NAME_LINES[language].line2}</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        {showNavigation && (
          <nav className="hidden lg:flex items-center gap-4 lg:gap-3 xl:gap-8">
            {navigationItems.map((item) => {
              const isActive = activeKey === item.key;
              const hasChildren = item.key === 'keyInfo' || !!item.children?.length;
              const isKeyInfo = item.key === 'keyInfo';

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
                        'rounded-xl border border-ukraine-blue/40 p-2 shadow-lg',
                        'bg-[rgb(var(--ukraine-blue)/0.8)] backdrop-blur-sm'
                      )}
                      role="menu"
                    >
                      {(item.children?.length ?? 0) > 0 ? (
                        item.children!.map((child) => {
                          const childActive =
                            pathname === child.href ||
                            pathname.startsWith(`${child.href}/`);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                'block rounded-lg px-4 py-3 text-base transition-colors text-ukraine-header-fg',
                                childActive
                                  ? 'bg-ukraine-yellow/30 text-ukraine-yellow'
                                  : 'hover:bg-ukraine-yellow hover:text-ukraine-blue'
                              )}
                              role="menuitem"
                              onClick={() => setOpenKey(null)}
                            >
                              {getTranslatedLabel(child.label, child.href)}
                            </Link>
                          );
                        })
                      ) : isKeyInfo ? (
                        <p className="px-4 py-3 text-base text-ukraine-header-muted">
                          {keyInfoMenuContent.empty}
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        )}


        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language toggle - same colors as burger on mobile */}
          <div className="[&_button]:text-ukraine-header-fg [&_button]:hover:bg-white/10 [&_button]:hover:text-ukraine-header-fg">
            <LanguageToggle />
          </div>
          {showDarkModeToggle && <DarkModeToggle />}

          {/* Mobile Menu Button - burger animates to X when open */}
          {showNavigation && (
            <Sheet
              open={mobileOpen}
              onOpenChange={(open) => {
                setMobileOpen(open);
                onMobileMenuOpenChange?.(open);
              }}
              modal={false}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden relative w-10 h-10 text-ukraine-header-fg hover:bg-white/10 hover:text-ukraine-header-fg"
                  aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={mobileOpen}
                >
                  <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
                  <span
                    className={cn(
                      'absolute inset-0 flex flex-col justify-center items-center gap-1.5 transition-transform duration-300 ease-out',
                      mobileOpen && 'gap-0'
                    )}
                  >
                    <span
                      className={cn(
                        'block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-out origin-center',
                        mobileOpen && 'rotate-45 translate-y-0.5'
                      )}
                    />
                    <span
                      className={cn(
                        'block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-out',
                        mobileOpen && 'opacity-0 scale-0'
                      )}
                    />
                    <span
                      className={cn(
                        'block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-out origin-center',
                        mobileOpen && '-rotate-45 -translate-y-0.5'
                      )}
                    />
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                showCloseButton={false}
                portalContainer={sheetPortalContainer}
                aria-describedby={undefined}
                className={cn(
                  'w-75 sm:w-100 overflow-y-auto px-4 bg-ukraine-header-bg text-ukraine-header-fg border-0 shadow-none',
                  'top-18! h-[calc(100dvh-4.5rem)]'
                )}
                overlayClassName="top-18! h-[calc(100dvh-4.5rem)]"
                overlayStyle={{
                  top: '4.5rem',
                  height: 'calc(100vh - 4.5rem)',
                  left: 0,
                  right: 0,
                  pointerEvents: 'auto',
                  touchAction: 'none'
                }}
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                <div className="flex flex-col gap-6 pt-2">
                  <nav className="flex flex-col gap-2 flex-1">
                    {navigationItems.map((item) => {
                      const isActive = activeKey === item.key;
                      const hasChildren = item.key === 'keyInfo' || !!item.children?.length;
                      const isKeyInfo = item.key === 'keyInfo';

                      if (!hasChildren) {
                        return (
                          <Link
                            key={item.key}
                            href={item.href}
                            className={cn(
                              'block rounded-lg px-4 py-3 text-base font-medium transition-colors text-ukraine-header-fg',
                              isActive
                                ? 'bg-ukraine-yellow/30 text-ukraine-yellow'
                                : 'text-ukraine-header-muted hover:bg-white/10 hover:text-ukraine-header-fg'
                            )}
                            onClick={closeMobileMenu}
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
                              'w-full flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors text-ukraine-header-fg',
                              isActive
                                ? 'bg-ukraine-yellow/30 text-ukraine-yellow'
                                : 'text-ukraine-header-muted hover:bg-white/10 hover:text-ukraine-header-fg'
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
                              {(item.children?.length ?? 0) > 0 ? (
                                item.children!.map((child) => {
                                  const childActive =
                                    pathname === child.href ||
                                    pathname.startsWith(`${child.href}/`);
                                  return (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      className={cn(
                                        'block rounded-lg px-4 py-2 text-base transition-colors',
                                        childActive
                                          ? 'bg-ukraine-yellow/20 text-ukraine-yellow font-medium'
                                          : 'text-ukraine-header-muted hover:bg-white/10 hover:text-ukraine-header-fg'
                                      )}
                                      onClick={closeMobileMenu}
                                    >
                                      {getTranslatedLabel(child.label, child.href)}
                                    </Link>
                                  );
                                })
                              ) : isKeyInfo ? (
                                <p className="px-4 py-2 text-base text-ukraine-header-muted">
                                  {keyInfoMenuContent.empty}
                                </p>
                              ) : null}
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
