'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfToday,
  addMonths,
  subMonths,
  parseISO
} from 'date-fns';
import { enUS, uk } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronLeft, ChevronRight, ChevronDown, FileText } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { CalendarEvent, CalendarSchedule } from './actions';
import { SubscribeToCalendar } from './SubscribeToCalendar';
import { SchedulePreviewDialog } from './SchedulePreviewDialog';
import { useLanguage } from '@/providers/language-provider';
import { CALENDAR_CONTENT } from '@/content/calendar';

const WEEK_STARTS_ON_MONDAY = { weekStartsOn: 1 } as const;

// Helper function to format time from HH:MM:SS to readable format
function formatTime(timeString: string | null | undefined): string {
  if (!timeString) return '';

  const parts = timeString.split(':');
  if (parts.length < 2) return timeString;

  const hour = parseInt(parts[0] || '0', 10);
  const minute = parts[1] || '00';

  if (hour === 0) return `12:${minute} am`;
  if (hour < 12) return `${hour}:${minute} am`;
  if (hour === 12) return `12:${minute} pm`;
  return `${hour - 12}:${minute} pm`;
}

type MonthViewProps = {
  events: CalendarEvent[];
  schedules: CalendarSchedule[];
};

export function MonthView({ events, schedules }: MonthViewProps) {
  const { language } = useLanguage();
  const content = CALENDAR_CONTENT[language];
  const dateLocale = language === 'uk' ? uk : enUS;
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfToday());
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<{
    title: string;
    publicUrl: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate calendar days for month view (week starts on Monday)
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), WEEK_STARTS_ON_MONDAY);
    const end = endOfWeek(endOfMonth(currentMonth), WEEK_STARTS_ON_MONDAY);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Filter events for current month only
  const currentMonthEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = parseISO(event.date);
      return isSameMonth(eventDate, currentMonth);
    });
  }, [events, currentMonth]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const groups: Record<string, CalendarEvent[]> = {};

    events.forEach((event) => {
      // Format event date to yyyy-MM-dd to match calendar dateKey
      const eventDate = new Date(event.date);
      const dateKey = format(eventDate, 'yyyy-MM-dd');

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });

    return groups;
  }, [events]);

  const schedulesByDate = useMemo(() => {
    const groups: Record<string, CalendarSchedule[]> = {};

    schedules.forEach((schedule) => {
      const dateKey = format(new Date(schedule.date), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(schedule);
    });

    return groups;
  }, [schedules]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleThisMonth = () => {
    setCurrentMonth(startOfToday());
  };

  if (!mounted) {
    return <div className="w-full" suppressHydrationWarning />;
  }

  return (
    <div className="w-full">
      {/* Month Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            aria-label={content.navigation.previousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            aria-label={content.navigation.nextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleThisMonth}>
            {content.navigation.thisMonth}
          </Button>
        </div>

        {/* Month/Year Picker */}
        <Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
          <PopoverTrigger asChild>
            <button className="text-2xl font-normal hover:opacity-70 transition-opacity flex items-center gap-2">
              {format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}
              <ChevronDown className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              {/* Year Selector */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, -12))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-lg font-semibold">
                  {format(currentMonth, 'yyyy')}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 12))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => {
                  const monthDate = new Date(currentMonth.getFullYear(), index, 1);
                  const isSelected = isSameMonth(monthDate, currentMonth);
                  const monthLabel = format(monthDate, 'MMM', { locale: dateLocale });
                  return (
                    <Button
                      key={index}
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setCurrentMonth(monthDate);
                        setMonthPickerOpen(false);
                      }}
                      className={cn(
                        'w-full',
                        isSelected && 'bg-primary text-primary-foreground'
                      )}
                    >
                      {monthLabel}
                    </Button>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-muted">
          {(() => {
            const weekStart = startOfWeek(new Date(), WEEK_STARTS_ON_MONDAY);
            return [0, 1, 2, 3, 4, 5, 6].map((i) => {
              const d = new Date(weekStart);
              d.setDate(weekStart.getDate() + i);
              return (
                <div
                  key={i}
                  className="text-center text-sm font-medium py-3 border-r last:border-r-0"
                >
                  {format(d, 'EEEEE', { locale: dateLocale })}
                </div>
              );
            });
          })()}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {monthDays.map((day, index) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDate[dateKey] || [];
            const daySchedules = schedulesByDate[dateKey] || [];
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, startOfToday());
            const dayItems = [
              ...dayEvents.map((event) => ({ kind: 'event' as const, event })),
              ...daySchedules.map((schedule) => ({
                kind: 'schedule' as const,
                schedule
              }))
            ];

            return (
              <div
                key={index}
                className={cn(
                  'min-h-[120px] border-r border-b last:border-r-0 p-2',
                  !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
                  isToday && 'bg-primary/5'
                )}
              >
                {/* Day Number */}
                <div
                  className={cn(
                    'text-sm font-medium mb-1',
                    isToday && 'text-primary font-bold'
                  )}
                >
                  {format(day, 'd')}
                </div>

                {/* Events */}
                <div className="space-y-1">
                  {dayItems.slice(0, 3).map((item) => {
                    if (item.kind === 'schedule') {
                      return (
                        <button
                          key={`schedule-${item.schedule.id}`}
                          type="button"
                          onClick={() =>
                            setSelectedSchedule({
                              title: content.schedule.title,
                              publicUrl: item.schedule.publicUrl
                            })
                          }
                          className="w-full text-left block text-xs p-1 rounded truncate hover:opacity-80 bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100"
                          title={content.schedule.title}
                        >
                          <span className="inline-flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {content.schedule.title}
                          </span>
                        </button>
                      );
                    }

                    const title =
                      language === 'uk' && item.event.title_uk
                        ? item.event.title_uk
                        : item.event.title;
                    return (
                      <Link
                        key={item.event.id}
                        href={`/parents/calendar/${item.event.id}`}
                        className={cn(
                          'block text-xs p-1 rounded truncate hover:opacity-80',
                          item.event.start_time
                            ? 'bg-secondary text-secondary-foreground dark:bg-primary/30 dark:text-foreground'
                            : 'bg-muted text-foreground dark:bg-muted'
                        )}
                        title={title}
                      >
                        {item.event.start_time && (
                          <span className="font-medium">
                            {formatTime(item.event.start_time)}{' '}
                          </span>
                        )}
                        {title}
                      </Link>
                    );
                  })}
                  {dayItems.length > 3 && (
                    <div className="text-xs text-muted-foreground pl-1">
                      +{dayItems.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscribe Button - Only events from selected month */}
      <div className="flex justify-end mt-6">
        <SubscribeToCalendar
          events={currentMonthEvents.filter((event) => event.kind !== 'schedule')}
        />
      </div>

      <SchedulePreviewDialog
        schedule={selectedSchedule}
        onOpenChange={(open) => !open && setSelectedSchedule(null)}
      />
    </div>
  );
}
