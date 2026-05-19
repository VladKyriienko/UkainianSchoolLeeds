export type HomeLanguage = 'en' | 'uk';

export type HomeContent = {
  hero: {
    titleLines: string[];
    titleAccent: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    mission: string;
  };
  features: {
    title: string;
    description: string;
    /** Hero image overlay chips: heading on two lines (EN/UK). */
    heroTitleLines?: readonly [string, string];
  }[];
  about: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    imageAlt: string;
    /** Hero image for the “more than a school” block */
    imageSrc: string;
    highlights: string[];
  };
  news: {
    eyebrow: string;
    title: string;
    viewAllNews: string;
    viewAllEvents: string;
    emptyMessage: string;
    eventLabel: string;
    newsLabel: string;
  };
  parentVoices: {
    titleBefore: string;
    titleHighlight: string;
    titleAfter: string;
  };
  faq: {
    titleBefore: string;
    titleHighlight: string;
    titleAfter: string;
    items: { question: string; answer: string }[];
  };
  cta: {
    titleBefore: string;
    /** Place name in the CTA headline (e.g. Leeds / Лідсі). */
    titleHighlight: string;
    /** Trailing punctuation (e.g. `!`) — heart icon is rendered immediately after. */
    titleAfter: string;
    description: string;
    submit: string;
    placeholders: {
      parentName: string;
      phone: string;
      email: string;
      childAge: string;
    };
    /** Inbox subject for this lead (home page form). */
    messageSubject: string;
    submitting: string;
    successMessage: string;
    errorMessage: string;
    fillAllFields: string;
  };
  whyChooseUs: {
    heading: string;
    cards: {
      image: string;
      title: string;
      description: string;
    }[];
  };
  programs: {
    headingBefore: string;
    headingHighlight: string;
    learnMore: string;
    cards: {
      image: string;
      title: string;
      subtitle: string;
      description: string;
      href?: string;
    }[];
  };
  /** Photo strip: heading + CTA (photos from `gallery` table). */
  schoolAtmosphere: {
    heading: string;
    cta: string;
    ctaHref: string;
  };
  /** Row under hero CTAs: icon + two-line label (language via HOME_CONTENT). */
  heroTrust: {
    items: { line1: string; line2: string }[];
  };
};

/** Program card art (shared EN/UK) — files in `public/home`. */
const PROGRAM_CARD_IMAGES = [
  '/home/program-junior.png',
  '/home/program-middle.png',
  '/home/program-senior.png',
  '/home/program-creative.png'
] as const;

export const HOME_CONTENT: Record<HomeLanguage, HomeContent> = {
  en: {
    hero: {
      titleLines: ['Ukrainian Saturday School'],
      titleAccent: 'in Leeds',
      subtitle:
        "Ukrainian School Leeds is a space where children learn, communicate in Ukrainian, and feel connected to their family's culture.",
      primaryCta: 'Learn more',
      secondaryCta: 'View school life',
      mission:
        'Our mission is to educate a generation of conscious, creative, and responsible citizens of Ukraine.'
    },
    features: [
      {
        title: 'Quality education',
        heroTitleLines: ['Quality', 'education'],
        description:
          'Modern programs and methods that support the full development of every child.'
      },
      {
        title: 'Care and support',
        heroTitleLines: ['Care and', 'support'],
        description:
          'We create a safe and friendly learning environment for every student.'
      },
      {
        title: 'Talent development',
        heroTitleLines: ['Talent', 'development'],
        description:
          'Clubs, projects, and events help children discover and grow their abilities.'
      },
      {
        title: 'Values and upbringing',
        description:
          'We nurture patriots who respect their culture and strive for the best.'
      }
    ],
    about: {
      eyebrow: 'About our school',
      title: 'More than a school',
      description:
        'Ukrainian School Leeds is a space where children not only learn, but also feel pride in their culture, communicate in Ukrainian, and find friends for life.',
      cta: 'About our school',
      imageAlt: 'Children with the Ukrainian flag in Leeds',
      imageSrc: '/home/about-school-photo.png',
      highlights: [
        'Modern approach to learning',
        'Safe and friendly environment',
        'Support for children and families'
      ]
    },
    news: {
      eyebrow: 'News and events',
      title: 'Stay up to date with school life',
      viewAllNews: 'All news',
      viewAllEvents: 'Calendar',
      emptyMessage: 'No news or events yet. Check back later.',
      eventLabel: 'Event',
      newsLabel: 'News'
    },
    parentVoices: {
      titleBefore: 'What ',
      titleHighlight: 'parents',
      titleAfter: ' say'
    },
    faq: {
      titleBefore: 'Frequently asked ',
      titleHighlight: 'questions',
      titleAfter: '',
      items: [
        {
          question: 'Where do classes take place?',
          answer:
            'Lessons are held at our venue in Leeds on Saturdays during term time. The exact address and room details are shared with families after enrolment.'
        },
        {
          question: 'What ages is the school for?',
          answer:
            'We welcome children roughly from ages 4 to 16, grouped by age so that activities and language level match their stage of development.'
        },
        {
          question: 'Do children need to speak Ukrainian fluently?',
          answer:
            'No. Some families speak Ukrainian at home and others are just beginning. Teachers support every child so they can grow in confidence step by step.'
        },
        {
          question: 'How are classes organised?',
          answer:
            'Groups combine Ukrainian language, culture, and creative activities. The timetable includes breaks and varies by age group - see class pages for more detail.'
        },
        {
          question: 'How can I book a trial lesson?',
          answer:
            'Contact us by email or phone and we will suggest a suitable Saturday visit. You can meet the team and see how your child responds to the group.'
        },
        {
          question: 'How much does tuition cost?',
          answer:
            'Fees depend on the group and number of siblings. We will send the current fee schedule when you get in touch so you have clear information before enrolling.'
        }
      ]
    },
    cta: {
      titleBefore: 'Join Ukrainian School in ',
      titleHighlight: 'Leeds',
      titleAfter: '!',
      description:
        "Leave your details - we'll get in touch with groups, timetable, and learning options.",
      submit: 'Register my child',
      placeholders: {
        parentName: "Parent's name",
        phone: 'Phone',
        email: 'Email',
        childAge: "Child's age"
      },
      messageSubject: 'Child registration',
      submitting: 'Sending…',
      successMessage: 'Thank you! We will contact you soon.',
      errorMessage:
        'Something went wrong. Please try again or use the contact page.',
      fillAllFields: 'Please fill in all fields.'
    },
    heroTrust: {
      items: [
        {
          line1: 'For children',
          line2: '4–16 years'
        },
        {
          line1: 'Classes',
          line2: 'in Leeds'
        },
        {
          line1: 'Ukrainian language,',
          line2: 'culture and traditions'
        }
      ]
    },
    whyChooseUs: {
      heading: 'Why families choose our school',
      cards: [
        {
          image: '/home/hero-card-1.png',
          title: 'Ukrainian language',
          description:
            'Children learn, practise, and confidently use Ukrainian in daily life and conversation.'
        },
        {
          image: '/home/hero-card-2.png',
          title: 'Culture and traditions',
          description:
            'Holidays, creativity, songs, history, and Ukrainian customs - we keep our roots together.'
        },
        {
          image: '/home/hero-card-3.png',
          title: 'Caring teachers',
          description:
            'A professional approach, attention to every child, and modern teaching methods.'
        },
        {
          image: '/home/hero-card-4.png',
          title: 'Ukrainian community',
          description:
            'Children find friends, and families find support and the feeling of a wider Ukrainian family in Leeds.'
        }
      ]
    },
    schoolAtmosphere: {
      heading: "Our school's atmosphere",
      cta: 'See more photos',
      ctaHref: '/parents/gallery'
    },
    programs: {
      headingBefore: 'Educational ',
      headingHighlight: 'programs',
      learnMore: 'Learn more',
      cards: [
        {
          image: PROGRAM_CARD_IMAGES[0],
          title: 'Junior group',
          subtitle: 'Ages 4–7',
          description:
            'Play-based learning, speech development, reading, writing, and creative activities.',
          href: '/parents/class-pages'
        },
        {
          image: PROGRAM_CARD_IMAGES[1],
          title: 'Middle group',
          subtitle: 'Ages 8–11',
          description:
            'Deeper study of Ukrainian language, literature, history, and culture.',
          href: '/parents/class-pages'
        },
        {
          image: PROGRAM_CARD_IMAGES[2],
          title: 'Senior group',
          subtitle: 'Ages 12–16',
          description:
            'Advanced learning, projects, discussions, and preparation for Ukrainian language assessments.',
          href: '/parents/class-pages'
        },
        {
          image: PROGRAM_CARD_IMAGES[3],
          title: 'Creative activities',
          subtitle: 'All age groups',
          description:
            'Masterclasses, folk dance, vocals, theatre clubs, and festive cultural events.',
          href: '/parents/class-pages'
        }
      ]
    }
  },
  uk: {
    hero: {
      titleLines: ['Українська суботня школа'],
      titleAccent: 'у Лідсі',
      subtitle:
        "Ukrainian School Leeds - це простір, де діти навчаються, спілкуються українською та відчувають зв'язок із культурою своєї родини.",
      primaryCta: 'Дізнатися більше',
      secondaryCta: 'Дивитися шкільне життя',
      mission:
        'Наша місія - виховати покоління свідомих, творчих та відповідальних громадян України.'
    },
    features: [
      {
        title: 'Якісна освіта',
        heroTitleLines: ['Якісна', 'освіта'],
        description:
          'Сучасні програми та методики навчання для всебічного розвитку дитини.'
      },
      {
        title: 'Турбота та підтримка',
        heroTitleLines: ['Турбота та', 'підтримка'],
        description:
          'Ми створюємо безпечне та доброзичливе середовище для кожного учня.'
      },
      {
        title: 'Розвиток талантів',
        heroTitleLines: ['Розвиток', 'талантів'],
        description:
          'Гуртки, проєкти та заходи, що допомагають знайти і розвивати здібності.'
      },
      {
        title: 'Цінності та виховання',
        description:
          'Формуємо патріотів, які поважають свою культуру та прагнуть до змін на краще.'
      }
    ],
    about: {
      eyebrow: 'Про нашу школу',
      title: 'Більше ніж школа',
      description:
        'Ukrainian School Leeds - це простір, де діти не тільки вчаться, а й відчувають гордість за свою культуру, спілкуються українською та знаходять друзів на все життя.',
      cta: 'Про нашу школу',
      imageAlt: 'Діти з прапором України у Лідсі',
      imageSrc: '/home/about-school-photo.png',
      highlights: [
        'Сучасний підхід до навчання',
        'Безпечне та дружнє середовище',
        'Підтримка дітей та родин'
      ]
    },
    news: {
      eyebrow: 'Новини та події',
      title: 'Будь в курсі шкільного життя',
      viewAllNews: 'Всі новини',
      viewAllEvents: 'Календар',
      emptyMessage: 'Новин і подій поки немає. Завітайте пізніше.',
      eventLabel: 'Подія',
      newsLabel: 'Новина'
    },
    parentVoices: {
      titleBefore: 'Що ',
      titleHighlight: 'кажуть',
      titleAfter: ' батьки'
    },
    faq: {
      titleBefore: 'Часті ',
      titleHighlight: 'запитання',
      titleAfter: '',
      items: [
        {
          question: 'Де проходять заняття?',
          answer:
            'Заняття відбуваються у Лідсі по суботах упродовж навчального року. Точну адресу та деталі класу ми надсилаємо родинам після запису.'
        },
        {
          question: 'Для якого віку школа?',
          answer:
            'Ми запрошуємо дітей приблизно від 4 до 16 років: групи формуються за віком, щоб завдання та мовне навантаження відповідали розвитку дитини.'
        },
        {
          question: 'Чи потрібно добре знати українську?',
          answer:
            'Ні. У когось українська — рідна мова вдома, у когось - тільки початок. Викладачі підтримують кожну дитину, щоб вона впевнено росла крок за кроком.'
        },
        {
          question: 'Як проходять заняття?',
          answer:
            'Уроки поєднують мову, культуру та творчі активності. Розклад залежить від віку групи; детальніше — на сторінках класів.'
        },
        {
          question: 'Як записатися на пробне заняття?',
          answer:
            'Напишіть або зателефонуйте - запропонуємо зручну суботу для візиту. Ви познайомитеся з командою й побачите, як дитині у групі.'
        },
        {
          question: 'Скільки коштує навчання?',
          answer:
            'Вартість залежить від групи та кількості дітей у родині. Актуальний прайс надсилаємо після звернення, щоб ви мали всю інформацію перед записом.'
        }
      ]
    },
    cta: {
      titleBefore: 'Приєднуйтесь до Української Школи в ',
      titleHighlight: 'Лідсі',
      titleAfter: '!',
      description:
        'Залиште заявку - ми зв’яжемося з вами та розповімо про групи, розклад і навчання.',
      submit: 'Записати дитину',
      placeholders: {
        parentName: "Ім'я батька",
        phone: 'Телефон',
        email: 'Email',
        childAge: 'Вік дитини'
      },
      messageSubject: 'Реєстрація дитини',
      submitting: 'Надсилаємо…',
      successMessage: 'Дякуємо! Ми зв’яжемося з вами найближчим часом.',
      errorMessage:
        'Не вдалося надіслати. Спробуйте ще раз або сторінку «Контакти».',
      fillAllFields: 'Будь ласка, заповніть усі поля.'
    },
    heroTrust: {
      items: [
        {
          line1: 'Для дітей',
          line2: '4–16 років'
        },
        {
          line1: 'Заняття',
          line2: 'у Leeds'
        },
        {
          line1: 'Українська мова,',
          line2: 'культура та традиції'
        }
      ]
    },
    whyChooseUs: {
      heading: 'Чому родини обирають нашу школу',
      cards: [
        {
          image: '/home/hero-card-1.png',
          title: 'Українська мова',
          description:
            'Діти вивчають, практикують і впевнено використовують українську у житті та спілкуванні.'
        },
        {
          image: '/home/hero-card-2.png',
          title: 'Культура та традиції',
          description:
            'Свята, творчість, пісні, історія та українські звичаї - зберігаємо наше коріння разом.'
        },
        {
          image: '/home/hero-card-3.png',
          title: 'Турботливі викладачі',
          description:
            'Професійний підхід, увага до кожної дитини та сучасні методи навчання.'
        },
        {
          image: '/home/hero-card-4.png',
          title: 'Українська спільнота',
          description:
            'Діти знаходять друзів, а родини - підтримку та відчуття великої української родини в Лідсі.'
        }
      ]
    },
    schoolAtmosphere: {
      heading: 'Атмосфера нашої школи',
      cta: 'Дивитися більше фото',
      ctaHref: '/parents/gallery'
    },
    programs: {
      headingBefore: 'Програми ',
      headingHighlight: 'навчання',
      learnMore: 'Дізнатися більше',
      cards: [
        {
          image: PROGRAM_CARD_IMAGES[0],
          title: 'Молодша група',
          subtitle: '4–7 років',
          description:
            'Ігрова форма навчання, розвиток мовлення, читання, письмо, творчі заняття.',
          href: '/parents/class-pages'
        },
        {
          image: PROGRAM_CARD_IMAGES[1],
          title: 'Середня група',
          subtitle: '8–11 років',
          description:
            'Поглиблене вивчення мови, літератури, історії та культури України.',
          href: '/parents/class-pages'
        },
        {
          image: PROGRAM_CARD_IMAGES[2],
          title: 'Старша група',
          subtitle: '12–16 років',
          description:
            'Поглиблене навчання, проєкти, дискусії, підготовка до екзаменів з української мови.',
          href: '/parents/class-pages'
        },
        {
          image: PROGRAM_CARD_IMAGES[3],
          title: 'Творчі заняття',
          subtitle: 'Для всіх вікових груп',
          description:
            'Майстер-класи, народні танці, вокал, театральні гуртки, святкові та культурні події.',
          href: '/parents/class-pages'
        }
      ]
    }
  }
};
