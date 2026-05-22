export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

/** Running as installed PWA (home screen / desktop shortcut). */
export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;

  const displayModes = ['standalone', 'fullscreen', 'minimal-ui'] as const;
  const inDisplayMode = displayModes.some((mode) =>
    window.matchMedia(`(display-mode: ${mode})`).matches
  );

  return (
    inDisplayMode ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

export function isIosDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/** Chromium: PWA already on device while user is in a normal tab. */
export async function isPwaInstalledOnDevice(): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;

  const nav = navigator as Navigator & {
    getInstalledRelatedApps?: () => Promise<{ id?: string; platform?: string }[]>;
  };

  if (!nav.getInstalledRelatedApps) return false;

  try {
    const related = await nav.getInstalledRelatedApps();
    return related.length > 0;
  } catch {
    return false;
  }
}
