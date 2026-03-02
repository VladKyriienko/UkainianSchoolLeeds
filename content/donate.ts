export type DonateLanguage = 'en' | 'uk';

type DonateContent = {
  pageTitle: string;
  pageDescription: string;
  formTitle: string;
  amounts: { label: string; value: number }[];
  customAmountLabel: string;
  customAmountPlaceholder: string;
  submitButton: string;
  submittingButton: string;
  successTitle: string;
  successMessage: string;
  backToDonate: string;
};

export const DONATE_CONTENT: Record<DonateLanguage, DonateContent> = {
  en: {
    pageTitle: 'Donate',
    pageDescription:
      'Support the Ukrainian Saturday School of Leeds. Your donation helps us provide quality education and community support.',
    formTitle: 'Choose amount',
    amounts: [
      { label: '£5', value: 500 },
      { label: '£10', value: 1000 },
      { label: '£20', value: 2000 },
      { label: '£50', value: 5000 }
    ],
    customAmountLabel: 'Other amount (£)',
    customAmountPlaceholder: 'Enter amount',
    submitButton: 'Donate',
    submittingButton: 'Processing...',
    successTitle: 'Thank you!',
    successMessage:
      'Your donation has been received. Thank you for supporting our school community.',
    backToDonate: 'Donate again'
  },
  uk: {
    pageTitle: 'Підтримати',
    pageDescription:
      'Підтримайте Українську суботню школу Лідсу. Ваш донат допомагає нам надавати якісну освіту та підтримку громади.',
    formTitle: 'Оберіть суму',
    amounts: [
      { label: '£5', value: 500 },
      { label: '£10', value: 1000 },
      { label: '£20', value: 2000 },
      { label: '£50', value: 5000 }
    ],
    customAmountLabel: 'Інша сума (£)',
    customAmountPlaceholder: 'Введіть суму',
    submitButton: 'Підтримати',
    submittingButton: 'Обробка...',
    successTitle: 'Дякуємо!',
    successMessage:
      'Ваш донат отримано. Дякуємо за підтримку нашої шкільної громади.',
    backToDonate: 'Підтримати знову'
  }
};
