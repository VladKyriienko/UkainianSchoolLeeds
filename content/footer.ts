export type FooterLanguage = 'en' | 'uk';

type FooterContent = {
  usefulInfoTitle: string;
  usefulInfoDescription: string;
  contactTitle: string;
  contactSchoolName: string;
  contactAddress: string[];
  contactEmail: string;
  contactPhone: string;
  quickLinksTitle: string;
  quickLinks: {
    label: string;
    href: string;
  }[];
  copyright: string;
  cookiesPolicy: string;
  privacyPolicy: string;
};

export const FOOTER_CONTENT: Record<FooterLanguage, FooterContent> = {
  en: {
    usefulInfoTitle: 'Useful Information',
    usefulInfoDescription:
      'The Ukrainian Saturday School is the heart of the local community. We serve our community with dedication and passion for the study of the Ukrainian language, culture, and history.',
    contactTitle: 'Contact Us',
    contactSchoolName: 'Ukrainian School',
    contactAddress: ['5 Back Newton Grove', 'Leeds', 'LS7 4HW'],
    contactEmail: 'admin@ukrainianschool.com',
    contactPhone: '0113 2755883',
    quickLinksTitle: 'Quick Links',
    quickLinks: [
      { label: 'Term Dates', href: '/parents/term-dates' },
      { label: 'Class Pages', href: '/children/class-pages' },
      { label: 'Newsletters', href: '/parents/newsletters' },
      { label: 'Curriculum', href: '/key-info/curriculum' },
      { label: 'Contact Us', href: '/contact' }
    ],
    copyright: 'All website content copyright © Ukrainian School 2026',
    cookiesPolicy: 'Cookies Policy',
    privacyPolicy: 'Privacy Policy'
  },
  uk: {
    usefulInfoTitle: 'Корисна інформація',
    usefulInfoDescription:
      'Українська суботня школа є серцем місцевої громади. Ми служимо нашій громаді з відданістю та пристрастю до вивчення української мови, культури та історії.',
    contactTitle: 'Зв’яжіться з нами',
    contactSchoolName: 'Українська школа',
    contactAddress: ['5 Back Newton Grove', 'Лідс', 'LS7 4HW'],
    contactEmail: 'admin@ukrainianschool.com',
    contactPhone: '0113 2755883',
    quickLinksTitle: 'Швидкі посилання',
    quickLinks: [
      { label: 'Навчальні терміни', href: '/parents/term-dates' },
      { label: 'Класні сторінки', href: '/children/class-pages' },
      { label: 'Інформаційні бюлетені', href: '/parents/newsletters' },
      { label: 'Навчальна програма', href: '/key-info/curriculum' },
      { label: 'Контакти', href: '/contact' }
    ],
    copyright:
      'Весь контент веб-сайту захищено авторським правом © Українська школа 2026',
    cookiesPolicy: 'Політика файлів cookie',
    privacyPolicy: 'Політика конфіденційності'
  }
};
