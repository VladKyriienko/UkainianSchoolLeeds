'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  format,
  startOfToday,
  addDays,
  subDays
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import type { CalendarEvent } from './actions';
import { SubscribeToCalendar } from './SubscribeToCalendar';
import { useLanguage } from '@/providers/language-provider';
import { CALENDAR_CONTENT } from '@/content/calendar';

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

type DayViewProps = {
  events: CalendarEvent[];
};

export function DayView({ events }: DayViewProps) {
  const { language } = useLanguage();
  const content = CALENDAR_CONTENT[language];
  const [currentDate, setCurrentDate] = useState(startOfToday());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Get events for the current day
  const dayEvents = useMemo(() => {
    const dateKey = format(currentDate, 'yyyy-MM-dd');

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      const eventDateKey = format(eventDate, 'yyyy-MM-dd');
      return eventDateKey === dateKey;
    });
  }, [events, currentDate]);

  // Navigation handlers
  const handlePrevDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };

  const handleNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(startOfToday());
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
      setDatePickerOpen(false);
    }
  };

  return (
    <div className="w-full">
      {/* Day Navigation */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevDay}
            aria-label={content.navigation.previousDay}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextDay}
            aria-label={content.navigation.nextDay}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleToday}>
            {content.navigation.today}
          </Button>
        </div>

        {/* Date Picker */}
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <button className="text-2xl font-normal hover:opacity-70 transition-opacity flex items-center gap-2">
              {format(currentDate, 'MMMM d, yyyy')}
              <ChevronDown className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={handleDateSelect}
              defaultMonth={currentDate}
              initialFocus
              className="rounded-md"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Day Timeline */}
      <div className="border rounded-lg">
        {dayEvents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {content.messages.noEventsForDay}
          </div>
        ) : (
          <div className="space-y-0">
            {dayEvents.map((event) => {
              const eventDate = new Date(event.date);

              return (
                <Link
                  key={event.id}
                  href={`/parents/calendar/${event.id}`}
                  className="block border-b last:border-b-0 p-6 hover:bg-muted/30 transition-colors"
                >
                  {/* Time Label on Left */}
                  <div className="flex gap-6">
                    <div className="min-w-[100px] text-muted-foreground">
                      {event.start_time && formatTime(event.start_time)}
                    </div>

                    {/* Event Content */}
                    <div className="flex-1">
                      {/* Date and Time */}
                      <div className="text-sm text-foreground/60 mb-2">
                        {format(eventDate, 'MMMM d')}
                        {event.start_time && (
                          <>
                            {' @ '}
                            {formatTime(event.start_time)}
                            {event.end_time && ` - ${formatTime(event.end_time)}`}
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-semibold mb-2">
                        {event.title}
                      </h3>

                      {/* Location */}
                      {event.location && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Meanwood School</span> {event.location}
                        </div>
                      )}

                      {/* Description */}
                      {event.description && (
                        <div className="text-sm text-muted-foreground mt-2">
                          {event.description}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="ghost"
          onClick={handlePrevDay}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {content.navigation.previousDay}
        </Button>
        <Button
          variant="ghost"
          onClick={handleNextDay}
          className="text-muted-foreground hover:text-foreground"
        >
          {content.navigation.nextDay}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Subscribe Button - Only events from selected day */}
      <div className="flex justify-end mt-6">
        <SubscribeToCalendar events={dayEvents} />
      </div>
    </div>
  );
}
