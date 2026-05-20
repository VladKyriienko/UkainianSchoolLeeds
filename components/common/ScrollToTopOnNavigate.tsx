'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function scrollPageToTop() {
  window.scrollTo({ top: 0, left: 0 });
  document.documentElement.scrollTo({ top: 0, left: 0 });
  document.body.scrollTo({ top: 0, left: 0 });
}

/** Set when navigation is browser back/forward (popstate), including `router.back()`. */
let pendingPopNavigation = false;

function useListenForPopNavigation() {
  useEffect(() => {
    const onPopState = () => {
      pendingPopNavigation = true;
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
}

/** Scroll to top on forward navigations; preserve position on back/forward. */
export function useScrollToTopOnPathnameChange() {
  const pathname = usePathname();
  useListenForPopNavigation();

  useEffect(() => {
    if (pendingPopNavigation) {
      pendingPopNavigation = false;
      return;
    }
    scrollPageToTop();
    requestAnimationFrame(scrollPageToTop);
  }, [pathname]);
}

/** Scroll to top on client-side route changes (list → detail, etc.). */
export function ScrollToTopOnNavigate() {
  useScrollToTopOnPathnameChange();
  return null;
}
