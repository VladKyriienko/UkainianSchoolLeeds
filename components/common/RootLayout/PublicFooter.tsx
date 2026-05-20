'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import {
  FOOTER_CONTACT,
  FOOTER_CONTENT,
  FOOTER_SOCIAL_LINKS
} from '@/content/footer';
import type { PublicFooterProps } from '@/types';

const SOCIAL_ICON_BY_LABEL: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook,
  Instagram,
  YouTube: Youtube,
  X: Twitter
};

export function PublicFooter({ className }: PublicFooterProps) {
  const { language } = useLanguage();
  const content = FOOTER_CONTENT[language];

  return (
    <footer className={className ?? 'border-t border-ukraine-yellow bg-ukraine-header-bg py-8 text-ukraine-header-fg'}>
      <div className="container mx-auto px-4 text-center text-base text-ukraine-header-muted">
        {/* Main Footer Content */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Useful Information */}
          <div>
            <p className="mb-4 text-base font-semibold text-ukraine-header-fg">{content.usefulInfoTitle}</p>
            <p className="leading-relaxed">{content.usefulInfoDescription}</p>
          </div>

          {/* Contact Us */}
          <div>
            <p className="mb-4 text-base font-semibold text-ukraine-header-fg">{content.contactTitle}</p>
            <div className="space-y-2">
              {FOOTER_CONTACT.contactAddress.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
              <p>
                <a
                  href={`mailto:${FOOTER_CONTACT.contactEmail}`}
                  className="transition-colors hover:text-ukraine-yellow hover:underline"
                >
                  {FOOTER_CONTACT.contactEmail}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${FOOTER_CONTACT.contactPhone.replace(/\s/g, '')}`}
                  className="transition-colors hover:text-ukraine-yellow hover:underline"
                >
                  {FOOTER_CONTACT.contactPhone}
                </a>
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <p className="mb-4 text-base font-semibold text-ukraine-header-fg">{content.socialTitle}</p>
            <nav className="flex items-center justify-center gap-4">
              {FOOTER_SOCIAL_LINKS.map((link) => {
                const Icon = SOCIAL_ICON_BY_LABEL[link.label];

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={link.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-ukraine-yellow/40 text-ukraine-header-fg/90 transition-colors hover:border-ukraine-yellow hover:text-ukraine-yellow"
                  >
                    {Icon ? <Icon className="h-5 w-5" /> : <span className="text-base">{link.label}</span>}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-ukraine-yellow pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-base md:flex-row">
            <p>{content.copyright}</p>
            <div className="flex gap-4">
              <Link href="/cookies-policy" className="transition-colors hover:text-ukraine-yellow hover:underline">
                {content.cookiesPolicy}
              </Link>
              <Link href="/privacy-policy" className="transition-colors hover:text-ukraine-yellow hover:underline">
                {content.privacyPolicy}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
