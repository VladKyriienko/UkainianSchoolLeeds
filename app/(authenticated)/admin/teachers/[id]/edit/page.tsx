import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TeacherForm } from '@/app/(authenticated)/admin/components/TeacherForm';
import { getTeacherById } from '@/app/(authenticated)/admin/teachers/actions';

export default async function EditTeacherPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let teacher = null;
  try {
    teacher = await getTeacherById(id);
  } catch {
    // fallthrough to notFound below
  }

  if (!teacher) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Link
          href="/admin/teachers"
          className="text-primary hover:text-primary/80 mb-4 inline-block"
        >
          ← Back to Teachers
        </Link>
        <h1 className="text-3xl font-bold mb-2">Edit Teacher</h1>
        <p className="text-muted-foreground">Update teacher details.</p>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <TeacherForm mode="edit" teacher={teacher} />
      </div>
    </div>
  );
}

