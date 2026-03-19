'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import { FOOTER_CONTENT } from '@/content/footer';

export type PublicFooterProps = {
  className?: string;
};

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
    <footer className={className ?? 'border-t border-ukraine-yellow py-8 bg-ukraine-header-bg text-ukraine-header-fg'}>
      <div className="container mx-auto px-4 text-center text-sm text-ukraine-header-muted">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Useful Information */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-ukraine-header-fg">{content.usefulInfoTitle}</h3>
            <p className="text-sm leading-relaxed">{content.usefulInfoDescription}</p>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-ukraine-header-fg">{content.contactTitle}</h3>
            <div className="text-sm space-y-2">
              {content.contactAddress.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
              <p>
                <a href={`mailto:${content.contactEmail}`} className="hover:text-ukraine-yellow hover:underline transition-colors">
                  {content.contactEmail}
                </a>
              </p>
              <p>
                <a href={`tel:${content.contactPhone.replace(/\s/g, '')}`} className="hover:text-ukraine-yellow hover:underline transition-colors">
                  {content.contactPhone}
                </a>
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-ukraine-header-fg">
              {content.socialTitle}
            </h3>
            <nav className="flex items-center justify-center gap-4">
              {content.socialLinks.map((link) => {
                const Icon = SOCIAL_ICON_BY_LABEL[link.label];

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={link.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-ukraine-yellow/40 text-ukraine-header-fg/90 hover:text-ukraine-yellow hover:border-ukraine-yellow transition-colors"
                  >
                    {Icon ? <Icon className="h-5 w-5" /> : <span className="text-xs">{link.label}</span>}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-ukraine-yellow pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>{content.copyright}</p>
            <div className="flex gap-4">
              <Link href="/cookies-policy" className="hover:text-ukraine-yellow hover:underline transition-colors">
                {content.cookiesPolicy}
              </Link>
              <Link href="/privacy-policy" className="hover:text-ukraine-yellow hover:underline transition-colors">
                {content.privacyPolicy}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

