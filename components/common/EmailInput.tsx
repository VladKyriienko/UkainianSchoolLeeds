'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { validateEmail } from '@/utils/contact-validation';
import type { EmailInputProps } from '@/types';

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  (
    {
      className,
      error: errorProp,
      validateOnBlur = true,
      required = true,
      onValidationChange,
      onBlur,
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalError, setInternalError] = React.useState<string | undefined>();

    const displayError = errorProp ?? internalError;

    const runValidation = React.useCallback(
      (value: string) => {
        const result = validateEmail(value, { required });
        setInternalError(result.isValid ? undefined : result.error);
        onValidationChange?.(result);
        return result;
      },
      [onValidationChange, required]
    );

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (validateOnBlur) {
        runValidation(e.target.value);
      }
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (internalError) {
        setInternalError(undefined);
      }
      onChange?.(e);
    };

    return (
      <div className="space-y-1.5">
        <Input
          ref={ref}
          type="email"
          inputMode="email"
          autoComplete={props.autoComplete ?? 'email'}
          spellCheck={false}
          aria-invalid={displayError ? true : undefined}
          className={cn(displayError && 'border-destructive', className)}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        {displayError ? (
          <p className="text-sm text-destructive" role="alert">
            {displayError}
          </p>
        ) : null}
      </div>
    );
  }
);

EmailInput.displayName = 'EmailInput';

export { EmailInput };
