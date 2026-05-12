'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Calendar } from 'lucide-react';
import { DatePicker } from '@/app/admin/profile/components/DatePicker';
import { parseInputDate, toInputDateValue } from '@/utils/date-format';

type DonationsSearchFormProps = {
  initialSearch?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  initialLimit?: number;
};

export function DonationsSearchForm({
  initialSearch = '',
  initialDateFrom = '',
  initialDateTo = '',
  initialLimit = 20
}: DonationsSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const lastUrlRef = useRef<string | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);

  useEffect(() => {
    setSearch(initialSearch);
    setDateFrom(initialDateFrom);
    setDateTo(initialDateTo);
  }, [initialSearch, initialDateFrom, initialDateTo]);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('limit', String(initialLimit));
      if (search.trim()) params.set('search', search.trim());
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      const q = params.toString();
      const nextUrl = q ? `${pathname}?${q}` : pathname;
      if (lastUrlRef.current === nextUrl) return;
      lastUrlRef.current = nextUrl;
      router.replace(nextUrl);
    }, 250);
    return () => clearTimeout(t);
  }, [router, pathname, search, dateFrom, dateTo, initialLimit]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:min-w-[200px]">
        <Label
          htmlFor="donations-search"
          className="flex min-h-10 shrink-0 items-end text-sm font-medium leading-snug"
        >
          Search by email
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="donations-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Donor email..."
            className="h-10 pl-10"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 sm:flex-nowrap">
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="donations-dateFrom"
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
            buttonClassName="h-10 w-[160px]"
            disabled={(date) => {
              const to = parseInputDate(dateTo);
              return to ? date > to : false;
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="donations-dateTo"
            className="flex min-h-10 shrink-0 items-end text-sm font-medium leading-snug"
          >
            To
          </Label>
          <DatePicker
            date={parseInputDate(dateTo)}
            onDateChange={(date) => setDateTo(toInputDateValue(date))}
            placeholder="To date"
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
