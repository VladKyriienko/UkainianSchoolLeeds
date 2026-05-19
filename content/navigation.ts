import type { Language } from '@/types';
import type { NavItem } from '@/types';

export type { NavItem };

// Brand name per language (two lines for header display)
export const BRAND_NAME: Record<Language, string> = {
  en: 'Ukrainian Saturday School of Leeds',
  uk: 'Українська суботня школа Лідсу'
};

export const BRAND_NAME_LINES: Record<Language, { line1: string; line2: string }> = {
  en: { line1: 'Ukrainian Saturday School', line2: 'of Leeds' },
  uk: { line1: 'Українська суботня школа', line2: 'Лідсу' }
};

/** Public site nav structure (labels resolved via NAV_LABELS). */
export const NavItems: NavItem[] = [
  { label: 'Home', href: '/', key: 'home' },
  {
    label: 'About',
    href: '/about',
    key: 'about',
    children: [
      { label: 'Welcome', href: '/about/welcome' },
      { label: 'Whos Who', href: '/about/whos-who' },
      { label: 'Vacancies', href: '/about/vacancies' },
      { label: 'School Development Plan', href: '/about/development-plan' }
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

// Navigation labels per route and language
export const NAV_LABELS: Record<Language, Record<string, string>> = {
  en: {
    '/': 'Home',
    '/about': 'About',
    '/about/welcome': 'Welcome',
    '/about/whos-who': 'Whos Who',
    '/about/vacancies': 'Vacancies',
    '/about/development-plan': 'School Development Plan',

    '/parents': 'Parents',
    '/parents/extended-services': 'Extended Services',
    '/parents/news': 'Latest News',
    '/parents/gallery': 'Photo gallery',
    '/parents/newsletters': 'Newsletters',
    '/parents/calendar': 'Calendar',
    '/parents/class-pages': 'Class Pages',

    '/key-info': 'Key Info',
    '/key-info/curriculum': 'Curriculum',
    '/key-info/timings': 'School Day Timings',
    '/key-info/admissions': 'Admissions',
    '/key-info/performance': 'DFE Performance',
    '/key-info/uniform': 'Uniform',
    '/key-info/meals': 'School Meals',
    '/key-info/behaviour': 'Behaviour',
    '/key-info/ofsted': 'Ofsted Reports',
    '/key-info/pupil-premium': 'Pupil Premium',
    '/key-info/send': 'Send',
    '/key-info/sports-premium': 'Sports Premium',
    '/key-info/policies': 'School Policies',

    '/safeguarding': 'Safeguarding',
    '/safeguarding/leads': 'Safeguarding Leads',
    '/safeguarding/policies': 'Safeguarding Policies',
    '/safeguarding/risk-assessments': 'Risk Assessments',
    '/safeguarding/concerns': 'Safeguarding Concerns',

    '/donate': 'Donate',
    '/contact': 'Contact'
  },
  uk: {
    '/': 'Головна',
    '/about': 'Про нас',
    '/about/welcome': 'Ласкаво просимо',
    '/about/whos-who': 'Хто є хто',
    '/about/vacancies': 'Вакансії',
    '/about/development-plan': 'План розвитку школи',

    '/parents': 'Батькам',
    '/parents/extended-services': 'Додаткові послуги',
    '/parents/news': 'Останні новини',
    '/parents/gallery': 'Фотогалерея',
    '/parents/newsletters': 'Інформаційні бюлетені',
    '/parents/calendar': 'Календар',
    '/parents/class-pages': 'Класні сторінки',

    '/key-info': 'Основна інформація',
    '/key-info/curriculum': 'Навчальна програма',
    '/key-info/timings': 'Розклад дня',
    '/key-info/admissions': 'Вступ',
    '/key-info/performance': 'Результати DFE',
    '/key-info/uniform': 'Форма',
    '/key-info/meals': 'Шкільне харчування',
    '/key-info/behaviour': 'Поведінка',
    '/key-info/ofsted': 'Звіти Ofsted',
    '/key-info/pupil-premium': 'Pupil Premium',
    '/key-info/send': 'SEND',
    '/key-info/sports-premium': 'Спортивний преміум',
    '/key-info/policies': 'Політики школи',

    '/safeguarding': 'Безпека',
    '/safeguarding/leads': 'Відповідальні за безпеку',
    '/safeguarding/policies': 'Політики безпеки',
    '/safeguarding/risk-assessments': 'Оцінка ризиків',
    '/safeguarding/concerns': 'Питання щодо безпеки',

    '/donate': 'Підтримати',
    '/contact': 'Контакти'
  }
};
