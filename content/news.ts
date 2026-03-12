export type NewsLanguage = 'en' | 'uk';

export type NewsContent = {
  pageTitle: string;
  pageTitleUk: string;
  pageDescription: string;
  pageDescriptionUk: string;
  readMore: string;
  readMoreUk: string;
  noNews: string;
  noNewsUk: string;
};

export const NEWS_CONTENT: NewsContent = {
  pageTitle: 'Latest News',
  pageTitleUk: 'Останні новини',
  pageDescription:
    'News and updates from the school. Stay informed about events, announcements and community updates.',
  pageDescriptionUk:
    'Новини та оновлення школи. Дізнавайтеся про події, оголошення та оновлення громади.',
  readMore: 'Read more',
  readMoreUk: 'Читати далі',
  noNews: 'No news yet.',
  noNewsUk: 'Новини ще не додані.',
};
