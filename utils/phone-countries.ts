import type { PhoneCountry, PhoneCountryCode } from '@/types/phone';

export type { PhoneCountry, PhoneCountryCode };

export const DEFAULT_PHONE_COUNTRY: PhoneCountryCode = 'GB';

export const PHONE_COUNTRIES: readonly PhoneCountry[] = [
  {
    code: 'GB',
    label: 'United Kingdom',
    dialCode: '44',
    nationalLength: { min: 10, max: 10 },
    placeholder: '7911 123456',
    stripLeadingZero: true
  },
  {
    code: 'UA',
    label: 'Ukraine',
    dialCode: '380',
    nationalLength: { min: 9, max: 9 },
    placeholder: '67 123 4567'
  },
  {
    code: 'IE',
    label: 'Ireland',
    dialCode: '353',
    nationalLength: { min: 9, max: 9 },
    placeholder: '85 123 4567'
  },
  {
    code: 'PL',
    label: 'Poland',
    dialCode: '48',
    nationalLength: { min: 9, max: 9 },
    placeholder: '512 345 678'
  },
  {
    code: 'US',
    label: 'United States',
    dialCode: '1',
    nationalLength: { min: 10, max: 10 },
    placeholder: '555 123 4567'
  },
  {
    code: 'DE',
    label: 'Germany',
    dialCode: '49',
    nationalLength: { min: 10, max: 11 },
    placeholder: '151 23456789'
  },
  {
    code: 'FR',
    label: 'France',
    dialCode: '33',
    nationalLength: { min: 9, max: 9 },
    placeholder: '6 12 34 56 78'
  }
] as const;

const byCode = new Map(PHONE_COUNTRIES.map((c) => [c.code, c]));

/** Longest dial codes first for parsing. */
const byDialCodeDesc = [...PHONE_COUNTRIES].sort(
  (a, b) => b.dialCode.length - a.dialCode.length
);

export function getPhoneCountry(code: string): PhoneCountry {
  return byCode.get(code as PhoneCountryCode) ?? byCode.get(DEFAULT_PHONE_COUNTRY)!;
}

export function phoneDigitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function normalizeNationalDigits(
  national: string,
  country: PhoneCountry
): string {
  let digits = phoneDigitsOnly(national);
  if (country.stripLeadingZero && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits.slice(0, country.nationalLength.max);
}

/** Format national digits with light spacing for display. */
export function formatNationalDisplay(
  digits: string,
  country: PhoneCountry
): string {
  const d = normalizeNationalDigits(digits, country);
  if (!d) return '';

  switch (country.code) {
    case 'GB':
      return d.length <= 4 ? d : `${d.slice(0, 4)} ${d.slice(4)}`;
    case 'US':
      if (d.length <= 3) return d;
      if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
      return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
    case 'UA':
    case 'IE':
      if (d.length <= 2) return d;
      if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
      return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
    default:
      if (d.length <= 3) return d;
      return `${d.slice(0, 3)} ${d.slice(3)}`;
  }
}

export function buildPhoneE164(
  countryCode: PhoneCountryCode,
  national: string
): string {
  const country = getPhoneCountry(countryCode);
  const digits = normalizeNationalDigits(national, country);
  if (!digits) return '';
  return `+${country.dialCode}${digits}`;
}

export function parsePhoneValue(
  value: string,
  fallbackCountry: PhoneCountryCode = DEFAULT_PHONE_COUNTRY
): { countryCode: PhoneCountryCode; national: string } {
  const trimmed = value.trim();
  if (!trimmed) {
    return { countryCode: fallbackCountry, national: '' };
  }

  const digits = phoneDigitsOnly(trimmed);

  for (const country of byDialCodeDesc) {
    if (digits.startsWith(country.dialCode)) {
      return {
        countryCode: country.code,
        national: normalizeNationalDigits(
          digits.slice(country.dialCode.length),
          country
        )
      };
    }
  }

  const country = getPhoneCountry(fallbackCountry);
  return {
    countryCode: fallbackCountry,
    national: normalizeNationalDigits(trimmed, country)
  };
}

export function getPhoneInvalidMessage(country: PhoneCountry): string {
  const { min, max } = country.nationalLength;
  if (min === max) {
    return `Enter a valid ${country.label} phone number (${max} digits)`;
  }
  return `Enter a valid ${country.label} phone number (${min}–${max} digits)`;
}

export function isValidNationalForCountry(
  national: string,
  countryCode: PhoneCountryCode
): boolean {
  const country = getPhoneCountry(countryCode);
  const digits = normalizeNationalDigits(national, country);
  const { min, max } = country.nationalLength;
  return digits.length >= min && digits.length <= max;
}
