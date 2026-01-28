'use client';

import type { Language } from '@/providers/language-provider';

// Brand name per language
export const BRAND_NAME: Record<Language, string> = {
  en: 'Ukrainian School',
  uk: 'Українська школа'
};

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
    '/parents/newsletters': 'Newsletters',
    '/parents/calendar': 'Calendar',
    '/parents/term-dates': 'Term Dates',

    '/children': 'Children',
    '/children/class-pages': 'Class Pages',
    '/children/school-council': 'School Council',
    '/children/e-safety': 'eSafety',

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
    '/parents/newsletters': 'Інформаційні бюлетені',
    '/parents/calendar': 'Календар',
    '/parents/term-dates': 'Навчальні терміни',

    '/children': 'Дітям',
    '/children/class-pages': 'Класні сторінки',
    '/children/school-council': 'Шкільна рада',
    '/children/e-safety': 'Інтернет-безпека',

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

    '/contact': 'Контакти'
  }
};
