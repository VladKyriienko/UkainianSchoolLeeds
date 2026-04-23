import { PageWrapper } from '@/components/common/PageWrapper';
import { ScheduleForm } from '@/app/admin/components/ScheduleForm';

export default async function CreateSchedulePage() {
  return (
    <PageWrapper
      title="Add schedule"
      description="Upload a PDF timetable for a specific date."
    >
      <ScheduleForm />
    </PageWrapper>
  );
}
