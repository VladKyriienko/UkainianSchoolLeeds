import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/common/PageWrapper';
import MemberDetailClient from '@/app/(public)/about/whos-who/[id]/client';
import { BackButton } from '@/components/common/BackButton';
import { getTeacherById } from '@/app/(public)/about/whos-who/actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MemberDetailPage({ params }: Props) {
  const { id } = await params;
  const teacher = await getTeacherById(id);
  if (!teacher) notFound();

  return (
    <PageWrapper
      title={{
        en: teacher.name,
        uk: teacher.name_uk ?? teacher.name
      }}
      description={{
        en: teacher.title ?? '',
        uk: teacher.title_uk ?? teacher.title ?? ''
      }}
      goBackButton={<BackButton />}
    >
      <MemberDetailClient teacher={teacher} />
    </PageWrapper>
  );
}
