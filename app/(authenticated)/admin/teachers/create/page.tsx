
import { TeacherForm } from '@/app/(authenticated)/admin/components/TeacherForm';

export default async function CreateTeacherPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add Teacher</h1>
        <p className="text-muted-foreground">
          Create a new teacher profile for the public site.
        </p>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <TeacherForm mode="create" />
      </div>
    </div>
  );
}

