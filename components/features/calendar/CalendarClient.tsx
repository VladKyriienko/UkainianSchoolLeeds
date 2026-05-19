'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import type { CalendarEvent, CalendarSchedule } from '@/types/calendar';
import { MonthView } from './MonthView';
import { ListView } from './ListView';
import { DayView } from './DayView';
import { useLanguage } from '@/providers/language-provider';
import { CALENDAR_CONTENT } from '@/content/calendar';

const VIEW_PARAM = 'view';
type ViewMode = 'list' | 'month' | 'day';

function parseViewMode(value: string | null): ViewMode {
  if (value === 'list' || value === 'month' || value === 'day') return value;
  return 'list';
}

export type CalendarClientProps = {
  initialEvents: CalendarEvent[];
  initialSchedules: CalendarSchedule[];
};

export function CalendarClient({ initialEvents, initialSchedules }: CalendarClientProps) {
  const { language } = useLanguage();
  const content = CALENDAR_CONTENT[language];
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const viewFromUrl = parseViewMode(searchParams.get(VIEW_PARAM));
  const [viewMode, setViewModeState] = useState<ViewMode>(viewFromUrl);

  const setViewMode = useCallback(
    (mode: ViewMode) => {
      setViewModeState(mode);
      const params = new URLSearchParams(searchParams.toString());
      params.set(VIEW_PARAM, mode);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Keep state in sync with URL (e.g. browser back/forward)
  useEffect(() => {
    const next = parseViewMode(searchParams.get(VIEW_PARAM));
    setViewModeState(next);
  }, [searchParams]);

  const [search, setSearch] = useState('');

  // Filter events based on search only
  const searchFilteredEvents = useMemo(() => {
    if (!search.trim()) return initialEvents;

    const searchLower = search.toLowerCase();
    return initialEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(searchLower) ||
        event.title_uk?.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.description_uk?.toLowerCase().includes(searchLower) ||
        event.location?.toLowerCase().includes(searchLower) ||
        event.location_uk?.toLowerCase().includes(searchLower)
    );
  }, [initialEvents, search]);

  return (
    <div className="w-full">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 p-4 bg-background border rounded-lg">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={content.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 "
          />
        </div>

        {/* View Mode Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode('list')}
            variant={viewMode === 'list' ? 'default' : 'outline'}
            className={cn(viewMode === 'list' && 'bg-primary text-primary-foreground')}
          >
            {content.viewModes.list}
          </Button>
          <Button
            onClick={() => setViewMode('month')}
            variant={viewMode === 'month' ? 'default' : 'outline'}
            className={cn(viewMode === 'month' && 'bg-primary text-primary-foreground')}
          >
            {content.viewModes.month}
          </Button>
          <Button
            onClick={() => setViewMode('day')}
            variant={viewMode === 'day' ? 'default' : 'outline'}
            className={cn(viewMode === 'day' && 'bg-primary text-primary-foreground')}
          >
            {content.viewModes.day}
          </Button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <ListView
          events={searchFilteredEvents}
          schedules={initialSchedules}
        />
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <MonthView events={searchFilteredEvents} schedules={initialSchedules} />
      )}

      {/* Day View */}
      {viewMode === 'day' && (
        <DayView events={searchFilteredEvents} schedules={initialSchedules} />
      )}
    </div>
  );
}
