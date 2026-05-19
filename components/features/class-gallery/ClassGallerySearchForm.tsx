'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Filter } from 'lucide-react';
import type { AdminClass } from '@/app/admin/classes/actions';

type ClassGallerySearchFormProps = {
  classes: AdminClass[];
  initialClassId?: string;
};

export function ClassGallerySearchForm({
  classes: classesList,
  initialClassId = ''
}: ClassGallerySearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const lastUrlRef = useRef<string | null>(null);
  const [classId, setClassId] = useState(initialClassId);

  useEffect(() => {
    setClassId(initialClassId);
  }, [initialClassId]);

  const searchParams = useSearchParams();
  useEffect(() => {
    const limit = searchParams.get('limit') || '20';
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('limit', limit);
    if (classId) params.set('classId', classId);
    const q = params.toString();
    const nextUrl = `${pathname}?${q}`;
    if (lastUrlRef.current === nextUrl) return;
    lastUrlRef.current = nextUrl;
    router.replace(nextUrl);
  }, [router, pathname, classId, searchParams]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
      <div className="flex min-w-0 flex-col gap-1.5 sm:w-64">
        <Label
          htmlFor="gallery-class"
          className="flex min-h-10 shrink-0 items-end text-sm font-medium leading-snug"
        >
          Filter by class
        </Label>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Select value={classId || 'all'} onValueChange={(v) => setClassId(v === 'all' ? '' : v)}>
            <SelectTrigger id="gallery-class" className="h-10 pl-10">
              <SelectValue placeholder="All classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classes</SelectItem>
              {classesList.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
