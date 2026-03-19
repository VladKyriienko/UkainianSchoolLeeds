export type CalendarLanguage = 'en' | 'uk';

type CalendarCopy = {
  pageTitle: string;
  pageDescription: string;
  searchPlaceholder: string;
  viewModes: {
    list: string;
    month: string;
    day: string;
  };
  navigation: {
    today: string;
    now: string;
    thisMonth: string;
    previousPage: string;
    nextPage: string;
    previousDay: string;
    nextDay: string;
    previousMonth: string;
    nextMonth: string;
  };
  messages: {
    noEvents: string;
    noEventsFound: string;
    noEventsForDay: string;
  };
  subscribe: {
    button: string;
    googleCalendar: string;
    exportIcs: string;
    copyLink: string;
    copied: string;
  };
  toasts: {
    googleCalendarSuccess: string;
    googleCalendarError: string;
    downloadSuccess: string;
    downloadError: string;
    copySuccess: string;
    copyError: string;
  };
};

export const CALENDAR_CONTENT: Record<CalendarLanguage, CalendarCopy> = {
  en: {
    pageTitle: 'Calendar',
    pageDescription:
      'View upcoming school events, activities, and important dates',
    searchPlaceholder: 'Search for events',
    viewModes: {
      list: 'List',
      month: 'Month',
      day: 'Day'
    },
    navigation: {
      today: 'Today',
      now: 'Now',
      thisMonth: 'This Month',
      previousPage: 'Previous page',
      nextPage: 'Next page',
      previousDay: 'Previous day',
      nextDay: 'Next day',
      previousMonth: 'Previous month',
      nextMonth: 'Next month'
    },
    messages: {
      noEvents: 'No events',
      noEventsFound: 'No events found',
      noEventsForDay: 'No events for this day'
    },
    subscribe: {
      button: 'Subscribe to calendar',
      googleCalendar: 'Google Calendar',
      exportIcs: 'Export .ics file',
      copyLink: 'Copy calendar link',
      copied: 'Copied!'
    },
    toasts: {
      googleCalendarSuccess: 'Opening Google Calendar for each event',
      googleCalendarError: 'Failed to open Google Calendar',
      downloadSuccess: 'Calendar file downloaded successfully',
      downloadError: 'Failed to download calendar',
      copySuccess: 'Calendar link copied to clipboard',
      copyError: 'Failed to copy link'
    }
  },
  uk: {
    pageTitle: 'Календар',
    pageDescription:
      'Переглядайте майбутні шкільні події, заходи та важливі дати',
    searchPlaceholder: 'Пошук подій',
    viewModes: {
      list: 'Список',
      month: 'Місяць',
      day: 'День'
    },
    navigation: {
      today: 'Сьогодні',
      now: 'Зараз',
      thisMonth: 'Цей місяць',
      previousPage: 'Попередня сторінка',
      nextPage: 'Наступна сторінка',
      previousDay: 'Попередній день',
      nextDay: 'Наступний день',
      previousMonth: 'Попередній місяць',
      nextMonth: 'Наступний місяць'
    },
    messages: {
      noEvents: 'Немає подій',
      noEventsFound: 'Подій не знайдено',
      noEventsForDay: 'Немає подій на цей день'
    },
    subscribe: {
      button: 'Підписатися на календар',
      googleCalendar: 'Google Календар',
      exportIcs: 'Експортувати файл .ics',
      copyLink: 'Скопіювати посилання на календар',
      copied: 'Скопійовано!'
    },
    toasts: {
      googleCalendarSuccess: 'Відкриття Google Календаря для кожної події',
      googleCalendarError: 'Не вдалося відкрити Google Календар',
      downloadSuccess: 'Файл календаря успішно завантажено',
      downloadError: 'Не вдалося завантажити календар',
      copySuccess: 'Посилання на календар скопійовано в буфер обміну',
      copyError: 'Не вдалося скопіювати посилання'
    }
  }
};
