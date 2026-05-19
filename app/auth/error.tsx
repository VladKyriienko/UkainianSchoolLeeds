'use client';

import { RouteError } from '@/components/common/RouteError';

/** Error boundary for auth routes (distinct from `/auth/error` page). */
export default function AuthSegmentError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      error={error}
      reset={reset}
      homeHref="/auth/login"
      homeLabel="Back to sign in"
      title="Authentication error"
    />
  );
}
