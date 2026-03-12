'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Calendar } from 'lucide-react';

export function EventSearchForm({
  initialSearch,
  initialLimit,
  initialDateFrom,
  initialDateTo
}: {
  initialSearch: string;
  initialLimit: number;
  initialDateFrom?: string;
  initialDateTo?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const lastNavigatedUrlRef = useRef<string | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [dateFrom, setDateFrom] = useState(initialDateFrom ?? '');
  const [dateTo, setDateTo] = useState(initialDateTo ?? '');

  useEffect(() => {
    setDateFrom(initialDateFrom ?? '');
    setDateTo(initialDateTo ?? '');
  }, [initialDateFrom, initialDateTo]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = search.trim();
      const currentParams = new URLSearchParams(searchParamsString);
      const currentLimit = currentParams.get('limit') || String(initialLimit);

      const nextParams = new URLSearchParams();
      nextParams.set('page', '1');
      nextParams.set('limit', currentLimit);
      if (trimmed) nextParams.set('search', trimmed);
      if (dateFrom) nextParams.set('dateFrom', dateFrom);
      if (dateTo) nextParams.set('dateTo', dateTo);

      const nextQueryString = nextParams.toString();
      const nextUrl = nextQueryString ? `${pathname}?${nextQueryString}` : pathname;

      const currentRelevant = new URLSearchParams();
      currentRelevant.set('page', currentParams.get('page') || '1');
      currentRelevant.set('limit', currentLimit);
      const currentSearch = (currentParams.get('search') || '').trim();
      if (currentSearch) currentRelevant.set('search', currentSearch);
      if (currentParams.get('dateFrom')) currentRelevant.set('dateFrom', currentParams.get('dateFrom')!);
      if (currentParams.get('dateTo')) currentRelevant.set('dateTo', currentParams.get('dateTo')!);
      const currentRelevantString = currentRelevant.toString();
      const currentRelevantUrl = currentRelevantString
        ? `${pathname}?${currentRelevantString}`
        : pathname;

      const currentUrl = searchParamsString ? `${pathname}?${searchParamsString}` : pathname;
      if (nextUrl === currentRelevantUrl || nextUrl === currentUrl) return;
      if (lastNavigatedUrlRef.current === nextUrl) return;

      lastNavigatedUrlRef.current = nextUrl;
      router.replace(nextUrl);
    }, 250);

    return () => clearTimeout(timeout);
  }, [router, pathname, search, dateFrom, dateTo, searchParamsString, initialLimit]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="search" className="mb-1">
            Search Events
          </Label>
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
        <div className="flex gap-4 flex-wrap items-end">
          <div className="space-y-1">
            <Label htmlFor="dateFrom" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              From
            </Label>
            <Input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-[160px]"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="dateTo">
              To
            </Label>
            <Input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-[160px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
