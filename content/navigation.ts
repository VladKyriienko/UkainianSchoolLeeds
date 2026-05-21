import type { Language, NavItem } from '@/types';

export const BRAND_NAME_LINES: Record<
  Language,
  { line1: string; line2: string }
> = {
  en: { line1: 'Ukrainian Saturday School', line2: 'of Leeds' },
  uk: { line1: 'Українська суботня школа', line2: 'Лідсу' }
};

/** Public site nav (labels resolved via NAV_LABELS in PublicNavBar). */
export const NavItems: NavItem[] = [
  { label: 'Home', href: '/', key: 'home' },
  {
    label: 'About',
    href: '/about',
    key: 'about',
    children: [
      { label: 'Welcome', href: '/about/welcome' },
      { label: 'Whos Who', href: '/about/whos-who' }
    ]
  },
  {
    label: 'Parents',
    href: '/parents',
    key: 'parents',
    children: [
      { label: 'Latest News', href: '/parents/news' },
      { label: 'Photo gallery', href: '/parents/gallery' },
      { label: 'Calendar', href: '/parents/calendar' },
      { label: 'Class Pages', href: '/parents/class-pages' }
    ]
  },
  { label: 'Key Info', href: '/key-info', key: 'keyInfo' },
  { label: 'Donate', href: '/donate', key: 'donate' },
  { label: 'Contact', href: '/contact', key: 'contact' }
];

/** Labels for NavItems hrefs only (Key Info sub-links use API document titles). */
export const NAV_LABELS: Record<Language, Record<string, string>> = {
  en: {
    '/': 'Home',
    '/about': 'About',
    '/about/welcome': 'Welcome',
    '/about/whos-who': 'Whos Who',
    '/parents': 'Parents',
    '/parents/news': 'Latest News',
    '/parents/gallery': 'Photo gallery',
    '/parents/calendar': 'Calendar',
    '/parents/class-pages': 'Class Pages',
    '/key-info': 'Key Info',
    '/donate': 'Donate',
    '/contact': 'Contact'
  },
  uk: {
    '/': 'Головна',
    '/about': 'Про нас',
    '/about/welcome': 'Ласкаво просимо',
    '/about/whos-who': 'Хто є хто',
    '/parents': 'Батькам',
    '/parents/news': 'Останні новини',
    '/parents/gallery': 'Фотогалерея',
    '/parents/calendar': 'Календар',
    '/parents/class-pages': 'Класні сторінки',
    '/key-info': 'Основна інформація',
    '/donate': 'Підтримати',
    '/contact': 'Контакти'
  }
};
