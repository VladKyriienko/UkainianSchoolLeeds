'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';

const LABELS = { en: 'Back', uk: 'Назад' } as const;

export default function BackToWhosWho() {
  const { language } = useLanguage();
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/about/whos-who">
        <ArrowLeft className="h-4 w-4 mr-2" />
        {LABELS[language]}
      </Link>
    </Button>
  );
}
