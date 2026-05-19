import { format } from 'date-fns';

export function formatDateForInput(
  dateString: string | null | undefined
): string {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'yyyy-MM-dd');
  } catch {
    return '';
  }
}

export function formatDateLabel(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch {
    return '—';
  }
}

export function formatDateTimeLabel(
  dateString: string | null | undefined
): string {
  if (!dateString) return '—';
  try {
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  } catch {
    return '—';
  }
}

export function formatTimeForInput(
  timeString: string | null | undefined
): string {
  if (!timeString) return '';
  return timeString.substring(0, 5);
}

export function parseInputDate(
  value: string | null | undefined
): Date | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  // Form hidden input / search filters: yyyy-MM-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const date = new Date(`${trimmed}T12:00:00.000Z`);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  // DB timestamptz (e.g. 2026-05-22T00:00:00.000Z)
  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function toInputDateValue(date: Date | null | undefined): string {
  if (!date) return '';
  return format(date, 'yyyy-MM-dd');
}
