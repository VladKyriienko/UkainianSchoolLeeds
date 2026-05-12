'use client';

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
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type UserSearchFormProps = {
  initialSearch?: string;
  initialRole?: string;
};

export function UserSearchForm({
  initialSearch = '',
  initialRole = 'all'
}: UserSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrlRef = useRef<string | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [role, setRole] = useState(initialRole);

  useEffect(() => {
    setSearch(initialSearch);
    setRole(initialRole);
  }, [initialSearch, initialRole]);

  useEffect(() => {
    const t = setTimeout(() => {
      const limit = searchParams.get('limit') || '20';
      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('limit', limit);
      if (search.trim()) params.set('search', search.trim());
      if (role !== 'all') params.set('role', role);
      const q = params.toString();
      const nextUrl = `${pathname}?${q}`;
      if (lastUrlRef.current === nextUrl) return;
      lastUrlRef.current = nextUrl;
      router.replace(nextUrl);
    }, 250);
    return () => clearTimeout(t);
  }, [router, pathname, search, role, searchParams]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:min-w-[200px]">
        <Label
          htmlFor="search"
          className="flex min-h-10 shrink-0 items-end text-sm font-medium leading-snug"
        >
          Search Users
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            type="text"
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-10"
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-1.5 sm:w-48">
        <Label
          htmlFor="role"
          className="flex min-h-10 shrink-0 items-end text-sm font-medium leading-snug"
        >
          Filter by Role
        </Label>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role" className="h-10 pl-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
