export type ClassPagesLanguage = 'en' | 'uk';

export type ClassPagesContent = {
  pageTitle: string;
  pageTitleUk: string;
  pageDescription: string;
  pageDescriptionUk: string;
  viewClassLabel: string;
  viewClassLabelUk: string;
  noClasses: string;
  noClassesUk: string;
};

export const CLASS_PAGES_CONTENT: ClassPagesContent = {
  pageTitle: 'Class Pages',
  pageTitleUk: 'Сторінки класів',
  pageDescription:
    'Explore our classes and year groups. Each class has its own page with news and updates.',
  pageDescriptionUk:
    'Огляд наших класів та річних груп. У кожного класу є власна сторінка з новинами та оновленнями.',
  viewClassLabel: 'View class',
  viewClassLabelUk: 'Переглянути клас',
  noClasses: 'No classes yet.',
  noClassesUk: 'Класи ще не додані.',
};
