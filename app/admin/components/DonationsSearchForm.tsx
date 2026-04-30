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
    <div className="space-y-4 sm:flex sm:flex-wrap sm:items-end sm:gap-4">
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="donations-search" className="mb-1">Search by email</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="donations-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Donor email..."
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex gap-4 flex-wrap items-end">
        <div className="space-y-1">
          <Label htmlFor="donations-dateFrom" className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            From
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
        <div className="space-y-1">
          <Label htmlFor="donations-dateTo">To</Label>
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
