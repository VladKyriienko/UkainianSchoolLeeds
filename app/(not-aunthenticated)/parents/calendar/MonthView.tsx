'use client';

import { useState, useMemo } from 'react';
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
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { CalendarEvent } from './actions';
import { SubscribeToCalendar } from './SubscribeToCalendar';

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
};

export function MonthView({ events }: MonthViewProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfToday());
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);

  // Generate calendar days for month view
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
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

  return (
    <div className="w-full">
      {/* Month Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleThisMonth}>
            This Month
          </Button>
        </div>

        {/* Month/Year Picker */}
        <Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
          <PopoverTrigger asChild>
            <button className="text-2xl font-normal hover:opacity-70 transition-opacity flex items-center gap-2">
              {format(currentMonth, 'MMMM yyyy')}
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
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
                  (month, index) => {
                    const monthDate = new Date(currentMonth.getFullYear(), index, 1);
                    const isSelected = isSameMonth(monthDate, currentMonth);
                    return (
                      <Button
                        key={month}
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
                        {month}
                      </Button>
                    );
                  }
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-muted">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <div
              key={index}
              className="text-center text-sm font-medium py-3 border-r last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {monthDays.map((day, index) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDate[dateKey] || [];
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, startOfToday());

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
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        'text-xs p-1 rounded truncate cursor-pointer hover:opacity-80',
                        event.start_time
                          ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                          : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      )}
                      title={event.title}
                    >
                      {event.start_time && (
                        <span className="font-medium">
                          {formatTime(event.start_time)}{' '}
                        </span>
                      )}
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground pl-1">
                      +{dayEvents.length - 3} more
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
        <SubscribeToCalendar events={currentMonthEvents} />
      </div>
    </div>
  );
}
