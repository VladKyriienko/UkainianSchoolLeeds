'use client';

import { format } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';
import { useLanguage } from '@/providers/language-provider';
import type { PublicCookiesPolicyDocument } from '@/types';
import { isHtmlContent } from '@/utils/rich-text';

type CookiesPolicyContentProps = {
  document: PublicCookiesPolicyDocument | null;
};

const FALLBACK_CONTENT = {
  en: {
    noDocument: 'Cookies policy is not available yet.',
    lastUpdatedPrefix: 'Last updated:'
  },
  uk: {
    noDocument: 'Політика cookies ще не опублікована.',
    lastUpdatedPrefix: 'Оновлено:'
  }
} as const;

export default function CookiesPolicyContent({ document }: CookiesPolicyContentProps) {
  const { language } = useLanguage();
  const locale = language === 'uk' ? uk : enUS;
  const fallback = FALLBACK_CONTENT[language];

  if (!document) {
    return (
      <div className="w-full space-y-4">
        <p className="text-muted-foreground leading-7">{fallback.noDocument}</p>
      </div>
    );
  }

  const content = language === 'uk' && document.content_uk ? document.content_uk : document.content;
  const hasHtml = isHtmlContent(content);
  const updatedAt = format(new Date(document.created_at), 'd MMMM yyyy', {
    locale
  });

  return (
    <div className="w-full space-y-6">
      <p className="text-sm text-muted-foreground">
        {fallback.lastUpdatedPrefix} {updatedAt}
      </p>

      <section>
        {hasHtml ? (
          <div
            className="rich-text-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-muted-foreground leading-7 whitespace-pre-line">{content}</p>
        )}
      </section>
    </div>
  );
}
