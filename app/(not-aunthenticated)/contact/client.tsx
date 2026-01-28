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
import { Mail, Phone, MapPin, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import { CONTACT_COPY } from '@/content/contact';

export default function ContactContent() {
  const { language } = useLanguage();
  const copy = CONTACT_COPY[language];
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
      <Card>
        <CardHeader>
          <CardTitle>{copy.formTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{copy.fields.nameLabel}</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={copy.fields.namePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{copy.fields.emailLabel}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={copy.fields.emailPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{copy.fields.phoneLabel}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder={copy.fields.phonePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">{copy.fields.subjectLabel}</Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder={copy.fields.subjectPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{copy.fields.messageLabel}</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleChange}
                placeholder={copy.fields.messagePlaceholder}
              />
            </div>

            {submitStatus === 'success' && (
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-200">
                {copy.successMessage}
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-200 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>{errorMessage || copy.errorFallback}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? copy.submittingButton : copy.submitButton}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{copy.infoTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">{copy.addressTitle}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {copy.addressText}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">{copy.phoneTitle}</h3>
                <a
                  href={`tel:${copy.phoneValue}`}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  {copy.phoneValue}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">{copy.emailTitle}</h3>
                <a
                  href={`mailto:${copy.emailValue}`}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  {copy.emailValue}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">{copy.hoursTitle}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {copy.hoursText}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.emergencyTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{copy.emergencyText}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

