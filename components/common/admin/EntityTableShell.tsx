import type { ReactNode } from 'react';

type EntityTableShellProps = {
  children: ReactNode;
};

export function EntityTableShell({ children }: EntityTableShellProps) {
  return (
    <div className="overflow-hidden rounded-md border">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
