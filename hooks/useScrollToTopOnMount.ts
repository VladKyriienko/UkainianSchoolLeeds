'use client';

import { useEffect } from 'react';

/** Scroll window to top when a public content page mounts (e.g. after in-app navigation). */
export function useScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);
}
