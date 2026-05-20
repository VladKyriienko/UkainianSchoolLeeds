'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/utils/cn';
import { validatePhone } from '@/utils/contact-validation';
import {
  buildPhoneE164,
  DEFAULT_PHONE_COUNTRY,
  formatNationalDisplay,
  getPhoneCountry,
  normalizeNationalDigits,
  parsePhoneValue,
  PHONE_COUNTRIES,
} from '@/utils/phone-countries';
import type { PhoneCountryCode, PhoneInputProps } from '@/types';

function emitChange(
  onChange: PhoneInputProps['onChange'],
  name: string | undefined,
  fullValue: string
) {
  if (!onChange) return;
  onChange({
    target: { name: name ?? '', value: fullValue }
  } as React.ChangeEvent<HTMLInputElement>);
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      error: errorProp,
      validateOnBlur = true,
      required = true,
      defaultCountry = DEFAULT_PHONE_COUNTRY,
      onValidationChange,
      onBlur,
      onChange,
      value: valueProp,
      defaultValue,
      name,
      id,
      placeholder: placeholderProp,
      disabled,
      ...props
    },
    ref
  ) => {
    const parsedInitial = React.useMemo(
      () => parsePhoneValue(valueProp ?? defaultValue ?? '', defaultCountry),
      [valueProp, defaultValue, defaultCountry]
    );

    const [countryCode, setCountryCode] = React.useState<PhoneCountryCode>(
      parsedInitial.countryCode
    );
    const [national, setNational] = React.useState(parsedInitial.national);
    const [internalError, setInternalError] = React.useState<string | undefined>();

    const country = getPhoneCountry(countryCode);
    const fullValue = buildPhoneE164(countryCode, national);
    const displayNational = formatNationalDisplay(national, country);
    const placeholder = placeholderProp ?? country.placeholder;
    const displayError = errorProp ?? internalError;

    React.useEffect(() => {
      if (valueProp === undefined) return;
      const next = parsePhoneValue(valueProp, defaultCountry);
      setCountryCode(next.countryCode);
      setNational(next.national);
    }, [valueProp, defaultCountry]);

    const runValidation = React.useCallback(
      (nextFull: string) => {
        const result = validatePhone(nextFull, { required, countryCode });
        setInternalError(result.isValid ? undefined : result.error);
        onValidationChange?.(result);
        return result;
      },
      [countryCode, onValidationChange, required]
    );

    const updateNational = (raw: string, nextCountry = countryCode) => {
      const nextCountryDef = getPhoneCountry(nextCountry);
      const digits = normalizeNationalDigits(raw, nextCountryDef);
      setNational(digits);
      const e164 = buildPhoneE164(nextCountry, digits);
      if (internalError) setInternalError(undefined);
      emitChange(onChange, name, e164);
    };

    const handleCountryChange = (next: PhoneCountryCode) => {
      setCountryCode(next);
      const nextCountry = getPhoneCountry(next);
      const digits = normalizeNationalDigits(national, nextCountry);
      setNational(digits);
      const e164 = buildPhoneE164(next, digits);
      if (internalError) setInternalError(undefined);
      emitChange(onChange, name, e164);
    };

    const handleNationalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNational(e.target.value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (validateOnBlur) {
        runValidation(fullValue);
      }
      onBlur?.(e);
    };

    return (
      <div className="space-y-1.5">
        <div className="flex gap-2">
          <Select
            value={countryCode}
            onValueChange={(v) => handleCountryChange(v as PhoneCountryCode)}
            disabled={disabled === true}
          >
            <SelectTrigger
              className="h-10 w-18 shrink-0 px-2"
              aria-label="Country code"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PHONE_COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  +{c.dialCode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            ref={ref}
            id={id}
            type="tel"
            inputMode="numeric"
            autoComplete={props.autoComplete ?? 'tel-national'}
            aria-invalid={displayError ? true : undefined}
            disabled={disabled}
            value={displayNational}
            onChange={handleNationalChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            maxLength={country.nationalLength.max + 8}
            className={cn(
              'min-w-0 flex-1',
              displayError && 'border-destructive',
              className
            )}
            {...props}
          />
        </div>

        {name ? <input type="hidden" name={name} value={fullValue} readOnly /> : null}

        {displayError ? (
          <p className="text-sm text-destructive" role="alert">
            {displayError}
          </p>
        ) : null}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
