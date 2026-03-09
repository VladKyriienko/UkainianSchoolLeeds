'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

type UserSearchFormProps = {
  initialSearch?: string;
  initialRole?: string;
};

export function UserSearchForm({
  initialSearch = '',
  initialRole = 'all'
}: UserSearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [role, setRole] = useState(initialRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters();
  };

  const updateFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      // Reset to page 1 when filtering
      params.set('page', '1');

      if (search.trim()) {
        params.set('search', search.trim());
      } else {
        params.delete('search');
      }

      if (role !== 'all') {
        params.set('role', role);
      } else {
        params.delete('role');
      }

      router.push(`/admin/users?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearch('');
    setRole('all');
    startTransition(() => {
      router.push('/admin/users');
    });
  };

  const hasActiveFilters = search.trim() || role !== 'all';

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:items-end"
    >
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
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 sm:flex-none"
        >
          {isPending ? 'Searching...' : 'Search'}
        </Button>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={clearFilters}
            disabled={isPending}
            className="flex-1 sm:flex-none"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </form>
  );
}
