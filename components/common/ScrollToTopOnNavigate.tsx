'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function scrollPageToTop() {
  window.scrollTo({ top: 0, left: 0 });
  document.documentElement.scrollTo({ top: 0, left: 0 });
  document.body.scrollTo({ top: 0, left: 0 });
}

/** Scroll to top on client-side route changes (list → detail, etc.). */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    scrollPageToTop();
    requestAnimationFrame(scrollPageToTop);
  }, [pathname]);

  return null;
}
