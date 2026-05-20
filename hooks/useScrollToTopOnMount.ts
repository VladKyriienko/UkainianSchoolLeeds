'use client';

import { useScrollToTopOnPathnameChange } from '@/components/common/ScrollToTopOnNavigate';

/** Scroll to top when the route changes (e.g. opening a detail view). Skips back/forward. */
export function useScrollToTopOnMount() {
  useScrollToTopOnPathnameChange();
}
