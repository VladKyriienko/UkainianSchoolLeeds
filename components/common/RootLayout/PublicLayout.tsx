'use client';

import * as React from 'react';
import Link from 'next/link';
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
        <footer className="border-t py-8 bg-background">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Useful Information */}
              <div>
                <h3 className="font-bold text-lg mb-4">Useful Information</h3>
                <p className="text-sm leading-relaxed">
                  The Ukrainian Saturday School is the heart of the local community. We serve our community with dedication and passion for the study of the Ukrainian language, culture, and history.
                </p>
              </div>

              {/* Contact Us */}
              <div>
                <h3 className="font-bold text-lg mb-4">Contact Us</h3>
                <div className="text-sm space-y-2">
                  <p>Ukrainian School</p>
                  <p>5 Back Newton Grove</p>
                  <p>Leeds</p>
                  <p>LS7 4HW</p>
                  <p>
                    <a
                      href="mailto:admin@ukrainianschool.com"
                      className="hover:underline"
                    >
                      admin@ukrainianschool.com
                    </a>
                  </p>
                  <p>
                    <a href="tel:01132755883" className="hover:underline">
                      0113 2755883
                    </a>
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                <nav className="flex flex-col space-y-2 text-sm">
                  <Link href="/parents/term-dates" className="hover:underline">
                    Term Dates
                  </Link>
                  <Link href="/children/class-pages" className="hover:underline">
                    Class Pages
                  </Link>
                  <Link href="/parents/newsletters" className="hover:underline">
                    Newsletters
                  </Link>
                  <Link href="/key-info/curriculum" className="hover:underline">
                    Curriculum
                  </Link>
                  <Link href="/contact" className="hover:underline">
                    Contact Us
                  </Link>
                </nav>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-blue-800 dark:border-blue-900 pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                <p>All website content copyright © Ukrainian School 2026</p>
                <div className="flex gap-4">
                  <Link href="/cookies-policy" className="hover:underline">
                    Cookies Policy
                  </Link>
                  <Link href="/privacy-policy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
