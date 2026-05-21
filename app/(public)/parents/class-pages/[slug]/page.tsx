import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/common/PageWrapper';
import { getClassBySlug, getPublicClassGalleryPhotos } from '../actions';
import { BackButton } from '@/components/common/BackButton';
import { ClassDetailContent } from './ClassDetailContent';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ClassDetailPage({ params }: Props) {
  const { slug } = await params;
  const cls = await getClassBySlug(slug);
  if (!cls) notFound();

  const galleryPhotos = await getPublicClassGalleryPhotos(cls.id);

  return (
    <PageWrapper
      title={{
        en: cls.title,
        uk: cls.title_uk ?? cls.title
      }}
      goBackButton={<BackButton />}
    >
      <ClassDetailContent item={cls} galleryPhotos={galleryPhotos} />
    </PageWrapper>
  );
}
