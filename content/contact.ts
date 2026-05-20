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
  mapQuery: string;
  directionsTitle: string;
  directionsText: string;
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
    addressTitle: 'Find us',
    addressText:
      'The Association of Ukrainians in Great Britain\n5 Back Newton Grove\nLeeds\nLS7 4HW',
    mapQuery:
      'The Association of Ukrainians in Great Britain, 5 Back Newton Grove, Leeds LS7 4HW, United Kingdom',
    directionsTitle: 'How to get here',
    directionsText:
      'Located in Leeds, easily accessible by public transport and car. Several bus routes stop nearby. Free parking available on site.',
    phoneTitle: 'Phone',
    phoneValue: '01234567890',
    emailTitle: 'Email',
    emailValue: 'info@ukrainiaschool.com',
    hoursTitle: 'Hours',
    hoursText: 'Saturday, 2:00 pm to 5:30 pm',
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
    addressTitle: 'Знайдіть нас',
    addressText:
      'The Association of Ukrainians in Great Britain\n5 Back Newton Grove\nLeeds\nLS7 4HW',
    mapQuery:
      'The Association of Ukrainians in Great Britain, 5 Back Newton Grove, Leeds LS7 4HW, United Kingdom',
    directionsTitle: 'Як до нас дістатися',
    directionsText:
      'Розташовано в Лідсі, зручно дістатися громадським транспортом або автомобілем. Поруч зупиняються кілька автобусних маршрутів. Безкоштовна парковка на території.',
    phoneTitle: 'Телефон',
    phoneValue: '01234567890',
    emailTitle: 'Електронна пошта',
    emailValue: 'info@ukrainiaschool.com',
    hoursTitle: 'Години роботи',
    hoursText: 'Субота, з 14:00 до 17:30',
    emergencyTitle: 'Екстрений зв’язок',
    emergencyText:
      'У разі надзвичайної ситуації, будь ласка, зв’яжіться з офісом школи.'
  }
};
