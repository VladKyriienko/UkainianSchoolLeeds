import { cn } from '@/utils/cn';

export type PageWrapperProps = {
  title: string;
  description?: React.ReactNode;
  goBackButton?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function PageWrapper({
  title,
  description,
  goBackButton,
  actions,
  children,
  className
}: PageWrapperProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {description ? (
            <p className="text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-4">
          {goBackButton ? goBackButton : null}
          {actions ? actions : null}
        </div>
      </div>

      {children}
    </div>
  );
}

