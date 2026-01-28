export type ContactLanguage = 'en' | 'uk';

type ContactContent = {
  pageTitle: string;
  pageDescription: string;
  formTitle: string;
  fields: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
  };
  submitButton: string;
  submittingButton: string;
  successMessage: string;
  errorFallback: string;
  infoTitle: string;
  addressTitle: string;
  addressText: string;
  phoneTitle: string;
  phoneValue: string;
  emailTitle: string;
  emailValue: string;
  hoursTitle: string;
  hoursText: string;
  emergencyTitle: string;
  emergencyText: string;
};

export const CONTACT_CONTENT: Record<ContactLanguage, ContactContent> = {
  en: {
    pageTitle: 'Contact Us',
    pageDescription: 'Please fill out the form below to contact us.',
    formTitle: 'Contact Us',
    fields: {
      nameLabel: 'Name',
      namePlaceholder: 'Enter your name',
      emailLabel: 'Email',
      emailPlaceholder: 'Enter your email',
      phoneLabel: 'Phone',
      phonePlaceholder: 'Enter your phone number',
      subjectLabel: 'Subject',
      subjectPlaceholder: 'Enter the subject of your message',
      messageLabel: 'Message',
      messagePlaceholder: 'Enter your message'
    },
    submitButton: 'Submit',
    submittingButton: 'Submitting...',
    successMessage: 'Your message has been sent successfully.',
    errorFallback: 'Failed to submit message. Please try again.',
    infoTitle: 'Contact Information',
    addressTitle: 'Address',
    addressText: 'Address, City, Postcode',
    phoneTitle: 'Phone',
    phoneValue: '01234567890',
    emailTitle: 'Email',
    emailValue: 'info@ukrainiaschool.com',
    hoursTitle: 'Hours',
    hoursText: 'Monday to Friday, 9am to 5pm',
    emergencyTitle: 'Emergency Contact',
    emergencyText: 'In case of an emergency, please contact the school office.'
  },
  uk: {
    pageTitle: 'Зв’яжіться з нами',
    pageDescription:
      'Будь ласка, заповніть форму нижче, щоб зв’язатися з нами.',
    formTitle: 'Зв’яжіться з нами',
    fields: {
      nameLabel: "Ім'я",
      namePlaceholder: "Введіть ваше ім'я",
      emailLabel: 'Електронна пошта',
      emailPlaceholder: 'Введіть вашу електронну пошту',
      phoneLabel: 'Телефон',
      phonePlaceholder: 'Введіть ваш номер телефону',
      subjectLabel: 'Тема',
      subjectPlaceholder: 'Введіть тему повідомлення',
      messageLabel: 'Повідомлення',
      messagePlaceholder: 'Введіть ваше повідомлення'
    },
    submitButton: 'Надіслати',
    submittingButton: 'Надсилання...',
    successMessage: 'Ваше повідомлення було успішно надіслано.',
    errorFallback: 'Не вдалося надіслати повідомлення. Спробуйте ще раз.',
    infoTitle: 'Контактна інформація',
    addressTitle: 'Адреса',
    addressText: 'Адреса, Місто, Поштовий індекс',
    phoneTitle: 'Телефон',
    phoneValue: '01234567890',
    emailTitle: 'Електронна пошта',
    emailValue: 'info@ukrainiaschool.com',
    hoursTitle: 'Години роботи',
    hoursText: 'Понеділок – П’ятниця, з 9:00 до 17:00',
    emergencyTitle: 'Екстрений зв’язок',
    emergencyText:
      'У разі надзвичайної ситуації, будь ласка, зв’яжіться з офісом школи.'
  }
};
