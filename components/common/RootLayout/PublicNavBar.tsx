'use client';

import * as React from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/icons/Logo';
import DarkModeToggle from './DarkModeToggle';
import { NavItems, type NavItem } from '@/constants/navigation';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

export type PublicNavBarProps = {
  showDarkModeToggle?: boolean;
};

export function PublicNavBar({ showDarkModeToggle = true }: PublicNavBarProps) {
  const pathname = usePathname();
  const [openKey, setOpenKey] = useState<string | null>(null);

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
          <span className="font-semibold">AI Template</span>
        </Link>

        {/* Desktop Navigation */}
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
                  {item.label}
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
                  {item.label}
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
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>


        {/* Actions */}
        <div className="flex items-center gap-2">
          {showDarkModeToggle && <DarkModeToggle />}

        </div>
      </div>
    </header>
  );
}
