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
  const headerButtons = goBackButton || actions;

  return (
    <div className={cn('w-full', className)}>
      <header className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start gap-3">
              <h1 className="min-w-0 flex-1 font-display text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
                {translatedTitle}
              </h1>
              {goBackButton ? (
                <div className="shrink-0 md:hidden">{goBackButton}</div>
              ) : null}
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
          </div>

          {headerButtons ? (
            <div className="flex flex-wrap items-center justify-end gap-2 md:shrink-0">
              {goBackButton ? (
                <div className="hidden md:block">{goBackButton}</div>
              ) : null}
              {actions}
            </div>
          ) : null}
        </div>
      </header>

      {children}
    </div>
  );
}
