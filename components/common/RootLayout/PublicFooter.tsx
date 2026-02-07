'use client';

import Link from 'next/link';
import { useLanguage } from '@/providers/language-provider';
import { FOOTER_CONTENT } from '@/content/footer';

export type PublicFooterProps = {
  className?: string;
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

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-ukraine-header-fg">{content.quickLinksTitle}</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              {content.quickLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-ukraine-yellow hover:underline transition-colors">
                  {link.label}
                </Link>
              ))}
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

