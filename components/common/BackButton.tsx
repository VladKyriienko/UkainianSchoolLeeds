'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/providers/language-provider';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const LABELS = { en: 'Back', uk: 'Назад' } as const;

type BackButtonProps = {
  /** Fallback URL when there is no history (e.g. 404 opened directly). */
  href?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
};

export function BackButton({
  href,
  variant = 'outline',
  size = 'sm',
  className
}: BackButtonProps) {
  const router = useRouter();
  const { language } = useLanguage();

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.history.length <= 1 && href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      <ArrowLeft className="h-4 w-4" />
      {LABELS[language]}
    </Button>
  );
}
