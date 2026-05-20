export type PhoneCountryCode = 'GB' | 'UA' | 'IE' | 'PL' | 'US' | 'DE' | 'FR';

export type PhoneCountry = {
  code: PhoneCountryCode;
  label: string;
  dialCode: string;
  nationalLength: { min: number; max: number };
  placeholder: string;
  stripLeadingZero?: boolean;
};
