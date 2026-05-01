'use client';

import { useEffect } from 'react';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();

  useEffect(() => {
    if (!posthogKey) return;

    posthog.init(posthogKey, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
      person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
      defaults: '2025-05-24'
    });
  }, [posthogKey]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
