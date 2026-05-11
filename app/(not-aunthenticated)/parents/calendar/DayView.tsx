'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  format,
  startOfToday,
  addDays,
  subDays
} from 'date-fns';
import { enUS, uk } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronLeft, ChevronRight, ChevronDown, FileText } from 'lucide-react';
import type { CalendarEvent, CalendarSchedule } from './actions';
import { SubscribeToCalendar } from './SubscribeToCalendar';
import { SchedulePreviewDialog } from './SchedulePreviewDialog';
import { useLanguage } from '@/providers/language-provider';
import { CALENDAR_CONTENT } from '@/content/calendar';
import { isHtmlContent } from '@/utils/rich-text';

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
  schedules: CalendarSchedule[];
};

export function DayView({ events, schedules }: DayViewProps) {
  const { language } = useLanguage();
  const content = CALENDAR_CONTENT[language];
  const dateLocale = language === 'uk' ? uk : enUS;
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(startOfToday());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<{
    title: string;
    publicUrl: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get events for the current day
  const dayEvents = useMemo(() => {
    const dateKey = format(currentDate, 'yyyy-MM-dd');

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      const eventDateKey = format(eventDate, 'yyyy-MM-dd');
      return eventDateKey === dateKey;
    });
  }, [events, currentDate]);

  const daySchedules = useMemo(() => {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    return schedules.filter((schedule) => {
      const scheduleDateKey = format(new Date(schedule.date), 'yyyy-MM-dd');
      return scheduleDateKey === dateKey;
    });
  }, [schedules, currentDate]);

  const dayItems = useMemo(
    () => [
      ...dayEvents.map((event) => ({ kind: 'event' as const, event })),
      ...daySchedules.map((schedule) => ({
        kind: 'schedule' as const,
        schedule
      }))
    ],
    [dayEvents, daySchedules]
  );

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

  if (!mounted) {
    return <div className="w-full" suppressHydrationWarning />;
  }

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
              {format(currentDate, 'MMMM d, yyyy', { locale: dateLocale })}
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
        {dayItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {content.messages.noEventsForDay}
          </div>
        ) : (
          <div className="space-y-0">
            {dayItems.map((item) => {
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
                    className="w-full text-left block border-b last:border-b-0 p-6 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex gap-6">
                      <div className="min-w-[100px] text-muted-foreground">
                        <FileText className="h-4 w-4 mt-1" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 text-base text-foreground/60">
                          {format(currentDate, 'MMMM d', { locale: dateLocale })}
                        </div>
                        <h3 className="font-semibold leading-snug font-display text-foreground mb-2">
                          {content.schedule.title}
                        </h3>
                        <div className="text-base text-muted-foreground">
                          {content.schedule.openPdf}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              }

              const event = item.event;
              const eventDate = new Date(event.date);
              const title =
                language === 'uk' && event.title_uk ? event.title_uk : event.title;
              const location =
                language === 'uk' && event.location_uk
                  ? event.location_uk
                  : event.location;
              const description =
                language === 'uk' && event.description_uk
                  ? event.description_uk
                  : event.description;

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
                      <div className="mb-2 text-base text-foreground/60">
                        {format(eventDate, 'MMMM d', { locale: dateLocale })}
                        {event.start_time && (
                          <>
                            {' @ '}
                            {formatTime(event.start_time)}
                            {event.end_time && ` - ${formatTime(event.end_time)}`}
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold leading-snug font-display text-foreground mb-2">
                        {title}
                      </h3>

                      {/* Location */}
                      {location && (
                        <div className="text-base text-muted-foreground">
                          <span className="font-medium">Meanwood School</span> {location}
                        </div>
                      )}

                      {/* Description */}
                      {description && (
                        isHtmlContent(description) ? (
                          <div
                            className="rich-text-preview mt-2"
                            dangerouslySetInnerHTML={{ __html: description }}
                          />
                        ) : (
                          <div className="mt-2 text-base text-muted-foreground">
                            {description}
                          </div>
                        )
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
        <SubscribeToCalendar events={dayEvents.filter((event) => event.kind !== 'schedule')} />
      </div>

      <SchedulePreviewDialog
        schedule={selectedSchedule}
        onOpenChange={(open) => !open && setSelectedSchedule(null)}
      />
    </div>
  );
}
