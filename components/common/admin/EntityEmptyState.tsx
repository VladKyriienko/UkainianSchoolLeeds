import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

type EntityEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function EntityEmptyState({
  icon: Icon,
  title,
  description
}: EntityEmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <Icon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className={cn('font-semibold leading-snug font-display text-foreground', 'mb-2 text-muted-foreground')}>{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
