import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/common/PageWrapper';
import MemberDetailClient from './client';
import BackToWhosWho from './BackToWhosWho';
import { getTeacherById } from '../actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MemberDetailPage({ params }: Props) {
  const { id } = await params;
  const teacher = await getTeacherById(id);
  if (!teacher) notFound();

  return (
    <PageWrapper
      title={teacher.name}
      description={teacher.title ?? ''}
      goBackButton={<BackToWhosWho />}
    >
      <MemberDetailClient teacher={teacher} />
    </PageWrapper>
  );
}
