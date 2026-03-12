import ClassPagesContent from './client';
import { PageWrapper } from '@/components/common/PageWrapper';
import { CLASS_PAGES_CONTENT } from '@/content/class-pages';
import { getClasses } from './actions';

export default async function ClassPagesPage() {
  const classes = await getClasses();
  return (
    <PageWrapper
      title={{
        en: CLASS_PAGES_CONTENT.pageTitle,
        uk: CLASS_PAGES_CONTENT.pageTitleUk
      }}
      description={{
        en: CLASS_PAGES_CONTENT.pageDescription,
        uk: CLASS_PAGES_CONTENT.pageDescriptionUk
      }}
    >
      <ClassPagesContent classes={classes} />
    </PageWrapper>
  );
}
