'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { scrollPageToTop } from '@/components/common/ScrollToTopOnNavigate';

/** Scroll to top when the route changes (e.g. opening a detail view). */
export function useScrollToTopOnMount() {
  const pathname = usePathname();

  useEffect(() => {
    scrollPageToTop();
    requestAnimationFrame(scrollPageToTop);
  }, [pathname]);
}
