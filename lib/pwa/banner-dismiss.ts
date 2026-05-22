const DISMISS_KEY = 'pwa-install-dismissed';
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function isPwaBannerDismissed(): boolean {
  if (typeof window === 'undefined') return false;

  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;

  // Legacy permanent flag — migrate to a fresh 7-day window.
  if (raw === '1') {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    return true;
  }

  const dismissedAt = Number(raw);
  if (!Number.isFinite(dismissedAt)) {
    localStorage.removeItem(DISMISS_KEY);
    return false;
  }

  if (Date.now() - dismissedAt >= DISMISS_TTL_MS) {
    localStorage.removeItem(DISMISS_KEY);
    return false;
  }

  return true;
}

export function dismissPwaBanner(): void {
  localStorage.setItem(DISMISS_KEY, String(Date.now()));
}
