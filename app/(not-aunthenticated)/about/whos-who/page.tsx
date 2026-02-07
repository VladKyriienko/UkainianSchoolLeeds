import WhosWhoContent from './client';
import { PageWrapper } from '@/components/common/PageWrapper';
import { WHOS_WHO_CONTENT } from '@/content/whos-who';
import { getTeachers } from './actions';

export default async function WhosWhoPage() {
  const teachers = await getTeachers();
  return (
    <PageWrapper
      title={{
        en: WHOS_WHO_CONTENT.pageTitle,
        uk: WHOS_WHO_CONTENT.pageTitleUk
      }}
      description={{
        en: WHOS_WHO_CONTENT.pageDescription,
        uk: WHOS_WHO_CONTENT.pageDescriptionUk
      }}
    >
      <WhosWhoContent teachers={teachers} />
    </PageWrapper>
  );
}
