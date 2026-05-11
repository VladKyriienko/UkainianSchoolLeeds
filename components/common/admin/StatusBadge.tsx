import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

const statusVariants = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-red-200 bg-red-50 text-red-700',
  muted: 'border-border bg-muted text-muted-foreground',
  info: 'border-primary/25 bg-secondary text-primary'
} as const;

type StatusBadgeVariant = keyof typeof statusVariants;

type StatusBadgeProps = {
  label: string;
  variant?: StatusBadgeVariant;
  className?: string;
};

export function StatusBadge({
  label,
  variant = 'muted',
  className
}: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(statusVariants[variant], className)}>
      {label}
    </Badge>
  );
}
