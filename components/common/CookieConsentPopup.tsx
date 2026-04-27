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
    <div className="cookie-consent-banner fixed inset-x-0 bottom-0 z-[1200] border-t shadow-2xl shadow-slate-950/20 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-5">
        <div className="min-w-0">
          <h2 className="text-base font-semibold">{content.title}</h2>
          <p className="mt-1 text-sm text-white/85">
            {content.description}{' '}
            <Link href="/cookies-policy" className="underline underline-offset-2 text-white">
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
            className="public-button-outline"
          >
            {content.reject}
          </Button>
          <Button
            type="button"
            size="default"
            onClick={handleAccept}
            className="public-button-yellow"
          >
            {content.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
