'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Calendar } from 'lucide-react';
import { DatePicker } from '@/app/admin/profile/components/DatePicker';
import { parseInputDate, toInputDateValue } from '@/utils/date-format';

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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:min-w-[200px]">
        <Label
          htmlFor="search"
          className="flex min-h-10 shrink-0 items-end text-sm font-medium leading-snug"
        >
          Search Events
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description, or location..."
            className="h-10 pl-10"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 sm:flex-nowrap">
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="dateFrom"
            className="flex min-h-10 shrink-0 items-end gap-1.5 text-sm font-medium leading-snug"
          >
            <Calendar className="size-4 shrink-0" aria-hidden />
            <span>From</span>
          </Label>
          <DatePicker
            date={parseInputDate(dateFrom)}
            onDateChange={(date) => {
              const next = toInputDateValue(date);
              setDateFrom(next);
              if (dateTo && next && next > dateTo) {
                setDateTo(next);
              }
            }}
            placeholder="From"
            buttonClassName="h-10 w-[160px]"
            disabled={(date) => {
              const to = parseInputDate(dateTo);
              return to ? date > to : false;
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="dateTo"
            className="flex min-h-10 shrink-0 items-end text-sm font-medium leading-snug"
          >
            To
          </Label>
          <DatePicker
            date={parseInputDate(dateTo)}
            onDateChange={(date) => setDateTo(toInputDateValue(date))}
            placeholder="To"
            buttonClassName="h-10 w-[160px]"
            disabled={(date) => {
              const from = parseInputDate(dateFrom);
              return from ? date < from : false;
            }}
          />
        </div>
      </div>
    </div>
  );
}
