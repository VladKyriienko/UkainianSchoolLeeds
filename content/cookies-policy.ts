export type CookiesPolicyLanguage = 'en' | 'uk';

type CookiesPolicyContent = {
  pageTitle: string;
  pageDescription: string;
  lastUpdated: string;
  sections: {
    introduction: {
      title: string;
      content: string[];
    };
    whatAreCookies: {
      title: string;
      content: string[];
    };
    howWeUseCookies: {
      title: string;
      content: string[];
    };
    typesOfCookies: {
      title: string;
      content: string[];
      types: {
        essential: {
          title: string;
          description: string;
        };
        analytics: {
          title: string;
          description: string;
        };
        preferences: {
          title: string;
          description: string;
        };
      };
    };
    managingCookies: {
      title: string;
      content: string[];
    };
    thirdPartyCookies: {
      title: string;
      content: string[];
    };
    changesToPolicy: {
      title: string;
      content: string[];
    };
    contactUs: {
      title: string;
      content: string;
    };
  };
};

export const COOKIES_POLICY_CONTENT: Record<
  CookiesPolicyLanguage,
  CookiesPolicyContent
> = {
  en: {
    pageTitle: 'Cookies Policy',
    pageDescription: 'Learn about how we use cookies on our website',
    lastUpdated: 'Last updated: January 2026',
    sections: {
      introduction: {
        title: 'Introduction',
        content: [
          'This Cookies Policy explains what cookies are, how we use cookies on our website, and how you can manage your cookie preferences.',
          'By using our website, you consent to the use of cookies in accordance with this policy.'
        ]
      },
      whatAreCookies: {
        title: 'What Are Cookies?',
        content: [
          'Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.',
          'Cookies allow a website to recognize your device and store some information about your preferences or past actions.'
        ]
      },
      howWeUseCookies: {
        title: 'How We Use Cookies',
        content: [
          'We use cookies to improve your experience on our website, analyze how our site is used, and assist in our marketing efforts.',
          'We may use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device until deleted or expired).'
        ]
      },
      typesOfCookies: {
        title: 'Types of Cookies We Use',
        content: ['We use the following types of cookies on our website:'],
        types: {
          essential: {
            title: 'Essential Cookies',
            description:
              'These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.'
          },
          analytics: {
            title: 'Analytics Cookies',
            description:
              'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.'
          },
          preferences: {
            title: 'Preference Cookies',
            description:
              'These cookies allow our website to remember information about your preferences, such as your language choice or region, to provide a more personalized experience.'
          }
        }
      },
      managingCookies: {
        title: 'Managing Cookies',
        content: [
          'You can control and manage cookies in various ways. Most web browsers allow you to control cookies through their settings preferences.',
          'However, please note that disabling certain cookies may impact your experience on our website, as some features may not function properly.',
          'You can also delete cookies that have already been set on your device by clearing your browser history.'
        ]
      },
      thirdPartyCookies: {
        title: 'Third-Party Cookies',
        content: [
          'In addition to our own cookies, we may also use various third-party cookies to report usage statistics and deliver content on and through our website.',
          'These third-party cookies may be set by services such as Google Analytics or other analytics providers.'
        ]
      },
      changesToPolicy: {
        title: 'Changes to This Policy',
        content: [
          'We may update this Cookies Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.',
          'You are advised to review this policy periodically for any changes.'
        ]
      },
      contactUs: {
        title: 'Contact Us',
        content:
          'If you have any questions about our use of cookies, please contact us through our contact page.'
      }
    }
  },
  uk: {
    pageTitle: 'Політика файлів cookie',
    pageDescription:
      'Дізнайтеся про те, як ми використовуємо файли cookie на нашому веб-сайті',
    lastUpdated: 'Останнє оновлення: січень 2026',
    sections: {
      introduction: {
        title: 'Вступ',
        content: [
          'Ця Політика файлів cookie пояснює, що таке файли cookie, як ми використовуємо файли cookie на нашому веб-сайті та як ви можете керувати своїми налаштуваннями файлів cookie.',
          'Використовуючи наш веб-сайт, ви погоджуєтеся на використання файлів cookie відповідно до цієї політики.'
        ]
      },
      whatAreCookies: {
        title: 'Що таке файли cookie?',
        content: [
          "Файли cookie — це невеликі текстові файли, які розміщуються на вашому комп'ютері або мобільному пристрої, коли ви відвідуєте веб-сайт. Вони широко використовуються для того, щоб зробити веб-сайти більш ефективними та надати інформацію власникам веб-сайтів.",
          'Файли cookie дозволяють веб-сайту розпізнавати ваш пристрій і зберігати інформацію про ваші налаштування або минулі дії.'
        ]
      },
      howWeUseCookies: {
        title: 'Як ми використовуємо файли cookie',
        content: [
          'Ми використовуємо файли cookie для покращення вашого досвіду на нашому веб-сайті, аналізу того, як використовується наш сайт, та допомоги в наших маркетингових зусиллях.',
          'Ми можемо використовувати як сеансові файли cookie (які закінчуються, коли ви закриваєте браузер), так і постійні файли cookie (які залишаються на вашому пристрої до видалення або закінчення терміну дії).'
        ]
      },
      typesOfCookies: {
        title: 'Типи файлів cookie, які ми використовуємо',
        content: [
          'Ми використовуємо наступні типи файлів cookie на нашому веб-сайті:'
        ],
        types: {
          essential: {
            title: 'Необхідні файли cookie',
            description:
              'Ці файли cookie необхідні для правильної роботи веб-сайту. Вони забезпечують основні функції, такі як навігація по сторінках та доступ до захищених областей веб-сайту.'
          },
          analytics: {
            title: 'Аналітичні файли cookie',
            description:
              'Ці файли cookie допомагають нам зрозуміти, як відвідувачі взаємодіють з нашим веб-сайтом, збираючи та надаючи інформацію анонімно.'
          },
          preferences: {
            title: 'Файли cookie налаштувань',
            description:
              "Ці файли cookie дозволяють нашому веб-сайту запам'ятовувати інформацію про ваші налаштування, такі як вибір мови або регіон, щоб забезпечити більш персоналізований досвід."
          }
        }
      },
      managingCookies: {
        title: 'Керування файлами cookie',
        content: [
          'Ви можете контролювати та керувати файлами cookie різними способами. Більшість веб-браузерів дозволяють керувати файлами cookie через їх налаштування.',
          'Однак зверніть увагу, що відключення певних файлів cookie може вплинути на ваш досвід на нашому веб-сайті, оскільки деякі функції можуть працювати неправильно.',
          'Ви також можете видалити файли cookie, які вже встановлені на вашому пристрої, очистивши історію браузера.'
        ]
      },
      thirdPartyCookies: {
        title: 'Сторонні файли cookie',
        content: [
          'На додаток до наших власних файлів cookie, ми також можемо використовувати різні сторонні файли cookie для звітування статистики використання та доставки контенту на нашому веб-сайті та через нього.',
          'Ці сторонні файли cookie можуть бути встановлені такими сервісами, як Google Analytics або іншими постачальниками аналітики.'
        ]
      },
      changesToPolicy: {
        title: 'Зміни в цій політиці',
        content: [
          'Ми можемо час від часу оновлювати цю Політику файлів cookie. Ми повідомимо вас про будь-які зміни, розмістивши нову політику на цій сторінці та оновивши дату "Останнє оновлення".',
          'Рекомендується періодично переглядати цю політику на предмет будь-яких змін.'
        ]
      },
      contactUs: {
        title: "Зв'яжіться з нами",
        content:
          "Якщо у вас є запитання щодо нашого використання файлів cookie, будь ласка, зв'яжіться з нами через нашу сторінку контактів."
      }
    }
  }
};
