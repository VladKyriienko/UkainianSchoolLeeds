'use client';

import { useLanguage } from '@/providers/language-provider';
import { isHtmlContent } from '@/utils/rich-text';
import type { PublicKeyInfoDocument } from './actions';

type DocumentContentProps = {
  document: PublicKeyInfoDocument | null;
};

const CONTENT = {
  en: {
    noDocument: 'This document has not been published yet.'
  },
  uk: {
    noDocument: 'Цей документ ще не опубліковано.'
  }
} as const;

export function DocumentContent({ document }: DocumentContentProps) {
  const { language } = useLanguage();
  const content = CONTENT[language];

  if (!document) {
    return <p className="public-text text-base leading-7">{content.noDocument}</p>;
  }

  const documentContent =
    language === 'uk' && document.content_uk ? document.content_uk : document.content;
  const hasHtml = isHtmlContent(documentContent);

  return (
    <div className="w-full">
      {hasHtml ? (
        <div
          className="rich-text-content"
          dangerouslySetInnerHTML={{ __html: documentContent }}
        />
      ) : (
        <p className="public-text whitespace-pre-line text-base leading-7">
          {documentContent}
        </p>
      )}
    </div>
  );
}
