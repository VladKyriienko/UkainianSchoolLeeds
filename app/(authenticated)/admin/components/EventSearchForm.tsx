'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function EventSearchForm({
  initialSearch,
  initialLimit
}: {
  initialSearch: string;
  initialLimit: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const lastNavigatedUrlRef = useRef<string | null>(null);
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = search.trim();
      const currentUrl = searchParamsString
        ? `${pathname}?${searchParamsString}`
        : pathname;

      const currentParams = new URLSearchParams(searchParamsString);
      const currentLimit = currentParams.get('limit') || String(initialLimit);

      const nextParams = new URLSearchParams();
      nextParams.set('page', '1');
      nextParams.set('limit', currentLimit);
      if (trimmed) nextParams.set('search', trimmed);

      const nextQueryString = nextParams.toString();
      const nextUrl = nextQueryString ? `${pathname}?${nextQueryString}` : pathname;

      const currentRelevant = new URLSearchParams();
      const currentPage = currentParams.get('page') || '1';
      currentRelevant.set('page', currentPage);
      currentRelevant.set('limit', currentLimit);
      const currentSearch = (currentParams.get('search') || '').trim();
      if (currentSearch) currentRelevant.set('search', currentSearch);
      const currentRelevantString = currentRelevant.toString();
      const currentRelevantUrl = currentRelevantString
        ? `${pathname}?${currentRelevantString}`
        : pathname;

      if (nextUrl === currentRelevantUrl || nextUrl === currentUrl) return;
      if (lastNavigatedUrlRef.current === nextUrl) return;

      lastNavigatedUrlRef.current = nextUrl;
      router.replace(nextUrl);
    }, 250);

    return () => clearTimeout(timeout);
  }, [router, pathname, search, searchParamsString, initialLimit]);

  return (
    <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:items-end">
      <div className="flex-1">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Search Events
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description, or location..."
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
}
