'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Language } from '@/types';

export type { Language };

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/** After React/layout, restore viewport scroll (language switch can reflow and reset scroll). */
function scheduleRestoreWindowScroll(left: number, top: number) {
  requestAnimationFrame(() => {
    window.scrollTo(left, top);
    requestAnimationFrame(() => {
      window.scrollTo(left, top);
    });
  });
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const left = window.scrollX;
    const top = window.scrollY;
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage === 'en' || savedLanguage === 'uk') {
      setLanguageState(savedLanguage);
      document.documentElement.setAttribute('lang', savedLanguage);
    } else {
      // Default to browser language or English
      const browserLang = navigator.language.split('-')[0];
      const defaultLang: Language = browserLang === 'uk' ? 'uk' : 'en';
      setLanguageState(defaultLang);
      document.documentElement.setAttribute('lang', defaultLang);
    }
    scheduleRestoreWindowScroll(left, top);
  }, []);

  const setLanguage = (lang: Language) => {
    const left = window.scrollX;
    const top = window.scrollY;
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);
    scheduleRestoreWindowScroll(left, top);
  };

  const toggleLanguage = () => {
    const newLang: Language = language === 'en' ? 'uk' : 'en';
    setLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
