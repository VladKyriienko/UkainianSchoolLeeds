'use client';

import Link from 'next/link';
import { useLanguage } from '@/providers/language-provider';
import { DONATE_CONTENT } from '@/content/donate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DonateSuccessPage() {
  const { language } = useLanguage();
  const content = DONATE_CONTENT[language];

  return (
    <div className="max-w-md mx-auto">
      <Card hoverable={false}>
        <CardHeader>
          <CardTitle className="text-2xl text-ukraine-blue">{content.successTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{content.successMessage}</p>
          <Button asChild className="w-full">
            <Link href="/donate">{content.backToDonate}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
