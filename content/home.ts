export type HomeLanguage = 'en' | 'uk';

type HomeContent = {
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
  }[];
  about: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    imageAlt: string;
  };
  news: {
    eyebrow: string;
    title: string;
    viewAll: string;
    emptyMessage: string;
  };
  cta: {
    title: string;
    description: string;
    button: string;
  };
};

export const HOME_CONTENT: Record<HomeLanguage, HomeContent> = {
  en: {
    hero: {
      titleLines: ['Ukrainian Saturday School'],
      titleAccent: 'in Leeds',
      subtitle:
        'Ukrainian School is a modern educational space where every child discovers their potential, gains knowledge, and grows into a confident person.',
      primaryCta: 'Learn more',
      secondaryCta: 'View school life',
      mission:
        'Our mission is to educate a generation of conscious, creative, and responsible citizens of Ukraine.'
    },
    features: [
      {
        title: 'Quality education',
        description:
          'Modern programs and methods that support the full development of every child.'
      },
      {
        title: 'Care and support',
        description:
          'We create a safe and friendly learning environment for every student.'
      },
      {
        title: 'Talent development',
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
      eyebrow: 'About school',
      title: 'General information about the school',
      description:
        'Lessons take place every Saturday from 14:00 to 17:30. The school has three age groups for children aged 5 to 14 and teaches Ukrainian and English languages, history, culture, geography, music, drama, and art.',
      cta: 'Read more',
      imageAlt:
        'Building of the Association of Ukrainians in Great Britain Leeds Branch'
    },
    news: {
      eyebrow: 'News and events',
      title: 'Stay up to date with school life',
      viewAll: 'All news',
      emptyMessage: 'No news yet. Check back later.'
    },
    cta: {
      title: 'Ready to become part of our school family?',
      description:
        'We invite you to get to know the school and join our community.',
      button: 'Contact us'
    }
  },
  uk: {
    hero: {
      titleLines: ['Українська суботня школа'],
      titleAccent: 'у Лідсі',
      subtitle:
        'Українська школа — це сучасний освітній простір, де кожна дитина розкриває свій потенціал, здобуває знання та зростає щасливою особистістю.',
      primaryCta: 'Дізнатися більше',
      secondaryCta: 'Дивитися шкільне життя',
      mission:
        'Наша місія — виховати покоління свідомих, творчих та відповідальних громадян України.'
    },
    features: [
      {
        title: 'Якісна освіта',
        description:
          'Сучасні програми та методики навчання для всебічного розвитку дитини.'
      },
      {
        title: 'Турбота та підтримка',
        description:
          'Ми створюємо безпечне та доброзичливе середовище для кожного учня.'
      },
      {
        title: 'Розвиток талантів',
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
      eyebrow: 'Про школу',
      title: 'Загальна інформація про школу',
      description:
        'Навчання проходить кожної суботи з 14:00 до 17:30. Школа має три вікові групи для дітей від 5 до 14 років, де викладаються українська та англійська мови, історія, культурологія, географія, музика, акторська майстерність і образотворче мистецтво.',
      cta: 'Читати більше',
      imageAlt:
        'Будівля Association of Ukrainians in Great Britain Leeds Branch'
    },
    news: {
      eyebrow: 'Новини та події',
      title: 'Будь в курсі шкільного життя',
      viewAll: 'Всі новини',
      emptyMessage: 'Новини поки немає. Завітайте пізніше.'
    },
    cta: {
      title: 'Готові стати частиною нашої шкільної родини?',
      description: 'Запрошуємо на знайомство зі школою та до нашої спільноти.',
      button: 'Контакт з нами'
    }
  }
};
