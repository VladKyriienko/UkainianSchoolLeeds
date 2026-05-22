export const PWA_COPY = {
  en: {
    title: 'Install the app',
    body: 'Add this site to your home screen for a full-screen experience without the browser bar.',
    install: 'Install app',
    iosHint: 'Tap Share, then “Add to Home Screen”.',
    browserHint:
      'Open the browser menu (⋮) and choose “Install app” or “Add to Home screen”.',
    dismiss: 'Not now'
  },
  uk: {
    title: 'Встановити додаток',
    body: 'Додайте сайт на головний екран — відкриватиметься на весь екран без смуги браузера.',
    install: 'Встановити додаток',
    iosHint: 'Натисніть «Поділитися», потім «На Початковий екран».',
    browserHint:
      'Відкрийте меню браузера (⋮) і оберіть «Встановити додаток» або «На головний екран».',
    dismiss: 'Не зараз'
  }
} as const;

export type PwaLanguage = keyof typeof PWA_COPY;
