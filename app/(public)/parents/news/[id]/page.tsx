import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BackButton } from '@/components/common/BackButton';
import { getNewsById } from '../actions';
import { NewsDetailContent } from './NewsDetailContent';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await getNewsById(id);
  if (!item) notFound();

  return (
    <PageWrapper
      title={{ en: item.title, uk: item.title_uk ?? item.title }}
      goBackButton={<BackButton />}
    >
      <NewsDetailContent item={item} />
    </PageWrapper>
  );
}
