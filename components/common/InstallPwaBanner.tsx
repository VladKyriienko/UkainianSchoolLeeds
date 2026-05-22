'use client';

import { useCallback, useEffect, useState } from 'react';
import { X, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/language-provider';
import { cn } from '@/utils/cn';

const DISMISS_KEY = 'pwa-install-dismissed';

const COPY = {
  en: {
    title: 'Install the app',
    body: 'Add this site to your home screen for a full-screen experience without the browser bar.',
    install: 'Install',
    iosHint: 'Tap Share, then “Add to Home Screen”.',
    dismiss: 'Not now'
  },
  uk: {
    title: 'Встановити додаток',
    body: 'Додайте сайт на головний екран — відкриватиметься на весь екран без смуги браузера.',
    install: 'Встановити',
    iosHint: 'Натисніть «Поділитися», потім «На Початковий екран».',
    dismiss: 'Не зараз'
  }
} as const;

function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

function isIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function InstallPwaBanner() {
  const { language } = useLanguage();
  const copy = COPY[language];
  const [visible, setVisible] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandaloneMode()) return;
    if (localStorage.getItem(DISMISS_KEY) === '1') return;

    const narrow =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches;
    if (!narrow) return;

    setIsIosDevice(isIos());
    setVisible(true);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  }, [deferredPrompt, dismiss]);

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
            {isIosDevice ? (
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
          {deferredPrompt ? (
            <Button type="button" size="sm" onClick={install}>
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
