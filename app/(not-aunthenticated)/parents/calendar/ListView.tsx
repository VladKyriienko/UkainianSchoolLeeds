'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { format, startOfToday, isSameDay, parseISO } from 'date-fns';
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

const EVENTS_PER_PAGE = 10;

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

type ListViewProps = {
  events: CalendarEvent[];
  schedules: CalendarSchedule[];
};

type CalendarListItem =
  | (CalendarEvent & { kind: 'event' })
  | {
    kind: 'schedule';
    id: string;
    date: string;
    title: string;
    description: string | null;
    start_time: null;
    end_time: null;
    location: null;
    publicUrl: string;
  };

export function ListView({ events, schedules }: ListViewProps) {
  const { language } = useLanguage();
  const content = CALENDAR_CONTENT[language];
  const dateLocale = language === 'uk' ? uk : enUS;
  const [startDate, setStartDate] = useState<Date | undefined>(startOfToday());
  const [currentPage, setCurrentPage] = useState(1);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [showSelectedDateInTitle, setShowSelectedDateInTitle] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<{
    title: string;
    publicUrl: string;
  } | null>(null);

  const allItems = useMemo<CalendarListItem[]>(() => {
    const scheduleItems: CalendarListItem[] = schedules.map((s) => ({
      kind: 'schedule',
      id: `schedule-${s.id}`,
      date: s.date,
      title: content.schedule.title,
      description: null,
      start_time: null,
      end_time: null,
      location: null,
      publicUrl: s.publicUrl
    }));

    const eventItems: CalendarListItem[] = events.map((e) => ({
      ...e,
      kind: 'event'
    }));

    return [...eventItems, ...scheduleItems].sort((a, b) => {
      const ad = parseISO(a.date).getTime();
      const bd = parseISO(b.date).getTime();
      if (ad !== bd) return ad - bd;
      return (a.start_time ?? '').localeCompare(b.start_time ?? '');
    });
  }, [events, schedules, content.schedule.title]);

  // Filter events by start date
  const filteredItems = useMemo(() => {
    if (!startDate) return allItems;

    return allItems.filter((item) => {
      const eventDate = parseISO(item.date);
      return eventDate >= startDate || isSameDay(eventDate, startDate);
    });
  }, [allItems, startDate]);

  // Paginate events
  const totalPages = Math.ceil(filteredItems.length / EVENTS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + EVENTS_PER_PAGE);
  }, [filteredItems, currentPage]);

  // Calculate date range label
  const dateRangeLabel = useMemo(() => {
    if (paginatedItems.length === 0) return content.messages.noEvents;

    const firstEvent = paginatedItems[0];
    const lastEvent = paginatedItems[paginatedItems.length - 1];
    if (!firstEvent || !lastEvent) return content.messages.noEvents;

    const first = parseISO(firstEvent.date);
    const last = parseISO(lastEvent.date);
    const today = startOfToday();

    if (isSameDay(first, last)) {
      return format(first, 'MMMM d', { locale: dateLocale });
    }

    let displayStartDate: Date;
    let showAsNow = false;

    if (showSelectedDateInTitle && startDate) {
      displayStartDate = startDate;
      showAsNow = isSameDay(startDate, today);
    } else {
      displayStartDate = first;
      showAsNow = false;
    }

    if (isSameDay(displayStartDate, last)) {
      return format(displayStartDate, 'MMMM d', { locale: dateLocale });
    }

    const startLabel = showAsNow
      ? content.navigation.now
      : format(displayStartDate, 'MMMM d', { locale: dateLocale });
    return `${startLabel} - ${format(last, 'MMMM d', { locale: dateLocale })}`;
  }, [
    paginatedItems,
    startDate,
    showSelectedDateInTitle,
    content.messages.noEvents,
    content.navigation.now,
    dateLocale
  ]);

  // Group paginated events by date
  const groupedItems = useMemo(() => {
    const groups: Record<string, CalendarListItem[]> = {};
    paginatedItems.forEach((event) => {
      const dateKey = event.date;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });
    return groups;
  }, [paginatedItems]);

  const sortedDates = Object.keys(groupedItems).sort();

  // Reset to page 1 when start date changes
  useEffect(() => {
    setCurrentPage(1);
    setShowSelectedDateInTitle(true);
  }, [startDate]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setShowSelectedDateInTitle(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setShowSelectedDateInTitle(false);
    }
  };

  const handleToday = () => {
    setStartDate(startOfToday());
    setCurrentPage(1);
    setShowSelectedDateInTitle(true);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    setCurrentPage(1);
    setDatePickerOpen(false);
    setShowSelectedDateInTitle(true);
  };

  return (
    <div className="w-full">
      {/* Date Navigation */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            aria-label={content.navigation.previousPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            aria-label={content.navigation.nextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleToday}>
            {content.navigation.today}
          </Button>
        </div>

        {/* Date Range with Picker */}
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <button className="text-2xl font-normal hover:opacity-70 transition-opacity flex items-center gap-2">
              {dateRangeLabel}
              <ChevronDown className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleDateSelect}
              defaultMonth={startDate || startOfToday()}
              initialFocus
              className="rounded-md"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Events List */}
      <div className="space-y-8">
        {sortedDates.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {content.messages.noEventsFound}
          </div>
        ) : (
          (() => {
            let lastMonth = '';
            return sortedDates.map((dateKey) => {
              const events = groupedItems[dateKey];
              if (!events || events.length === 0) return null;

              const eventDate = new Date(dateKey);

              if (isNaN(eventDate.getTime())) {
                console.error('Invalid date:', dateKey);
                return null;
              }

              const monthYear = format(eventDate, 'MMMM yyyy', {
                locale: dateLocale
              });
              const showMonthHeader = monthYear !== lastMonth;
              lastMonth = monthYear;

              return (
                <div key={dateKey}>
                  {showMonthHeader && (
                    <h2 className="text-base font-normal mb-6 text-muted-foreground">
                      {monthYear}
                    </h2>
                  )}

                  <div className="space-y-6">
                    {events.map((event) => {
                      const isSchedule = event.kind === 'schedule';
                      const title =
                        !isSchedule && language === 'uk' && event.title_uk
                          ? event.title_uk
                          : event.title;
                      const location =
                        !isSchedule && language === 'uk' && event.location_uk
                          ? event.location_uk
                          : event.location;
                      const description =
                        !isSchedule && language === 'uk' && event.description_uk
                          ? event.description_uk
                          : event.description;

                      if (isSchedule) {
                        return (
                          <button
                            key={event.id}
                            type="button"
                            onClick={() =>
                              setSelectedSchedule({
                                title,
                                publicUrl: event.publicUrl
                              })
                            }
                            className="w-full text-left flex gap-4 hover:bg-muted/30 rounded-lg -m-2 p-2 transition-colors"
                          >
                            <div className="flex flex-col items-center justify-start min-w-[60px] text-center">
                              <div className="text-xs uppercase text-muted-foreground font-medium tracking-wide">
                                {format(eventDate, 'EEE', { locale: dateLocale })}
                              </div>
                              <div className="text-4xl font-light leading-none mt-1">
                                {format(eventDate, 'd')}
                              </div>
                            </div>

                            <div className="flex-1">
                              <div className="text-sm text-foreground/60 mb-1">
                                {format(eventDate, 'MMMM d', { locale: dateLocale })}
                              </div>
                              <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                {title}
                              </h3>
                              <div className="text-sm text-muted-foreground mt-1">
                                {content.schedule.openPdf}
                              </div>
                            </div>
                          </button>
                        );
                      }

                      return (
                        <Link
                          key={event.id}
                          href={`/parents/calendar/${event.id}`}
                          className="flex gap-4 hover:bg-muted/30 rounded-lg -m-2 p-2 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-start min-w-[60px] text-center">
                          <div className="text-xs uppercase text-muted-foreground font-medium tracking-wide">
                            {format(eventDate, 'EEE', { locale: dateLocale })}
                          </div>
                          <div className="text-4xl font-light leading-none mt-1">
                            {format(eventDate, 'd')}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="text-sm text-foreground/60 mb-1">
                            {format(eventDate, 'MMMM d', { locale: dateLocale })}
                              {!isSchedule && event.start_time && (
                                <>
                                  {' @ '}
                                  {formatTime(event.start_time)}
                                  {event.end_time && ` - ${formatTime(event.end_time)}`}
                                </>
                              )}
                            </div>

                            <h3 className="text-lg font-semibold mb-1">
                              {title}
                            </h3>

                            {location && (
                              <div className="text-sm text-muted-foreground">
                                <span className="font-medium">Meanwood School</span> {location}
                              </div>
                            )}

                            {description && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {description}
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()
        )}
      </div>

      {/* Subscribe Button - Only events shown on current page */}
      <div className="flex justify-end mt-6">
        <SubscribeToCalendar
          events={paginatedItems.filter((item): item is CalendarEvent & { kind: 'event' } => item.kind === 'event')}
        />
      </div>

      <SchedulePreviewDialog
        schedule={selectedSchedule}
        onOpenChange={(open) => !open && setSelectedSchedule(null)}
      />
    </div>
  );
}
