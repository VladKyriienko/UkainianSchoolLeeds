import { notFound, redirect } from 'next/navigation';
import { listKeyInfoDocuments } from './actions';

export default async function KeyInfoPage() {
  const documents = await listKeyInfoDocuments();

  if (documents[0]) {
    redirect(`/key-info/${documents[0].slug}`);
  }

  notFound();
}
