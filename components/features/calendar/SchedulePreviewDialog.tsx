'use client';

import { useMemo } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/providers/language-provider';

type SelectedSchedule = {
  title: string;
  publicUrl: string;
} | null;

type SchedulePreviewDialogProps = {
  schedule: SelectedSchedule;
  onOpenChange: (open: boolean) => void;
};

export function SchedulePreviewDialog({ schedule, onOpenChange }: SchedulePreviewDialogProps) {
  const { language } = useLanguage();

  const previewUrl = useMemo(() => {
    if (!schedule?.publicUrl) return '';

    const [baseUrl, hash = ''] = schedule.publicUrl.split('#');
    const params = new URLSearchParams(hash);
    if (!params.has('toolbar')) params.set('toolbar', '0');
    if (!params.has('navpanes')) params.set('navpanes', '0');
    if (!params.has('scrollbar')) params.set('scrollbar', '0');
    if (!params.has('zoom')) params.set('zoom', 'page-width');
    if (!params.has('view')) params.set('view', 'FitH');

    return `${baseUrl}#${params.toString()}`;
  }, [schedule?.publicUrl]);

  const fallbackText =
    language === 'uk' ? 'Попередній перегляд недоступний у браузері.' : 'Preview is unavailable in this browser.';
  const hiddenTitle = schedule?.title || (language === 'uk' ? 'Розклад' : 'Schedule');

  return (
    <Dialog open={Boolean(schedule)} onOpenChange={onOpenChange}>
      <DialogContent className="z-[200] max-w-6xl w-[98vw] p-0 overflow-hidden [&>button]:z-[201]">
        <DialogTitle className="sr-only">{hiddenTitle}</DialogTitle>
        {schedule?.publicUrl ? (
          <div className="w-full bg-muted/10 max-h-[92dvh]">
            <iframe
              title={schedule.title}
              src={previewUrl}
              className="block w-full aspect-[1.414/1] max-h-[92dvh] border-0"
            />
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex items-center justify-center text-sm text-muted-foreground px-6">
            {fallbackText}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
