'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

type FullPageLoaderProps = {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
};

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
};

export function FullPageLoader({
  message = 'Loading...',
  className,
  size = 'lg',
  variant = 'default'
}: FullPageLoaderProps) {
  if (variant === 'minimal') {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-background/80 backdrop-blur-sm',
          className
        )}
      >
        <Loader2
          className={cn('animate-spin text-primary', sizeClasses[size])}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center w-full justify-center bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4 rounded-lg bg-card p-8 shadow-lg border">
        <Loader2
          className={cn('animate-spin text-primary', sizeClasses[size])}
        />
        {message && (
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export type { FullPageLoaderProps };
