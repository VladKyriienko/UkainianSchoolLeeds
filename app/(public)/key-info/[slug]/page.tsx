import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/common/PageWrapper';
import { DocumentContent } from '../DocumentContent';
import { getKeyInfoDocumentBySlug } from '../actions';

type KeyInfoDocumentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function KeyInfoDocumentPage({
  params
}: KeyInfoDocumentPageProps) {
  const { slug } = await params;
  const document = await getKeyInfoDocumentBySlug(slug);

  if (!document) {
    notFound();
  }

  return (
    <PageWrapper
      title={{
        en: document.title,
        uk: document.title_uk ?? document.title
      }}
    >
      <DocumentContent document={document} />
    </PageWrapper>
  );
}
