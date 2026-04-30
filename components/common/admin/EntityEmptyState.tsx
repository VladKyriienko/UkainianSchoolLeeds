import type { LucideIcon } from 'lucide-react';

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
      <h3 className="mb-2 text-lg font-semibold text-muted-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
