'use client';

import { Input } from '@/components/ui/input';
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
    <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:items-end">
      <div className="flex-1">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Search Users
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            id="search"
            type="text"
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="sm:w-48">
        <label
          htmlFor="role"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Filter by Role
        </label>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="pl-10">
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
