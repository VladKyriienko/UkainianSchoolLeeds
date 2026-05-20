'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmailInput } from '@/components/common/EmailInput';
import { PhoneInput } from '@/components/common/PhoneInput';
import { Input } from '@/components/ui/input';
import { createMessageAction } from '@/app/(public)/contact/actions';
import { validateEmail, validatePhone } from '@/utils/contact-validation';
import type { HomeContent } from '@/types';

type HomeCtaContent = HomeContent['cta'];

export function HomeLeadCtaSection({ cta }: { cta: HomeCtaContent }) {
  const [form, setForm] = useState({
    parentName: '',
    phone: '',
    email: '',
    childAge: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') setEmailError(undefined);
    if (name === 'phone') setPhoneError(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setEmailError(undefined);
    setPhoneError(undefined);

    if (
      !form.parentName.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.childAge.trim()
    ) {
      setErrorText(cta.fillAllFields);
      return;
    }

    const emailResult = validateEmail(form.email);
    const phoneResult = validatePhone(form.phone);
    if (!emailResult.isValid) setEmailError(emailResult.error);
    if (!phoneResult.isValid) setPhoneError(phoneResult.error);
    if (!emailResult.isValid || !phoneResult.isValid) return;

    setStatus('submitting');
    try {
      await createMessageAction({
        name: form.parentName.trim(),
        email: emailResult.value,
        phone: phoneResult.value,
        subject: cta.messageSubject,
        message: form.childAge.trim()
      });
      setForm({ parentName: '', phone: '', email: '', childAge: '' });
      setStatus('success');
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : cta.errorMessage);
      setStatus('idle');
    }
  };

  return (
    <section className="w-full min-w-0 max-w-full">
      <div className="w-full min-w-0 overflow-visible rounded-4xl bg-primary px-6 py-10 text-primary-foreground shadow-xl shadow-primary/20 md:px-10 md:py-12 lg:px-12 lg:py-14">
        <div className="flex flex-col items-stretch gap-10 lg:flex-row lg:items-stretch lg:gap-10 xl:gap-14">
          <div className="relative flex min-w-0 shrink-0 flex-col justify-center lg:max-w-xl">
            <h2 className="text-balance font-display text-2xl font-bold leading-tight tracking-tight md:text-4xl">
              <span>{cta.titleBefore}</span>
              <span>{cta.titleHighlight}</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span>{cta.titleAfter}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/home/hero-card-1.png"
                  alt=""
                  width={40}
                  height={40}
                  className="h-8 w-8 shrink-0 object-contain md:h-9 md:w-9"
                />
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/88 md:text-base">
              {cta.description}
            </p>
          </div>

          <div className="relative min-h-0 min-w-0 flex-1">
            <form
              id="home-lead-cta-form"
              onSubmit={handleSubmit}
              className="relative w-full"
              noValidate
            >
              <div className="w-full rounded-2xl bg-card p-5 pb-8 text-foreground shadow-md sm:p-6 sm:pb-10">
                {status === 'success' ? (
                  <p className="py-4 text-center text-sm font-medium leading-relaxed text-primary">{cta.successMessage}</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-3">
                      <Input
                        name="parentName"
                        value={form.parentName}
                        onChange={handleChange}
                        placeholder={cta.placeholders.parentName}
                        autoComplete="name"
                        disabled={status === 'submitting'}
                        className="h-11 rounded-lg border-border/80 bg-background"
                        aria-label={cta.placeholders.parentName}
                      />
                      <PhoneInput
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        error={phoneError}
                        validateOnBlur
                        placeholder={cta.placeholders.phone}
                        disabled={status === 'submitting'}
                        className="h-11 rounded-lg border-border/80 bg-background"
                        aria-label={cta.placeholders.phone}
                      />
                      <EmailInput
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        error={emailError}
                        validateOnBlur
                        placeholder={cta.placeholders.email}
                        disabled={status === 'submitting'}
                        className="h-11 rounded-lg border-border/80 bg-background"
                        aria-label={cta.placeholders.email}
                      />
                      <Input
                        name="childAge"
                        value={form.childAge}
                        onChange={handleChange}
                        placeholder={cta.placeholders.childAge}
                        disabled={status === 'submitting'}
                        className="h-11 rounded-lg border-border/80 bg-background"
                        aria-label={cta.placeholders.childAge}
                      />
                    </div>
                    {errorText ? (
                      <p className="mt-3 text-sm text-destructive" role="alert">
                        {errorText}
                      </p>
                    ) : null}
                  </>
                )}
              </div>

              {status !== 'success' ? (
                <Button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="absolute left-1/2 top-full z-10 flex h-14 min-w-[min(100%,17.5rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-3 rounded-full border-0 bg-ukraine-yellow px-5 pl-8 pr-2 text-base font-semibold text-foreground shadow-lg transition-colors hover:bg-[rgb(234,179,8)] disabled:opacity-70"
                >
                  <span>{status === 'submitting' ? cta.submitting : cta.submit}</span>
                  <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                </Button>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
