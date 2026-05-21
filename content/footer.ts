export type FooterLanguage = 'en' | 'uk';

/** Shared across EN/UK — URLs and contact details must not diverge per language. */
export const FOOTER_SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=100087647560269'
  },
  { label: 'Instagram', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'X', href: '#' }
] as const;

export const FOOTER_CONTACT = {
  contactEmail: 'ukrainianschoolleeds@gmail.com',
  contactPhone: '07926 248347',
  contactAddress: [
    'The Association of Ukrainians in Great Britain',
    '5 Back Newton Grove',
    'Leeds',
    'LS7 4HW'
  ] as const
};

type FooterLocalizedContent = {
  usefulInfoTitle: string;
  usefulInfoDescription: string;
  contactTitle: string;
  contactSchoolName: string;
  socialTitle: string;
  copyright: string;
  cookiesPolicy: string;
  privacyPolicy: string;
};

export const FOOTER_CONTENT: Record<FooterLanguage, FooterLocalizedContent> = {
  en: {
    usefulInfoTitle: 'Useful Information',
    usefulInfoDescription:
      'The Ukrainian Saturday School is the heart of the local community. We serve our community with dedication and passion for the study of the Ukrainian language, culture, and history.',
    contactTitle: 'Contact Us',
    contactSchoolName: 'Ukrainian School',
    socialTitle: 'Social Media',
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
    socialTitle: 'Соціальні мережі',
    copyright:
      'Весь контент веб-сайту захищено авторським правом © Українська школа 2026',
    cookiesPolicy: 'Політика файлів cookie',
    privacyPolicy: 'Політика конфіденційності'
  }
};
