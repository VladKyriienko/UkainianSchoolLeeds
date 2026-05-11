'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b border-border', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-5 text-left text-base font-semibold text-foreground transition hover:text-primary [&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export type AccordionContentProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Content
> & {
  /**
   * `overlay` — answer floats under the trigger (no layout shift in grids).
   * Default — in-flow height animation (standard accordion).
   */
  variant?: 'default' | 'overlay';
};

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, variant = 'default', ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'text-sm text-muted-foreground',
      variant === 'default' &&
        'overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      variant === 'overlay' &&
        cn(
          'absolute left-0 right-0 top-full z-20 mt-1 min-w-0 max-h-[min(60vh,24rem)] overflow-x-hidden overflow-y-auto rounded-xl border border-border/80 bg-card px-0 py-0 shadow-lg outline-none',
          'data-[state=closed]:animate-none data-[state=open]:animate-none'
        ),
      className
    )}
    {...props}
  >
    <div className={cn('pb-5 pt-1 leading-7', variant === 'overlay' && 'px-4 pb-4 pt-2 md:px-5')}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
