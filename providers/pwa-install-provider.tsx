'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';
import type { BeforeInstallPromptEvent } from '@/lib/pwa/device';
import { isIosDevice, isStandaloneMode } from '@/lib/pwa/device';

type PwaInstallContextValue = {
  canShowInstall: boolean;
  hasNativeInstall: boolean;
  isIos: boolean;
  install: () => Promise<boolean>;
};

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

export function PwaInstallProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    setIsStandalone(isStandaloneMode());
    setIsIos(isIosDevice());

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return outcome === 'accepted';
    } catch {
      return false;
    }
  }, [deferredPrompt]);

  const value: PwaInstallContextValue = {
    canShowInstall: !isStandalone,
    hasNativeInstall: Boolean(deferredPrompt),
    isIos,
    install
  };

  return (
    <PwaInstallContext.Provider value={value}>
      {children}
    </PwaInstallContext.Provider>
  );
}

export function usePwaInstallContext(): PwaInstallContextValue {
  const ctx = useContext(PwaInstallContext);
  if (!ctx) {
    throw new Error('usePwaInstall must be used within PwaInstallProvider');
  }
  return ctx;
}
