'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Search } from 'lucide-react';
import { DatePicker } from '@/components/common/admin/DatePicker';
import { parseInputDate, toInputDateValue } from '@/utils/date-format';

type AdminListSearchFormProps = {
  searchLabel?: string;
  searchPlaceholder?: string;
  searchInputId?: string;
  searchParamKey?: string;
  showSearch?: boolean;
  showDateRange?: boolean;
  initialSearch?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  fixedLimit?: number;
  className?: string;
};

export function AdminListSearchForm({
  searchLabel = 'Search',
  searchPlaceholder = 'Search…',
  searchInputId = 'admin-list-search',
  searchParamKey = 'search',
  showSearch = true,
  showDateRange = true,
  initialSearch = '',
  initialDateFrom = '',
  initialDateTo = '',
  fixedLimit,
  className
}: AdminListSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrlRef = useRef<string | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setDateFrom(initialDateFrom);
  }, [initialDateFrom]);

  useEffect(() => {
    setDateTo(initialDateTo);
  }, [initialDateTo]);

  useEffect(() => {
    const t = setTimeout(() => {
      const limit =
        fixedLimit !== undefined
          ? String(fixedLimit)
          : searchParams.get('limit') || '20';
      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('limit', limit);
      if (showSearch && search.trim()) {
        params.set(searchParamKey, search.trim());
      }
      if (showDateRange && dateFrom) params.set('dateFrom', dateFrom);
      if (showDateRange && dateTo) params.set('dateTo', dateTo);
      const q = params.toString();
      const nextUrl = q ? `${pathname}?${q}` : pathname;
      if (lastUrlRef.current === nextUrl) return;
      lastUrlRef.current = nextUrl;
      router.replace(nextUrl);
    }, 250);
    return () => clearTimeout(t);
  }, [
    router,
    pathname,
    search,
    dateFrom,
    dateTo,
    searchParams,
    showSearch,
    showDateRange,
    searchParamKey,
    fixedLimit
  ]);

  return (
    <div
      className={
        className ??
        (showSearch
          ? 'flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4'
          : 'flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4')
      }
    >
      {showSearch ? (
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:min-w-50">
          <Label
            htmlFor={searchInputId}
            className="flex min-h-10 shrink-0 items-end text-sm font-medium leading-snug"
          >
            {searchLabel}
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={searchInputId}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 pl-10"
            />
          </div>
        </div>
      ) : null}
      {showDateRange ? (
        <div className="flex flex-wrap gap-4 sm:flex-nowrap">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor={`${searchInputId}-date-from`}
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
              placeholder="From date"
              buttonClassName="h-10 w-40"
              disabled={(date) => {
                const to = parseInputDate(dateTo);
                return to ? date > to : false;
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor={`${searchInputId}-date-to`}
              className="flex min-h-10 shrink-0 items-end text-sm font-medium leading-snug"
            >
              To
            </Label>
            <DatePicker
              date={parseInputDate(dateTo)}
              onDateChange={(date) => setDateTo(toInputDateValue(date))}
              placeholder="To date"
              buttonClassName="h-10 w-40"
              disabled={(date) => {
                const from = parseInputDate(dateFrom);
                return from ? date < from : false;
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
