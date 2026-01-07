'use client';

import * as React from 'react';
import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import DarkModeToggle from './DarkModeToggle';
import { Button } from '@/components/ui/button';

export type PublicNavBarProps = {
  showDarkModeToggle?: boolean;
};

export function PublicNavBar({ showDarkModeToggle = true }: PublicNavBarProps) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Logo className="h-8 w-8" />
          <span className="font-semibold">Decodifi</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {showDarkModeToggle && <DarkModeToggle />}
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
