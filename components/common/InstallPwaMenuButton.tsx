'use client';

import { useState } from 'react';
import { Download, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/language-provider';
import { PWA_COPY } from '@/lib/pwa/pwa-copy';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { cn } from '@/utils/cn';

type InstallPwaMenuButtonProps = {
  variant?: 'public' | 'default';
  onAction?: () => void;
  className?: string;
};

export function InstallPwaMenuButton({
  variant = 'public',
  onAction,
  className
}: InstallPwaMenuButtonProps) {
  const { language } = useLanguage();
  const copy = PWA_COPY[language];
  const { canShowInstall, hasNativeInstall, isIos, install } = usePwaInstall();
  const [hint, setHint] = useState<'ios' | 'browser' | null>(null);

  if (!canShowInstall) return null;

  const isPublic = variant === 'public';

  const handleClick = async () => {
    if (hasNativeInstall) {
      const accepted = await install();
      if (accepted) {
        setHint(null);
        onAction?.();
      }
      return;
    }

    if (isIos) {
      setHint('ios');
      return;
    }

    setHint('browser');
  };

  return (
    <div
      className={cn(
        'shrink-0 border-t pt-4',
        isPublic ? 'border-white/10' : 'border-border',
        className
      )}
    >
      <Button
        type="button"
        variant={isPublic ? 'default' : 'outline'}
        className={cn(
          'h-11 w-full gap-2 text-base font-semibold',
          isPublic &&
            'border-ukraine-yellow bg-ukraine-yellow text-ukraine-blue hover:bg-ukraine-yellow/90'
        )}
        onClick={handleClick}
      >
        <Download className="h-4 w-4 shrink-0" aria-hidden />
        {copy.install}
      </Button>
      {hint === 'ios' ? (
        <p
          className={cn(
            'mt-2 flex items-start gap-1.5 text-sm',
            isPublic ? 'text-ukraine-header-muted' : 'text-muted-foreground'
          )}
        >
          <Share className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {copy.iosHint}
        </p>
      ) : null}
      {hint === 'browser' ? (
        <p
          className={cn(
            'mt-2 text-sm',
            isPublic ? 'text-ukraine-header-muted' : 'text-muted-foreground'
          )}
        >
          {copy.browserHint}
        </p>
      ) : null}
    </div>
  );
}
