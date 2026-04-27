import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/common/PageWrapper';
import { getClassBySlug } from '../actions';
import { BackButton } from '@/components/common/BackButton';
import { isHtmlContent } from '@/utils/rich-text';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ClassDetailPage({ params }: Props) {
  const { slug } = await params;
  const cls = await getClassBySlug(slug);
  if (!cls) notFound();

  return (
    <PageWrapper
      title={{
        en: cls.title,
        uk: cls.title_uk ?? cls.title
      }}
      description={{
        en: cls.description ?? '',
        uk: cls.description_uk ?? cls.description ?? ''
      }}
      goBackButton={<BackButton />}
    >
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {cls.description_uk || cls.description ? (
          isHtmlContent(cls.description_uk || cls.description) ? (
            <div
              className="rich-text-content"
              dangerouslySetInnerHTML={{ __html: cls.description_uk || cls.description || '' }}
            />
          ) : (
            <p className="text-muted-foreground whitespace-pre-line">
              {cls.description_uk || cls.description}
            </p>
          )
        ) : (
          <p className="text-muted-foreground">
            Content for this class will be added soon.
          </p>
        )}
      </div>
    </PageWrapper>
  );
}
