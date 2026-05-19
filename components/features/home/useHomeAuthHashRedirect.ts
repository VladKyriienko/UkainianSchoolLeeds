'use client';

import { useEffect } from 'react';

/** Forwards Supabase invite/OTP hash tokens from `/` to the auth callback page. */
export function useHomeAuthHashRedirect(): void {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const hasAuthTokens =
      hash.includes('access_token=') && hash.includes('refresh_token=');
    if (!hasAuthTokens) return;

    window.location.replace(`/auth/callback-client?redirectTo=/${hash}`);
  }, []);
}
