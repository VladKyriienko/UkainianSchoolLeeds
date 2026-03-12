'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';

export function TeacherSearchForm({
  initialSearch,
  initialCategory,
  initialLimit
}: {
  initialSearch: string;
  initialCategory: string;
  initialLimit: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const lastNavigatedUrlRef = useRef<string | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory || 'all');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = search.trim();
      const currentUrl = searchParamsString
        ? `${pathname}?${searchParamsString}`
        : pathname;

      // Build filters from scratch so we don't get stuck in loops with Next's internal params (e.g. `_rsc`)
      // Preserve current limit when user paginates.
      const currentParams = new URLSearchParams(searchParamsString);
      const currentLimit = currentParams.get('limit') || String(initialLimit);

      const nextParams = new URLSearchParams();
      nextParams.set('page', '1'); // reset on filter changes
      nextParams.set('limit', currentLimit);
      if (trimmed) nextParams.set('search', trimmed);
      if (category && category !== 'all') nextParams.set('category', category);

      const nextQueryString = nextParams.toString();
      const nextUrl = nextQueryString ? `${pathname}?${nextQueryString}` : pathname;

      // Compare against current URL, but ignore Next internal params by comparing
      // only relevant params (page/limit/search/category).
      const currentRelevant = new URLSearchParams();
      const currentPage = currentParams.get('page') || '1';
      currentRelevant.set('page', currentPage);
      currentRelevant.set('limit', currentLimit);
      const currentSearch = (currentParams.get('search') || '').trim();
      const currentCategory = currentParams.get('category') || 'all';
      if (currentSearch) currentRelevant.set('search', currentSearch);
      if (currentCategory !== 'all') currentRelevant.set('category', currentCategory);
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
  }, [router, pathname, search, category, searchParamsString, initialLimit]);

  return (
    <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:items-end">
      <div className="flex-1">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Search Teachers
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="sm:w-64">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Filter by Category
        </label>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="pl-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="HEADTEACHER">Headteacher</SelectItem>
              <SelectItem value="TEACHER">Teacher</SelectItem>
              <SelectItem value="STAF">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Keep the old minimal UI removed — this component is auto-applied (no buttons). */}
      {/* If you later want explicit "Search/Clear" buttons, we can add them like UserSearchForm. */}
      {/*
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="sm:max-w-md"
        />
      </div>
      */}
    </div>
  );
}

