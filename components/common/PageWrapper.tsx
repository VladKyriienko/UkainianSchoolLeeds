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

  return (
    <div className={cn('w-full', className)}>
      {goBackButton ? <div className="mb-4">{goBackButton}</div> : null}
      <header className="mb-8 space-y-2">
        <div className="flex w-full items-center gap-3 sm:gap-4">
          <h1 className="min-w-0 flex-1 font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            {translatedTitle}
          </h1>
          {actions ? <div className="ml-auto shrink-0">{actions}</div> : null}
        </div>
        {translatedDescription ? (
          typeof translatedDescription === 'string' ? (
            <h2 className="font-sans text-body font-normal leading-[1.75] text-muted-foreground">
              {translatedDescription}
            </h2>
          ) : (
            <div className="font-sans text-body font-normal leading-[1.75] text-muted-foreground">
              {translatedDescription}
            </div>
          )
        ) : null}
      </header>

      {children}
    </div>
  );
}
