'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/language-provider';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  // Show the language you can switch TO, not the current one
  const targetLanguage = language === 'en' ? 'uk' : 'en';
  const targetFlag = targetLanguage === 'uk' ? '🇺🇦' : '🇬🇧';
  const targetLabel = targetLanguage === 'uk' ? 'UK' : 'EN';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="h-9 px-2 gap-1.5"
      aria-label={language === 'en' ? 'Switch to Ukrainian' : 'Перемкнути на англійську'}
      title={language === 'en' ? 'Switch to Ukrainian' : 'Перемкнути на англійську'}
    >
      <span className="text-base leading-none">
        {targetFlag}
      </span>
      <span className="text-xs font-medium">
        {targetLabel}
      </span>
    </Button>
  );
}
