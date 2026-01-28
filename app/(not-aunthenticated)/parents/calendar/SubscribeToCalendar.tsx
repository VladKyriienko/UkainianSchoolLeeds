'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Download, Copy, Check } from 'lucide-react';
import { downloadICalendar } from './utils';
import { addEventsToGoogleCalendar } from './google-calendar-utils';
import type { CalendarEvent } from './actions';
import { toast } from 'sonner';
import { useLanguage } from '@/providers/language-provider';
import { CALENDAR_CONTENT } from '@/content/calendar';

type SubscribeToCalendarProps = {
  events: CalendarEvent[];
};

export function SubscribeToCalendar({ events }: SubscribeToCalendarProps) {
  const { language } = useLanguage();
  const content = CALENDAR_CONTENT[language];
  const [copied, setCopied] = useState(false);

  const handleGoogleCalendar = () => {
    try {
      addEventsToGoogleCalendar(events);
      toast.success(content.toasts.googleCalendarSuccess);
    } catch (error) {
      console.error('Error adding to Google Calendar:', error);
      toast.error(content.toasts.googleCalendarError);
    }
  };

  const handleDownload = () => {
    try {
      downloadICalendar(events);
      toast.success(content.toasts.downloadSuccess);
    } catch (error) {
      console.error('Error downloading calendar:', error);
      toast.error(content.toasts.downloadError);
    }
  };

  const handleCopyLink = async () => {
    try {
      // In a real application, this would be a public URL to the calendar feed
      // For now, we'll just copy the current page URL
      const calendarUrl = `${window.location.origin}/parents/calendar`;
      await navigator.clipboard.writeText(calendarUrl);
      setCopied(true);
      toast.success(content.toasts.copySuccess);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error(content.toasts.copyError);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          {content.subscribe.button}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleGoogleCalendar} className="cursor-pointer">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path d="M22.5 12.2c0-.8-.1-1.5-.2-2.3H12v4.4h5.9c-.3 1.4-1 2.6-2.1 3.4v2.8h3.4c2-1.8 3.2-4.5 3.2-7.7v-.6z" fill="#4285F4" />
            <path d="M12 23c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.8v2.7C4.5 20.8 8 23 12 23z" fill="#34A853" />
            <path d="M6.2 14.6c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.9H2.8C2 9.4 1.5 11.1 1.5 13s.5 3.6 1.3 5.1l3.4-2.7v.2z" fill="#FBBC05" />
            <path d="M12 5.4c1.5 0 2.9.5 4 1.5l3-3C17.2 2.2 14.8 1 12 1 8 1 4.5 3.2 2.8 6.4l3.4 2.6C7 6.5 9.3 5.4 12 5.4z" fill="#EA4335" />
          </svg>
          {content.subscribe.googleCalendar}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
          <Download className="mr-2 h-4 w-4" />
          {content.subscribe.exportIcs}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-green-600" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? content.subscribe.copied : content.subscribe.copyLink}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
