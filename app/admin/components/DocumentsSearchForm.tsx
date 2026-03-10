'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS } from '@/app/admin/documents/constants';
import type { DocumentType } from '@/app/admin/documents/constants';

type DocumentsSearchFormProps = {
  initialSearch?: string;
  initialType?: string;
};

export function DocumentsSearchForm({
  initialSearch = '',
  initialType = ''
}: DocumentsSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrlRef = useRef<string | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [type, setType] = useState(initialType);

  useEffect(() => {
    setSearch(initialSearch);
    setType(initialType);
  }, [initialSearch, initialType]);

  useEffect(() => {
    const t = setTimeout(() => {
      const limit = searchParams.get('limit') || '20';
      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('limit', limit);
      if (search.trim()) params.set('search', search.trim());
      if (type) params.set('type', type);
      const q = params.toString();
      const nextUrl = `${pathname}?${q}`;
      if (lastUrlRef.current === nextUrl) return;
      lastUrlRef.current = nextUrl;
      router.replace(nextUrl);
    }, 250);
    return () => clearTimeout(t);
  }, [router, pathname, search, type, searchParams]);

  return (
    <div className="space-y-4 sm:flex sm:flex-wrap sm:items-end sm:gap-4">
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="documents-search" className="mb-1">Search documents</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="documents-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Title..."
            className="pl-10"
          />
        </div>
      </div>
      <div className="sm:w-48">
        <Label htmlFor="documents-type" className="mb-1">Type</Label>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Select value={type || 'all'} onValueChange={(v) => setType(v === 'all' ? '' : v)}>
            <SelectTrigger id="documents-type" className="pl-10">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {(DOCUMENT_TYPES as readonly string[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {DOCUMENT_TYPE_LABELS[t as DocumentType]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
