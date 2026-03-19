export type FooterLanguage = 'en' | 'uk';

type FooterContent = {
  usefulInfoTitle: string;
  usefulInfoDescription: string;
  contactTitle: string;
  contactSchoolName: string;
  contactAddress: string[];
  contactEmail: string;
  contactPhone: string;
  socialTitle: string;
  socialLinks: {
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
    contactAddress: [
      'The Association of Ukrainians in Great Britain',
      '5 Back Newton Grove',
      'Leeds',
      'LS7 4HW'
    ],
    contactEmail: 'admin@ukrainianschool.com',
    contactPhone: '0113 2755883',
    socialTitle: 'Social Media',
    socialLinks: [
      { label: 'Facebook', href: '#' },
      { label: 'Instagram', href: '#' },
      { label: 'YouTube', href: '#' },
      { label: 'X', href: '#' }
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
    contactAddress: [
      'The Association of Ukrainians in Great Britain',
      '5 Back Newton Grove',
      'Leeds',
      'LS7 4HW'
    ],
    contactEmail: 'admin@ukrainianschool.com',
    contactPhone: '0113 2755883',
    socialTitle: 'Соціальні мережі',
    socialLinks: [
      { label: 'Facebook', href: '#' },
      { label: 'Instagram', href: '#' },
      { label: 'YouTube', href: '#' },
      { label: 'X', href: '#' }
    ],
    copyright:
      'Весь контент веб-сайту захищено авторським правом © Українська школа 2026',
    cookiesPolicy: 'Політика файлів cookie',
    privacyPolicy: 'Політика конфіденційності'
  }
};
