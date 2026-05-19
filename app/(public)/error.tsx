'use client';

import { RouteError } from '@/components/common/RouteError';

export default function PublicSegmentError({
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
      homeHref="/"
      homeLabel="Go home"
      title="Something went wrong"
    />
  );
}
