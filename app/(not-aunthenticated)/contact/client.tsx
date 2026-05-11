'use client';

import { useState } from 'react';
import { createMessageAction } from './actions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock, AlertCircle, Navigation } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import { CONTACT_CONTENT } from '@/content/contact';
import { cn } from '@/utils/cn';

export default function ContactContent() {
  const { language } = useLanguage();
  const content = CONTACT_CONTENT[language];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage(null);

    try {
      await createMessageAction({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      });

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error('Failed to submit message', err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit message. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Contact Form */}
      <Card hoverable={false} className="min-w-0">
        <CardHeader>
          <CardTitle>{content.formTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{content.fields.nameLabel}</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={content.fields.namePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{content.fields.emailLabel}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={content.fields.emailPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{content.fields.phoneLabel}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder={content.fields.phonePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">{content.fields.subjectLabel}</Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder={content.fields.subjectPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{content.fields.messageLabel}</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleChange}
                placeholder={content.fields.messagePlaceholder}
              />
            </div>

            {submitStatus === 'success' && (
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-200">
                {content.successMessage}
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-200 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>{errorMessage || content.errorFallback}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? content.submittingButton : content.submitButton}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <div className="space-y-6 min-w-0">
        <Card hoverable={false} className="min-w-0">
          <CardHeader>
            <CardTitle>{content.infoTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
              <div className="min-w-0">
                <h3 className={cn('font-semibold leading-snug font-display text-foreground', 'mb-1')}>{content.addressTitle}</h3>
                <p className="text-muted-foreground whitespace-pre-line wrap-break-word">
                  {content.addressText}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
              <div className="min-w-0">
                <h3 className={cn('font-semibold leading-snug font-display text-foreground', 'mb-1')}>{content.phoneTitle}</h3>
                <a
                  href={`tel:${content.phoneValue}`}
                  className="text-muted-foreground hover:underline wrap-break-word"
                >
                  {content.phoneValue}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
              <div className="min-w-0">
                <h3 className={cn('font-semibold leading-snug font-display text-foreground', 'mb-1')}>{content.emailTitle}</h3>
                <a
                  href={`mailto:${content.emailValue}`}
                  className="text-muted-foreground hover:underline break-all"
                >
                  {content.emailValue}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
              <div className="min-w-0">
                <h3 className={cn('font-semibold leading-snug font-display text-foreground', 'mb-1')}>{content.hoursTitle}</h3>
                <p className="text-muted-foreground whitespace-pre-line wrap-break-word">
                  {content.hoursText}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hoverable={false} className="min-w-0">
          <CardHeader>
            <CardTitle>{content.emergencyTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{content.emergencyText}</p>
          </CardContent>
        </Card>
      </div>

      {/* Map — full-width section without card container */}
      <section className="lg:col-span-2 min-w-0 space-y-4">
        <div className="space-y-3">
          <h2 className="max-md:text-2xl font-bold tracking-tight md:text-h2 font-display text-foreground flex items-center gap-2">
            <MapPin className="h-5 w-5 shrink-0" />
            {content.addressTitle}
          </h2>
          <div className="flex items-start gap-4">
            <Navigation className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <h3 className={cn('font-semibold leading-snug font-display text-foreground', 'mb-1')}>{content.directionsTitle}</h3>
              <p className="text-muted-foreground whitespace-pre-line wrap-break-word">
                {content.directionsText}
              </p>
            </div>
          </div>
        </div>
        <div className="relative w-full overflow-hidden rounded-lg border border-border bg-muted/30" style={{ aspectRatio: '16/9', minHeight: '280px' }}>
          <iframe
            title={content.addressTitle}
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              content.mapQuery
            )}&output=embed`}
            width="100%"
            height="100%"
            className="absolute inset-0 border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </div>
  );
}

