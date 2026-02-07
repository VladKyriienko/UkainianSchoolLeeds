export type WhosWhoLanguage = 'en' | 'uk';

export type WhosWhoContent = {
  pageTitle: string;
  pageTitleUk: string;
  pageDescription: string;
  pageDescriptionUk: string;
  coreTeamTitle: string;
  coreTeamTitleUk: string;
  aboutMeButton: string;
  aboutMeButtonUk: string;
  bioPlaceholder: string;
  bioPlaceholderUk: string;
  inspiresTitle: string;
  inspiresTitleUk: string;
};

export const WHOS_WHO_CONTENT: WhosWhoContent = {
  pageTitle: 'Who is Who',
  pageTitleUk: 'Хто є хто',
  pageDescription:
    'Meet our dedicated team of teachers and staff who make the Ukrainian Saturday School of Leeds a thriving community.',
  pageDescriptionUk:
    'Познайомтеся з нашою командою вчителів та співробітників, які роблять Українську суботню школу Лідсу процвітаючою громадою.',
  coreTeamTitle: 'Core Team',
  coreTeamTitleUk: 'Основна команда',
  aboutMeButton: 'About me',
  aboutMeButtonUk: 'Про мене',
  bioPlaceholder: 'Biography will be added soon.',
  bioPlaceholderUk: 'Біографія скоро буде додана.',
  inspiresTitle: 'What inspires me',
  inspiresTitleUk: 'Що додає мені наснаги'
};
