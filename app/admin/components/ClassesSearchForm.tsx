'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

type ClassesSearchFormProps = {
  initialSearch?: string;
};

export function ClassesSearchForm({ initialSearch = '' }: ClassesSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const lastUrlRef = useRef<string | null>(null);
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  const searchParams = useSearchParams();
  useEffect(() => {
    const t = setTimeout(() => {
      const limit = searchParams.get('limit') || '20';
      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('limit', limit);
      if (search.trim()) params.set('search', search.trim());
      const q = params.toString();
      const nextUrl = `${pathname}?${q}`;
      if (lastUrlRef.current === nextUrl) return;
      lastUrlRef.current = nextUrl;
      router.replace(nextUrl);
    }, 250);
    return () => clearTimeout(t);
  }, [router, pathname, search, searchParams]);

  return (
    <div className="flex flex-col gap-4 sm:max-w-md">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:min-w-[200px]">
        <Label
          htmlFor="classes-search"
          className="flex min-h-10 shrink-0 items-end text-sm font-medium leading-snug"
        >
          Search classes
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="classes-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Title..."
            className="h-10 pl-10"
          />
        </div>
      </div>
    </div>
  );
}
