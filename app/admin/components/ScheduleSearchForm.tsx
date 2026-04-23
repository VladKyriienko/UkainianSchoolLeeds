'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';

type ScheduleSearchFormProps = {
  initialDateFrom?: string;
  initialDateTo?: string;
};

export function ScheduleSearchForm({
  initialDateFrom = '',
  initialDateTo = ''
}: ScheduleSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrlRef = useRef<string | null>(null);
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);

  useEffect(() => {
    setDateFrom(initialDateFrom);
    setDateTo(initialDateTo);
  }, [initialDateFrom, initialDateTo]);

  useEffect(() => {
    const t = setTimeout(() => {
      const limit = searchParams.get('limit') || '20';
      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('limit', limit);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);

      const nextUrl = `${pathname}?${params.toString()}`;
      if (lastUrlRef.current === nextUrl) return;
      lastUrlRef.current = nextUrl;
      router.replace(nextUrl);
    }, 250);

    return () => clearTimeout(t);
  }, [router, pathname, dateFrom, dateTo, searchParams]);

  return (
    <div className="space-y-4 sm:flex sm:flex-wrap sm:items-end sm:gap-4">
      <div className="flex gap-4 flex-wrap items-end">
        <div className="space-y-1">
          <Label htmlFor="schedule-dateFrom" className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Date from
          </Label>
          <Input
            id="schedule-dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-[180px]"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="schedule-dateTo">Date to</Label>
          <Input
            id="schedule-dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-[180px]"
          />
        </div>
      </div>
    </div>
  );
}
