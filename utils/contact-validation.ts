import { z } from 'zod';
import {
  buildPhoneE164,
  getPhoneCountry,
  getPhoneInvalidMessage,
  isValidNationalForCountry,
  parsePhoneValue,
  phoneDigitsOnly,
  type PhoneCountryCode
} from '@/utils/phone-countries';

const EMAIL_MESSAGE = 'Enter a valid email address';
const PHONE_REQUIRED_MESSAGE = 'Phone number is required';

export { phoneDigitsOnly };

/** @deprecated Use PhoneInput country selector; kept for plain text fields. */
export function sanitizePhoneInput(value: string): string {
  return value.replace(/[^\d+\s\-()]/g, '');
}

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email(EMAIL_MESSAGE)
  .transform((v) => v.toLowerCase());

export function validateEmail(
  email: string,
  options?: { required?: boolean }
): { isValid: boolean; error?: string; value: string } {
  const required = options?.required ?? true;
  const trimmed = email.trim();

  if (!required && !trimmed) {
    return { isValid: true, value: '' };
  }

  try {
    const parsed = emailSchema.parse(trimmed);
    return { isValid: true, value: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors[0]?.message ?? EMAIL_MESSAGE,
        value: trimmed.toLowerCase()
      };
    }
    return { isValid: false, error: EMAIL_MESSAGE, value: trimmed.toLowerCase() };
  }
}

export function validatePhone(
  phone: string,
  options?: { required?: boolean; countryCode?: PhoneCountryCode }
): { isValid: boolean; error?: string; value: string } {
  const required = options?.required ?? true;
  const trimmed = phone.trim();

  if (!required && !trimmed) {
    return { isValid: true, value: '' };
  }

  if (!trimmed) {
    return { isValid: false, error: PHONE_REQUIRED_MESSAGE, value: '' };
  }

  const parsed = parsePhoneValue(trimmed, options?.countryCode);
  const country = getPhoneCountry(parsed.countryCode);
  const nationalDigits = phoneDigitsOnly(parsed.national);

  if (!isValidNationalForCountry(nationalDigits, parsed.countryCode)) {
    return {
      isValid: false,
      error: getPhoneInvalidMessage(country),
      value: buildPhoneE164(parsed.countryCode, nationalDigits)
    };
  }

  return {
    isValid: true,
    value: buildPhoneE164(parsed.countryCode, nationalDigits)
  };
}

