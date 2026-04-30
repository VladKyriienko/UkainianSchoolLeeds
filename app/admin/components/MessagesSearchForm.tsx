'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { DatePicker } from '@/app/admin/profile/components/DatePicker';
import { parseInputDate, toInputDateValue } from '@/utils/date-format';

type MessagesSearchFormProps = {
  initialSearch?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
};

export function MessagesSearchForm({
  initialSearch = '',
  initialDateFrom = '',
  initialDateTo = ''
}: MessagesSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
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

  const searchParams = useSearchParams();
  useEffect(() => {
    const t = setTimeout(() => {
      const limit = searchParams.get('limit') || '20';
      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('limit', limit);
      if (search.trim()) params.set('search', search.trim());
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      const q = params.toString();
      const nextUrl = `${pathname}?${q}`;
      if (lastUrlRef.current === nextUrl) return;
      lastUrlRef.current = nextUrl;
      router.replace(nextUrl);
    }, 250);
    return () => clearTimeout(t);
  }, [router, pathname, search, dateFrom, dateTo, searchParams]);

  return (
    <div className="space-y-4 sm:flex sm:items-end sm:gap-4">
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="messages-search" className="mb-1">Search messages</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="messages-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Email, name, subject or message..."
            className="pl-10"
          />
        </div>
      </div>
      <div className="min-w-[160px]">
        <Label htmlFor="messages-date-from" className="mb-1">From</Label>
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
          buttonClassName="h-10"
          disabled={(date) => {
            const to = parseInputDate(dateTo);
            return to ? date > to : false;
          }}
        />
      </div>
      <div className="min-w-[160px]">
        <Label htmlFor="messages-date-to" className="mb-1">To</Label>
        <DatePicker
          date={parseInputDate(dateTo)}
          onDateChange={(date) => {
            const next = toInputDateValue(date);
            setDateTo(next);
          }}
          placeholder="To date"
          buttonClassName="h-10"
          disabled={(date) => {
            const from = parseInputDate(dateFrom);
            return from ? date < from : false;
          }}
        />
      </div>
    </div>
  );
}
