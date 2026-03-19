export type HomeLanguage = 'en' | 'uk';

type HomeContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  programs: {
    title: string;
    subtitle: string;
    openLabel: string;
    cards: { title: string; description: string; href: string }[];
  };
  news: {
    title: string;
    subtitle: string;
    viewAll: string;
    readMore: string;
    emptyMessage: string;
  };
};

export const HOME_CONTENT: Record<HomeLanguage, HomeContent> = {
  en: {
    hero: {
      eyebrow: 'Ukrainian Saturday School',
      title: 'Learn language. Keep culture. Build community.',
      subtitle:
        'A warm space for children and families to study Ukrainian language, traditions, and history.',
      primaryCta: 'View calendar',
      secondaryCta: 'Contact us'
    },
    programs: {
      title: 'Programs & classes',
      subtitle: 'Placeholder section — you can replace titles and descriptions later.',
      openLabel: 'Open',
      cards: [
        {
          title: 'Class pages',
          description:
            'Explore what students learn across different age groups and levels.',
          href: '/children/class-pages'
        },
        {
          title: 'Term dates',
          description: 'Key dates for the school year, holidays, and breaks.',
          href: '/parents/term-dates'
        },
        {
          title: 'Newsletters',
          description: 'Updates and announcements for parents and carers.',
          href: '/parents/newsletters'
        }
      ]
    },
    news: {
      title: 'Latest news',
      subtitle: 'Updates and announcements from the school.',
      viewAll: 'View all news',
      readMore: 'Read more',
      emptyMessage: 'No news yet. Check back later.'
    }
  },
  uk: {
    hero: {
      eyebrow: 'Українська суботня школа',
      title: 'Мова. Культура. Спільнота.',
      subtitle:
        'Теплий простір для дітей і родин, щоб вивчати українську мову, традиції та історію.',
      primaryCta: 'Переглянути календар',
      secondaryCta: 'Зв’язатися з нами'
    },
    programs: {
      title: 'Програми та класи',
      subtitle: 'Секція-заглушка — ти зможеш замінити тексти пізніше.',
      openLabel: 'Відкрити',
      cards: [
        {
          title: 'Класні сторінки',
          description:
            'Подивіться, що вивчають учні різних вікових груп та рівнів.',
          href: '/children/class-pages'
        },
        {
          title: 'Навчальні терміни',
          description: 'Ключові дати навчального року, канікули та перерви.',
          href: '/parents/term-dates'
        },
        {
          title: 'Інформаційні бюлетені',
          description: 'Оновлення та оголошення для батьків.',
          href: '/parents/newsletters'
        }
      ]
    },
    news: {
      title: 'Останні новини',
      subtitle: 'Оновлення та оголошення школи.',
      viewAll: 'Всі новини',
      readMore: 'Читати далі',
      emptyMessage: 'Новини поки немає. Завітайте пізніше.'
    }
  }
};

