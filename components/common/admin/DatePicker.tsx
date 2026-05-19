'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

type DatePickerProps = {
  date: Date | undefined;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  displayFormat?: string;
  disabled?: (date: Date) => boolean;
  className?: string;
  buttonClassName?: string;
  calendarClassName?: string;
  captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';
  fromYear?: number;
  toYear?: number;
  defaultMonth?: Date;
};

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      date,
      onDateChange,
      placeholder = 'Pick a date',
      displayFormat = 'dd.MM.yyyy',
      disabled,
      className,
      buttonClassName,
      calendarClassName,
      captionLayout = 'dropdown',
      fromYear,
      toYear,
      defaultMonth,
      ...props
    },
    ref
  ) => {
    const initialMonth = date ?? defaultMonth;

    return (
      <div className={cn('w-full', className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal transition-colors hover:border-primary/50 hover:bg-accent/40',
                !date && 'text-muted-foreground',
                buttonClassName
              )}
              {...props}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, displayFormat) : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange || (() => { })}
              required={false}
              {...(initialMonth && { defaultMonth: initialMonth })}
              {...(disabled && { disabled })}
              {...(captionLayout && { captionLayout })}
              {...(fromYear && { fromYear })}
              {...(toYear && { toYear })}
              className={calendarClassName || ''}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export { DatePicker };
export type { DatePickerProps };
