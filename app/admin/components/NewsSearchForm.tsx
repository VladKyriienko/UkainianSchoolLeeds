'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Calendar } from 'lucide-react';

type NewsSearchFormProps = {
  initialSearch?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
};

export function NewsSearchForm({
  initialSearch = '',
  initialDateFrom = '',
  initialDateTo = ''
}: NewsSearchFormProps) {
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
    <div className="space-y-4 sm:flex sm:flex-wrap sm:items-end sm:gap-4">
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="news-search" className="mb-1">Search by title</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="news-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Title..."
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex gap-4 flex-wrap items-end">
        <div className="space-y-1">
          <Label htmlFor="news-dateFrom" className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Date from
          </Label>
          <Input
            id="news-dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-[160px]"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="news-dateTo">Date to</Label>
          <Input
            id="news-dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-[160px]"
          />
        </div>
      </div>
    </div>
  );
}
