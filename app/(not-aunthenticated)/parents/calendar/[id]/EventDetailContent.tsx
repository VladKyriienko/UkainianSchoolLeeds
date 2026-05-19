'use client';

import { useLanguage } from '@/providers/language-provider';
import type { CalendarEventDetail } from '../actions';
import { isHtmlContent } from '@/utils/rich-text';
import { AdminDetailPhoto } from '@/components/common/admin/AdminDetailPhoto';

type Props = {
  event: CalendarEventDetail;
  timeLabel: string;
};

export function EventDetailContent({ event, timeLabel }: Props) {
  const { language } = useLanguage();
  const isUk = language === 'uk';

  const description = isUk
    ? (event.description_uk ?? event.description)
    : event.description;
  const location = isUk
    ? (event.location_uk ?? event.location)
    : event.location;
  const title = isUk && event.title_uk ? event.title_uk : event.title;

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6 not-prose">
        {timeLabel && (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {timeLabel}
          </span>
        )}
        {location && (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {location}
          </span>
        )}
      </div>

      {event.photoUrl ? (
        <AdminDetailPhoto
          src={event.photoUrl}
          alt={title}
          showLabel={false}
          className="mb-6"
        />
      ) : null}

      {description ? (
        isHtmlContent(description) ? (
          <div
            className="rich-text-content"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : (
          <div className="text-muted-foreground whitespace-pre-line">
            {description}
          </div>
        )
      ) : (
        <p className="text-muted-foreground">No description.</p>
      )}
    </article>
  );
}
