import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BackButton } from '@/components/common/BackButton';
import { getNewsById } from '../actions';
import { format } from 'date-fns';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await getNewsById(id);
  if (!item) notFound();

  const title = item.title_uk ?? item.title;
  const description = item.description_uk ?? item.description;

  return (
    <PageWrapper
      title={{ en: item.title, uk: item.title_uk ?? item.title }}
      description={
        item.date ? format(new Date(item.date), 'd MMMM yyyy') : undefined
      }
      goBackButton={<BackButton />}
    >
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        {item.photoUrl ? (
          <div className="not-prose mb-6 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.photoUrl}
              alt=""
              className="w-full max-h-[400px] object-cover"
            />
          </div>
        ) : null}
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        {description ? (
          <div className="text-muted-foreground whitespace-pre-line">
            {description}
          </div>
        ) : (
          <p className="text-muted-foreground">Content will be added soon.</p>
        )}
      </article>
    </PageWrapper>
  );
}
