'use client';

import { cn } from '@/utils/cn';
import { useLanguage } from '@/providers/language-provider';

type TranslatableText = string | { en: string; uk: string };

export type PageWrapperProps = {
  title: TranslatableText;
  description?: TranslatableText | React.ReactNode;
  goBackButton?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

function getTranslatedText(text: TranslatableText | React.ReactNode | undefined, language: 'en' | 'uk'): React.ReactNode {
  if (!text) return null;

  // If it's a React node (not a string or translation object), return as-is
  if (typeof text !== 'string' && (typeof text !== 'object' || !('en' in text))) {
    return text as React.ReactNode;
  }

  // If it's a string, return as-is (backward compatible)
  if (typeof text === 'string') {
    return text;
  }

  // If it's a translation object, return the appropriate language
  return text[language];
}

export function PageWrapper({
  title,
  description,
  goBackButton,
  actions,
  children,
  className
}: PageWrapperProps) {
  const { language } = useLanguage();

  const translatedTitle = typeof title === 'string' ? title : title[language];
  const translatedDescription = getTranslatedText(description, language);

  const hasHeaderActions = goBackButton || actions;

  return (
    <div className={cn('w-full', className)}>
      {(goBackButton || actions) ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="order-1">{goBackButton}</div>
          <div className="order-2">{actions}</div>
        </div>
      ) : null}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{translatedTitle}</h1>
        {translatedDescription ? (
          <p className="text-muted-foreground">{translatedDescription}</p>
        ) : null}
      </div>

      {children}
    </div>
  );
}

