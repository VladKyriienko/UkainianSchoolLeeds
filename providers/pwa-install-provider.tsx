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
import {
  isIosDevice,
  isPwaInstalledOnDevice,
  isStandaloneMode
} from '@/lib/pwa/device';

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
  const [isIos, setIsIos] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const syncInstalledState = useCallback(async () => {
    if (isStandaloneMode()) {
      setIsInstalled(true);
      return;
    }

    const onDevice = await isPwaInstalledOnDevice();
    setIsInstalled(onDevice);
  }, []);

  useEffect(() => {
    setIsIos(isIosDevice());
    void syncInstalledState();

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    const standaloneMq = window.matchMedia('(display-mode: standalone)');
    const onDisplayModeChange = () => {
      void syncInstalledState();
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void syncInstalledState();
      }
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onAppInstalled);
    standaloneMq.addEventListener('change', onDisplayModeChange);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onAppInstalled);
      standaloneMq.removeEventListener('change', onDisplayModeChange);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [syncInstalledState]);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      return outcome === 'accepted';
    } catch {
      return false;
    }
  }, [deferredPrompt]);

  const value: PwaInstallContextValue = {
    canShowInstall: !isInstalled,
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
