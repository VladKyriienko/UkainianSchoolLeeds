import * as React from 'react';

import { cn } from '@/utils/cn';

/** Card border, radius, and base shadow — no hover motion. */
export const CARD_SURFACE_STATIC_CLASSNAME =
  'rounded-2xl border border-border/60 bg-card text-card-foreground shadow-md shadow-primary/5';

/** Hover / focus-style elevation (use with `CARD_SURFACE_STATIC_CLASSNAME`). */
export const CARD_SURFACE_HOVER_CLASSNAME =
  'transition duration-400 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20';

/** Full default surface including hover — for custom elements (e.g. `<article>`). */
export const CARD_SURFACE_CLASSNAME = cn(
  CARD_SURFACE_STATIC_CLASSNAME,
  CARD_SURFACE_HOVER_CLASSNAME
);

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * When `false`, keeps the same surface but disables lift and stronger shadow on hover.
   * @default true
   */
  hoverable?: boolean;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = true, ...props }, ref) => (
    <div
      data-card=""
      ref={ref}
      className={cn(
        CARD_SURFACE_STATIC_CLASSNAME,
        hoverable && CARD_SURFACE_HOVER_CLASSNAME,
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-display font-semibold leading-snug tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
};
