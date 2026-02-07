'use client';

import { useState } from 'react';
import { useLanguage } from '@/providers/language-provider';
import { DONATE_CONTENT } from '@/content/donate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DonateClient() {
  const { language } = useLanguage();
  const content = DONATE_CONTENT[language];
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAmountCents = (): number | null => {
    if (customAmount.trim()) {
      const parsed = parseFloat(customAmount.replace(',', '.'));
      if (isNaN(parsed) || parsed <= 0) return null;
      return Math.round(parsed * 100);
    }
    return selectedAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountCents = getAmountCents();
    if (!amountCents || amountCents < 100) {
      setError(language === 'uk' ? 'Мінімальна сума £1' : 'Minimum amount is £1');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/donate/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountCents })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{content.formTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {content.amounts.map(({ label, value }) => (
              <Button
                key={value}
                type="button"
                variant={selectedAmount === value && !customAmount ? 'default' : 'outline'}
                className="h-12"
                onClick={() => {
                  setSelectedAmount(value);
                  setCustomAmount('');
                }}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customAmount">{content.customAmountLabel}</Label>
            <Input
              id="customAmount"
              type="text"
              inputMode="decimal"
              placeholder={content.customAmountPlaceholder}
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? content.submittingButton : content.submitButton}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
