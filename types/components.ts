import type * as React from 'react';
import type { User } from '@supabase/supabase-js';
import type { Sidebar } from '@/components/ui/sidebar';
import type { Input } from '@/components/ui/input';
import type { CompletionBannerData } from '@/types/auth';
import type { RouteConfig } from '@/types/navigation';
import type { PhoneCountryCode } from '@/types/phone';

export type PageWrapperProps = {
  title: string | { en: string; uk: string };
  description?: string | { en: string; uk: string } | React.ReactNode;
  goBackButton?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export type AuthenticatedLayoutProps = {
  children: React.ReactNode;
  navItems?: RouteConfig[] | undefined;
  showLanguageToggle?: boolean;
  completionBannerData?: CompletionBannerData | null | undefined;
  showDarkModeToggle?: boolean;
  defaultOpen?: boolean;
  mobileBurgerPosition?: 'left' | 'right';
  disableCardHover?: boolean;
};

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: User | null | undefined;
  userProfile?:
    | { full_name: string | null; avatar_url: string | null }
    | null
    | undefined;
  isAdmin?: boolean | undefined;
  navItems?: RouteConfig[] | undefined;
  completionBannerData?: CompletionBannerData | null | undefined;
  showDarkModeToggle?: boolean;
  showLanguageToggle?: boolean;
  showSidebarTrigger?: boolean;
  className?: string;
  mobileBurgerPosition?: 'left' | 'right';
};

export type PublicLayoutProps = {
  children: React.ReactNode;
  showHeader?: boolean;
  showDarkModeToggle?: boolean;
  showFooter?: boolean;
  showNavigation?: boolean;
};

export type PublicNavBarProps = {
  showDarkModeToggle?: boolean;
  showNavigation?: boolean;
  sheetPortalContainer?: HTMLDivElement | null;
  onMobileMenuOpenChange?: (open: boolean) => void;
};

export type PublicFooterProps = {
  className?: string;
};

export type MobileHeaderProps = {
  showDarkModeToggle?: boolean;
  showLanguageToggle?: boolean;
  burgerPosition?: 'left' | 'right';
  /** Public-site styling (fixed ukraine header + menu below). */
  variant?: 'default' | 'public';
  className?: string;
};

export type PhotoLightboxImage = {
  src: string;
  alt?: string;
};

export type CalendarClientProps = {
  initialEvents: import('@/types/calendar').CalendarEvent[];
  initialSchedules: import('@/types/calendar').CalendarSchedule[];
};

export type EmailInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'type' | 'inputMode' | 'autoComplete'
> & {
  error?: string | undefined;
  validateOnBlur?: boolean;
  required?: boolean;
  onValidationChange?: (result: {
    isValid: boolean;
    error?: string;
    value: string;
  }) => void;
  autoComplete?: 'email' | 'username' | 'off';
};

export type PhoneInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'type' | 'inputMode' | 'autoComplete' | 'value' | 'defaultValue' | 'onChange' | 'placeholder'
> & {
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string | undefined;
  validateOnBlur?: boolean;
  required?: boolean;
  defaultCountry?: PhoneCountryCode;
  onValidationChange?: (result: {
    isValid: boolean;
    error?: string;
    value: string;
  }) => void;
  autoComplete?: 'tel' | 'tel-national' | 'off';
};

export type PasswordInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'type'
> & {
  className?: string;
};
