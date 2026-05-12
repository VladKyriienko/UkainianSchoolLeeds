'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/language-provider';

const COOKIE_CONSENT_KEY = 'cookie_consent_v2';
const COOKIE_CONSENT_VALUES = {
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
} as const;

type CookieConsentValue =
  (typeof COOKIE_CONSENT_VALUES)[keyof typeof COOKIE_CONSENT_VALUES];

const COOKIE_POPUP_CONTENT = {
  en: {
    title: 'We use cookies',
    description:
      'We use cookies to improve your experience and analyze site usage.',
    accept: 'Accept',
    reject: 'Reject',
    policy: 'Cookies Policy'
  },
  uk: {
    title: 'Ми використовуємо cookies',
    description:
      'Ми використовуємо cookies для покращення вашого досвіду та аналізу використання сайту.',
    accept: 'Прийняти',
    reject: 'Відхилити',
    policy: 'Політика cookies'
  }
} as const;

function isCookieConsentValue(value: string | null): value is CookieConsentValue {
  return (
    value === COOKIE_CONSENT_VALUES.ACCEPTED ||
    value === COOKIE_CONSENT_VALUES.REJECTED
  );
}

function getStoredCookieConsent() {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch {
    return null;
  }
}

function setStoredCookieConsent(value: CookieConsentValue) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    // If storage is unavailable, keep the in-memory state update below.
  }
}

export function CookieConsentPopup() {
  const { language } = useLanguage();
  const content = COOKIE_POPUP_CONTENT[language];
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const consent = getStoredCookieConsent();
    setIsOpen(!isCookieConsentValue(consent));
    setIsReady(true);
  }, []);

  const handleAccept = () => {
    setStoredCookieConsent(COOKIE_CONSENT_VALUES.ACCEPTED);
    setIsOpen(false);
  };

  const handleReject = () => {
    setStoredCookieConsent(COOKIE_CONSENT_VALUES.REJECTED);
    setIsOpen(false);
  };

  if (!isReady || !isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-1200 px-2 pb-2 pt-0 md:px-4 md:pb-3">
      <div
        role="dialog"
        aria-labelledby="cookie-consent-title"
        className="mx-auto w-full max-w-[1400px] rounded-t-2xl border border-border bg-card text-card-foreground shadow-[0_-12px_40px_rgba(0,0,0,0.18)] ring-1 ring-black/5 dark:ring-white/10"
      >
        <div className="h-1 w-full rounded-t-[inherit] bg-linear-to-r" aria-hidden />
        <div className="flex w-full flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-5">
          <div className="min-w-0">
            <h2
              id="cookie-consent-title"
              className="font-sans text-lg font-semibold leading-normal text-foreground"
            >
              {content.title}
            </h2>
            <p className="mt-1 text-base text-muted-foreground">
              {content.description}{' '}
              <Link
                href="/cookies-policy"
                className="font-medium text-primary underline underline-offset-2 hover:text-primary/90"
              >
                {content.policy}
              </Link>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-end md:self-auto">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={handleReject}
              className="border-border bg-background text-foreground hover:bg-muted"
            >
              {content.reject}
            </Button>
            <Button
              type="button"
              size="default"
              onClick={handleAccept}
              className="bg-ukraine-yellow text-foreground hover:bg-[rgb(234,179,8)]"
            >
              {content.accept}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
