'use client';

import { useCallback, useEffect, useState } from 'react';
import { X, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/language-provider';
import { PWA_COPY } from '@/lib/pwa/pwa-copy';
import { isIosDevice, usePwaInstall } from '@/hooks/use-pwa-install';
import { cn } from '@/utils/cn';

const DISMISS_KEY = 'pwa-install-dismissed';

export function InstallPwaBanner() {
  const { language } = useLanguage();
  const copy = PWA_COPY[language];
  const { canShowInstall, hasNativeInstall, install } = usePwaInstall();
  const [visible, setVisible] = useState(false);
  const [isIosDeviceState, setIsIosDeviceState] = useState(false);

  useEffect(() => {
    if (!canShowInstall) return;
    if (localStorage.getItem(DISMISS_KEY) === '1') return;

    const narrow =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches;
    if (!narrow) return;

    setIsIosDeviceState(isIosDevice());
    setVisible(true);
  }, [canShowInstall]);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  }, []);

  const handleInstall = useCallback(async () => {
    const accepted = await install();
    if (accepted) dismiss();
  }, [install, dismiss]);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label={copy.title}
      className={cn(
        'fixed inset-x-0 bottom-0 z-250 border-t border-border bg-card p-4 shadow-lg',
        'pb-[max(1rem,env(safe-area-inset-bottom))]'
      )}
    >
      <div className="container mx-auto flex max-w-lg flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="font-semibold text-foreground">{copy.title}</p>
            <p className="text-sm text-muted-foreground">{copy.body}</p>
            {isIosDeviceState && !hasNativeInstall ? (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Share className="h-4 w-4 shrink-0" aria-hidden />
                {copy.iosHint}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={dismiss}
            aria-label={copy.dismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {hasNativeInstall ? (
            <Button type="button" size="sm" onClick={handleInstall}>
              {copy.install}
            </Button>
          ) : null}
          <Button type="button" size="sm" variant="outline" onClick={dismiss}>
            {copy.dismiss}
          </Button>
        </div>
      </div>
    </div>
  );
}
