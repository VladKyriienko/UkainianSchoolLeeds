'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

type MobileMenuToggleButtonProps = {
  open: boolean;
  onClick: () => void;
  className?: string;
};

/** Animated burger ↔ X — same control as public site mobile nav. */
export function MobileMenuToggleButton({
  open,
  onClick,
  className
}: MobileMenuToggleButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        'relative h-10 w-10 shrink-0 text-ukraine-header-fg hover:bg-white/10 hover:text-ukraine-header-fg',
        className
      )}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
    >
      <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
      <span
        className={cn(
          'absolute inset-0 flex flex-col items-center justify-center gap-1.5 transition-transform duration-300 ease-out',
          open && 'gap-0'
        )}
      >
        <span
          className={cn(
            'block h-0.5 w-5 origin-center rounded-full bg-current transition-all duration-300 ease-out',
            open && 'translate-y-0.5 rotate-45'
          )}
        />
        <span
          className={cn(
            'block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out',
            open && 'scale-0 opacity-0'
          )}
        />
        <span
          className={cn(
            'block h-0.5 w-5 origin-center rounded-full bg-current transition-all duration-300 ease-out',
            open && '-translate-y-0.5 -rotate-45'
          )}
        />
      </span>
    </Button>
  );
}
